import { apiRequest } from '../http'

export type ProfileAuthUser = {
	id: string
	email?: string
	user_metadata?: Record<string, unknown>
	app_metadata?: Record<string, unknown>
	[key: string]: unknown
}

export type UserProfile = {
	id: string
	name: string
	email: string
	role: string
	created_at?: string
}

export type ProfileResponse = {
	auth_user: ProfileAuthUser
	profile: UserProfile
	needs_agreement_reacceptance?: boolean
}

export function getProfile(token: string): Promise<ProfileResponse> {
	return apiRequest<ProfileResponse>('/api/me', {
		method: 'GET',
		token,
	})
}