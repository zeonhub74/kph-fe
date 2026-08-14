import { apiRequest } from '../http'
import type { RegisterPayload, RegisterResponse } from '../../hooks/api/useRegister'

export function register(payload: RegisterPayload): Promise<RegisterResponse> {
	return apiRequest<RegisterResponse>('/api/register', {
		method: 'POST',
		body: payload,
	})
}
