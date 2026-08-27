import { useCallback, useState } from 'react'
import { getApiErrorMessage } from '../../api/http'
import { register } from '../../api/register/route'

export type RegisterPayload = {
	name: string
	email: string
	password: string
	terms_accepted: boolean
}

export type RegisterAuthUser = {
	id: string
	email?: string
	user_metadata?: Record<string, unknown>
}

export type RegisterResponse = {
	user?: RegisterAuthUser
	access_token?: string
	refresh_token?: string
	[key: string]: unknown
}

export function useRegister() {
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const registerUser = useCallback(async (payload: RegisterPayload): Promise<RegisterResponse> => {
		setLoading(true)
		setError(null)

		try {
			return await register(payload)
		} catch (err) {
			const message = getApiErrorMessage(err)
			setError(message)
			throw err
		} finally {
			setLoading(false)
		}
	}, [])

	return {
		loading,
		error,
		registerUser,
	}
}
