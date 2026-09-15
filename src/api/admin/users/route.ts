import { apiRequest } from '../../http'

export function listUsers(token: string): Promise<unknown> {
	return apiRequest<unknown>('/api/admin/users', {
		method: 'GET',
		token,
	})
}

export function promoteUser(userId: string, token: string): Promise<unknown> {
	return apiRequest(`/api/admin/users/${encodeURIComponent(userId)}/promote`, {
		method: 'POST',
		token,
	})
}