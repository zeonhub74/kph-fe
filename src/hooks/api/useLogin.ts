import { useCallback, useEffect, useState } from 'react'
import { getApiErrorMessage } from '@/api/http'
import { login } from '@/api/login/route'
import { logout } from '@/api/logout/route'
import { supabase } from '@/components/supabaseClient'

export type LoginPayload = {
	email: string
	password: string
}

export type AuthUser = {
	id?: string
	email?: string
	user_metadata?: Record<string, unknown>
	app_metadata?: Record<string, unknown>
	role?: unknown
	roles?: unknown
	is_admin?: unknown
	isAdmin?: unknown
	admin?: unknown
	[key: string]: unknown
}

export type AuthProfile = {
	role?: unknown
	[key: string]: unknown
}

export type AuthSessionResponse = {
	access_token: string
	refresh_token?: string
	token_type?: string
	expires_in?: number
	expires_at?: number
	role?: unknown
	roles?: unknown
	user_role?: unknown
	is_admin?: unknown
	isAdmin?: unknown
	admin?: unknown
	user?: AuthUser
	profile?: AuthProfile
	[key: string]: unknown
}

export type LogoutResponse = {
	message: string
}

const AUTH_STORAGE_KEY = 'kph.auth.session'
const AUTH_SESSION_EVENT = 'kph.auth.session.changed'

function isBrowser() {
	return typeof window !== 'undefined'
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function hasAccessToken(value: unknown): value is AuthSessionResponse {
	return isRecord(value) && typeof value.access_token === 'string' && value.access_token.length > 0
}

function extractSessionHints(record: Record<string, unknown>) {
	const hints: Partial<AuthSessionResponse> = {}
	const hintKeys: Array<keyof AuthSessionResponse> = ['role', 'roles', 'user_role', 'is_admin', 'isAdmin', 'admin', 'user']

	for (const key of hintKeys) {
		const candidate = record[key]
		if (typeof candidate !== 'undefined') {
			hints[key] = candidate as never
		}
	}

	return hints
}

function mergeSessionWithHints(session: AuthSessionResponse, hints: Partial<AuthSessionResponse>) {
	return {
		...session,
		...hints,
	}
}

function normalizeAppRole(value: unknown): 'admin' | 'user' | null {
	if (typeof value !== 'string') {
		return null
	}

	const normalized = value.trim().toLowerCase()
	if (normalized === 'admin') {
		return 'admin'
	}

	if (normalized === 'user') {
		return 'user'
	}

	return null
}

function extractProfileRole(value: unknown): 'admin' | 'user' | null {
	if (!isRecord(value)) {
		return null
	}

	return normalizeAppRole(value.role)
}

function extractAppRoleFromSession(session: AuthSessionResponse | null): 'admin' | 'user' | null {
	if (!session) {
		return null
	}

	const candidates = [
		extractProfileRole(session.profile),
		session?.user?.user_metadata?.role,
		session?.user?.app_metadata?.role,
		session?.user?.role,
		session?.role,
		session?.user_role,
	]

	for (const candidate of candidates) {
		const role = normalizeAppRole(candidate)
		if (role) {
			return role
		}
	}

	return null
}

function withHydratedAppRole(session: AuthSessionResponse, role: 'admin' | 'user'): AuthSessionResponse {
	const baseUser: Record<string, unknown> = isRecord(session.user) ? session.user : {}
	const userMetadata = isRecord(baseUser.user_metadata) ? baseUser.user_metadata : {}

	return {
		...session,
		role,
		user_role: role,
		is_admin: role === 'admin',
		admin: role === 'admin',
		user: {
			...baseUser,
			user_metadata: {
				...userMetadata,
				role,
			},
		},
	}
}

async function fetchAppRoleFromUsersTable(session: AuthSessionResponse): Promise<'admin' | 'user' | null> {
	const userId = session?.user?.id
	const email = session?.user?.email

	if (!userId && !email) {
		return null
	}

	let query = supabase.from('users').select('role').limit(1)
	if (typeof userId === 'string' && userId.length > 0) {
		query = query.eq('id', userId)
	} else if (typeof email === 'string' && email.length > 0) {
		query = query.eq('email', email)
	}

	const { data, error } = await query.maybeSingle()
	if (error || !data) {
		return null
	}

	return normalizeAppRole(data.role)
}

async function hydrateSessionAppRole(session: AuthSessionResponse): Promise<AuthSessionResponse> {
	const existingRole = extractAppRoleFromSession(session)
	if (existingRole) {
		return withHydratedAppRole(session, existingRole)
	}

	const dbRole = await fetchAppRoleFromUsersTable(session)
	if (!dbRole) {
		return session
	}

	return withHydratedAppRole(session, dbRole)
}

function normalizeStoredSession(value: unknown, depth = 0): AuthSessionResponse | null {
	if (depth > 4 || !isRecord(value)) {
		return hasAccessToken(value) ? value : null
	}

	if (hasAccessToken(value)) {
		return mergeSessionWithHints(value, extractSessionHints(value))
	}

	const nestedKeys = ['session', 'data', 'auth', 'result', 'payload'] as const
	for (const key of nestedKeys) {
		const nestedValue = value[key]
		if (!isRecord(nestedValue)) {
			continue
		}

		const normalized = normalizeStoredSession(nestedValue, depth + 1)
		if (normalized) {
			return mergeSessionWithHints(normalized, extractSessionHints(value))
		}
	}

	return null
}

function readStoredSession(): AuthSessionResponse | null {
	if (!isBrowser()) {
		return null
	}

	const raw = window.localStorage.getItem(AUTH_STORAGE_KEY)
	if (!raw) {
		return null
	}

	try {
		return normalizeStoredSession(JSON.parse(raw))
	} catch {
		window.localStorage.removeItem(AUTH_STORAGE_KEY)
		return null
	}
}

function emitSessionChange() {
	if (!isBrowser()) {
		return
	}

	window.dispatchEvent(new Event(AUTH_SESSION_EVENT))
}

function writeStoredSession(session: AuthSessionResponse | null) {
	if (!isBrowser()) {
		return
	}

	if (!session) {
		window.localStorage.removeItem(AUTH_STORAGE_KEY)
		emitSessionChange()
		return
	}

	window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))
	emitSessionChange()
}

function parseJwtPayload(token: string) {
	try {
		const base64Url = token.split('.')[1]
		if (!base64Url) {
			return null
		}

		const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
		const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')
		const payload = atob(padded)
		return JSON.parse(payload)
	} catch {
		return null
	}
}

function includesAdminRole(value: unknown): boolean {
	if (typeof value === 'boolean') {
		return value
	}

	if (typeof value === 'number') {
		return value === 1
	}

	if (!value) {
		return false
	}

	if (typeof value === 'string') {
		const normalized = value.trim().toLowerCase()
		return normalized === 'admin' || normalized === 'true' || normalized === '1'
	}

	if (Array.isArray(value)) {
		return value.some((item) => includesAdminRole(item))
	}

	if (isRecord(value)) {
		const roleKeys = ['role', 'roles', 'is_admin', 'isAdmin', 'admin', 'user_role'] as const
		for (const key of roleKeys) {
			if (includesAdminRole(value[key])) {
				return true
			}
		}

		for (const nestedValue of Object.values(value)) {
			if (isRecord(nestedValue) && includesAdminRole(nestedValue)) {
				return true
			}
		}
	}

	return false
}

function includesAdminRoleInRecord(record: Record<string, unknown> | undefined) {
	if (!record) {
		return false
	}

	return [record.role, record.roles, record.is_admin, record.isAdmin, record.admin].some((candidate) =>
		includesAdminRole(candidate),
	)
}

export function sessionHasAdminRole(session: AuthSessionResponse | null) {
	if (!session) {
		return false
	}

	const tokenPayload = parseJwtPayload(session.access_token ?? '')
	const sessionRecord = session as Record<string, unknown>
	const userRecord = isRecord(session.user) ? session.user : undefined
	const tokenRecord = isRecord(tokenPayload) ? tokenPayload : undefined
	const roleCandidates = [
		extractProfileRole(session.profile),
		session?.user?.user_metadata?.role,
		session?.user?.user_metadata?.roles,
		session?.user?.user_metadata?.is_admin,
		session?.user?.user_metadata?.isAdmin,
		session?.user?.user_metadata?.admin,
		session?.user?.app_metadata?.role,
		session?.user?.app_metadata?.roles,
		session?.user?.app_metadata?.is_admin,
		session?.user?.app_metadata?.isAdmin,
		session?.user?.app_metadata?.admin,
		session?.user?.role,
		session?.user?.roles,
		session?.user?.is_admin,
		session?.user?.isAdmin,
		session?.user?.admin,
		session?.role,
		session?.roles,
		session?.user_role,
		session?.is_admin,
		session?.isAdmin,
		session?.admin,
		tokenPayload?.user_metadata?.role,
		tokenPayload?.user_metadata?.roles,
		tokenPayload?.user_metadata?.is_admin,
		tokenPayload?.user_metadata?.isAdmin,
		tokenPayload?.user_metadata?.admin,
		tokenPayload?.app_metadata?.role,
		tokenPayload?.app_metadata?.roles,
		tokenPayload?.app_metadata?.is_admin,
		tokenPayload?.app_metadata?.isAdmin,
		tokenPayload?.app_metadata?.admin,
		tokenPayload?.role,
		tokenPayload?.roles,
		tokenPayload?.user_role,
		tokenPayload?.is_admin,
		tokenPayload?.isAdmin,
		tokenPayload?.admin,
	]

	return roleCandidates.some((candidate) => includesAdminRole(candidate)) || includesAdminRoleInRecord(userRecord) || includesAdminRoleInRecord(tokenRecord) || includesAdminRoleInRecord(sessionRecord)
}

export function hasStoredAdminRole() {
	return sessionHasAdminRole(readStoredSession())
}

export function useAuthSession() {
	const [session, setSession] = useState<AuthSessionResponse | null>(() => readStoredSession())

	useEffect(() => {
		function handleSessionChange() {
			const storedSession = readStoredSession()
			setSession(storedSession)

			if (!storedSession) {
				return
			}

			void hydrateSessionAppRole(storedSession).then((hydratedSession) => {
				if (extractAppRoleFromSession(hydratedSession) === extractAppRoleFromSession(storedSession)) {
					return
				}

				setSession(hydratedSession)
				writeStoredSession(hydratedSession)
			})
		}

		window.addEventListener(AUTH_SESSION_EVENT, handleSessionChange)
		window.addEventListener('storage', handleSessionChange)

		return () => {
			window.removeEventListener(AUTH_SESSION_EVENT, handleSessionChange)
			window.removeEventListener('storage', handleSessionChange)
		}
	}, [])

	return session
}

export function useLogin() {
	const [session, setSession] = useState<AuthSessionResponse | null>(() => readStoredSession())
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const loginUser = useCallback(async (payload: LoginPayload) => {
		setLoading(true)
		setError(null)

		try {
			const result = await login(payload)
			const normalizedResult = normalizeStoredSession(result)
			if (!normalizedResult) {
				throw new Error('Login response did not include an auth session.')
			}

			const hydratedSession = await hydrateSessionAppRole(normalizedResult)

			const { error: sessionError } = await supabase.auth.setSession({
				access_token: hydratedSession.access_token,
				refresh_token: hydratedSession.refresh_token ?? '',
			})
			if (sessionError) {
				throw sessionError
			}

			setSession(hydratedSession)
			writeStoredSession(hydratedSession)
			return hydratedSession
		} catch (err) {
			const message = getApiErrorMessage(err)
			setError(message)
			throw err
		} finally {
			setLoading(false)
		}
	}, [])

	const logoutUser = useCallback(async () => {
		setLoading(true)
		setError(null)

		try {
			if (session?.access_token) {
				await logout(session.access_token)
			}
		} catch (err) {
			setError(getApiErrorMessage(err))
			throw err
		} finally {
			await supabase.auth.signOut()
			setSession(null)
			writeStoredSession(null)
			setLoading(false)
		}
	}, [session])

	const setAuthSession = useCallback((nextSession: AuthSessionResponse | null) => {
		setSession(nextSession)
		writeStoredSession(nextSession)
	}, [])

	return {
		session,
		accessToken: session?.access_token ?? null,
		loading,
		error,
		loginUser,
		logoutUser,
		setAuthSession,
	}
}
