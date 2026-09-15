import { useCallback, useEffect, useState } from 'react'
import { getApiErrorMessage } from '../../api/http'
import { listUsers, promoteUser } from '../../api/admin/users/route'
import { useAuthSession } from './useLogin'

export type User = {
	id: string
	name: string
	email: string
	role: 'user' | 'admin' | string
}

function normalizeUsers(response: unknown): User[] {
	if (Array.isArray(response)) {
		return response as User[]
	}

	if (typeof response === 'object' && response !== null) {
		const record = response as Record<string, unknown>
		for (const key of ['users', 'data', 'items']) {
			if (key in record) {
				return normalizeUsers(record[key])
			}
		}
	}

	throw new Error('The users response had an unexpected format.')
}

export function useUsers() {
	const session = useAuthSession()
	const [users, setUsers] = useState<User[]>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const fetchUsers = useCallback(async () => {
		if (!session?.access_token) return

		setLoading(true)
		setError(null)

		try {
			const response = await listUsers(session.access_token)
			setUsers(normalizeUsers(response))
		} catch (err) {
			setError(getApiErrorMessage(err))
		} finally {
			setLoading(false)
		}
	}, [session?.access_token])

	const makeAdmin = useCallback(async (userId: string) => {
		if (!session?.access_token) {
			throw new Error('Your session has expired. Please sign in again.')
		}

		await promoteUser(userId, session.access_token)
		setUsers((currentUsers) => currentUsers.map((user) => (
			user.id === userId ? { ...user, role: 'admin' } : user
		)))
	}, [session?.access_token])

	useEffect(() => {
		void fetchUsers()
	}, [fetchUsers])

	return { users, loading, error, makeAdmin }
}