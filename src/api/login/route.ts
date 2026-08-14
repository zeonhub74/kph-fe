import { apiRequest } from '../http'
import type { AuthSessionResponse, LoginPayload } from '@/hooks/api/useLogin'

export function login(payload: LoginPayload): Promise<AuthSessionResponse> {
	return apiRequest<AuthSessionResponse>('/api/login', {
		method: 'POST',
		body: payload,
	})
}
