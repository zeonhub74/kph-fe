import { apiRequest } from '../http'
import type { Category, CategoryCreatePayload, CategoryUpdatePayload } from '@/hooks/api/useCategories'

export function listCategories(): Promise<Category[]> {
	return apiRequest<Category[]>('/api/categories')
}

export function createCategory(payload: CategoryCreatePayload, token: string): Promise<Category[]> {
	return apiRequest<Category[]>('/api/categories', {
		method: 'POST',
		body: payload,
		token,
	})
}

export function updateCategory(categoryId: number, payload: CategoryUpdatePayload, token: string): Promise<Category[]> {
	return apiRequest<Category[]>(`/api/categories/${categoryId}`, {
		method: 'PUT',
		body: payload,
		token,
	})
}

export function deleteCategory(categoryId: number, token: string): Promise<Category[]> {
	return apiRequest<Category[]>(`/api/categories/${categoryId}`, {
		method: 'DELETE',
		token,
	})
}
