import { useCallback, useEffect, useState } from 'react'
import { getApiErrorMessage } from '../../api/http'
import { getProfile } from '../../api/profile/route'
import type { ProfileResponse } from '../../api/profile/route'
import { useAuthSession } from './useLogin'

export function useProfile() {
	const session = useAuthSession()
	const [data, setData] = useState<ProfileResponse | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const fetchProfile = useCallback(async () => {
		if (!session?.access_token) return

		setLoading(true)
		setError(null)

		try {
			const result = await getProfile(session.access_token)
			setData(result)
			return result
		} catch (err) {
			setError(getApiErrorMessage(err))
			throw err
		} finally {
			setLoading(false)
		}
	}, [session?.access_token])

	useEffect(() => {
		fetchProfile()
	}, [fetchProfile])

	return {
		profile: data?.profile ?? null,
		authUser: data?.auth_user ?? null,
		needsAgreementReacceptance: data?.needs_agreement_reacceptance ?? false,
		loading,
		error,
		refetch: fetchProfile,
	}
}