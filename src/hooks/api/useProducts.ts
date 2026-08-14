import { useCallback, useState } from 'react'
import { getApiErrorMessage } from '../../api/http'
import {
	createProduct,
	deleteProduct,
	getProduct,
	listProducts,
	updateProduct,
} from '../../api/products/route'

export type Product = {
	id: number
	category_id: number
	name: string
	price: string
	description: string | null
	image_url: string | null
	stock: number
	created_at?: string
	updated_at?: string
}

export type ProductCreatePayload = {
	category_id: number
	name: string
	price: number | string
	description?: string | null
	image_url?: string | null
	stock: number
}

export type ProductUpdatePayload = {
	category_id?: number
	name?: string
	price?: number | string
	description?: string | null
	image_url?: string | null
	stock?: number
}

export function useProducts() {
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const fetchProducts = useCallback(async (): Promise<Product[]> => {
		setLoading(true)
		setError(null)

		try {
			return await listProducts()
		} catch (err) {
			setError(getApiErrorMessage(err))
			throw err
		} finally {
			setLoading(false)
		}
	}, [])

	const fetchProductById = useCallback(async (productId: number): Promise<Product> => {
		setLoading(true)
		setError(null)

		try {
			return await getProduct(productId)
		} catch (err) {
			setError(getApiErrorMessage(err))
			throw err
		} finally {
			setLoading(false)
		}
	}, [])

	const createProductItem = useCallback(async (payload: ProductCreatePayload, token: string): Promise<Product[]> => {
		setLoading(true)
		setError(null)

		try {
			return await createProduct(payload, token)
		} catch (err) {
			setError(getApiErrorMessage(err))
			throw err
		} finally {
			setLoading(false)
		}
	}, [])

	const updateProductItem = useCallback(
		async (productId: number, payload: ProductUpdatePayload, token: string): Promise<Product[]> => {
			setLoading(true)
			setError(null)

			try {
				return await updateProduct(productId, payload, token)
			} catch (err) {
				setError(getApiErrorMessage(err))
				throw err
			} finally {
				setLoading(false)
			}
		},
		[],
	)

	const deleteProductItem = useCallback(async (productId: number, token: string): Promise<Product[]> => {
		setLoading(true)
		setError(null)

		try {
			return await deleteProduct(productId, token)
		} catch (err) {
			setError(getApiErrorMessage(err))
			throw err
		} finally {
			setLoading(false)
		}
	}, [])

	return {
		loading,
		error,
		fetchProducts,
		fetchProductById,
		createProductItem,
		updateProductItem,
		deleteProductItem,
	}
}
