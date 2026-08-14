import { apiRequest } from '../http'
import type { LogoutResponse } from '@/hooks/api/useLogin'

export function logout(token: string): Promise<LogoutResponse> {
	return apiRequest<LogoutResponse>('/api/logout', {
		method: 'POST',
		token,
	})
}
