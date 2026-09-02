import { apiRequest } from '../http'
import type { Ad, CreateAdPayload, UpdateAdPayload } from '@/hooks/api/useAds'

export function listAds(activeOnly = false): Promise<Ad[]> {
	const query = activeOnly ? '?active_only=true' : ''
	return apiRequest<Ad[]>(`/api/ads${query}`)
}

export function createAd(payload: CreateAdPayload, token: string): Promise<Ad> {
	return apiRequest<Ad>('/api/ads', {
		method: 'POST',
		body: payload,
		token,
	})
}

export function updateAd(adId: string, payload: UpdateAdPayload, token: string): Promise<Ad> {
	return apiRequest<Ad>(`/api/ads/${adId}`, {
		method: 'PUT',
		body: payload,
		token,
	})
}

export function deleteAd(adId: string, token: string): Promise<{ message: string }> {
	return apiRequest<{ message: string }>(`/api/ads/${adId}`, {
		method: 'DELETE',
		token,
	})
}