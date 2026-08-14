import { apiRequest } from '../http'
import type { Product, ProductCreatePayload, ProductUpdatePayload } from '../../hooks/api/useProducts'

export function listProducts(): Promise<Product[]> {
	return apiRequest<Product[]>('/api/products')
}

export function getProduct(productId: number): Promise<Product> {
	return apiRequest<Product>(`/api/products/${productId}`)
}

export function createProduct(payload: ProductCreatePayload, token: string): Promise<Product[]> {
	return apiRequest<Product[]>('/api/products', {
		method: 'POST',
		body: payload,
		token,
	})
}

export function updateProduct(productId: number, payload: ProductUpdatePayload, token: string): Promise<Product[]> {
	return apiRequest<Product[]>(`/api/products/${productId}`, {
		method: 'PUT',
		body: payload,
		token,
	})
}

export function deleteProduct(productId: number, token: string): Promise<Product[]> {
	return apiRequest<Product[]>(`/api/products/${productId}`, {
		method: 'DELETE',
		token,
	})
}
