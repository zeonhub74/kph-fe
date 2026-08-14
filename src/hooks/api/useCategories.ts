import { useCallback, useState } from 'react'
import { getApiErrorMessage } from '../../api/http'
import {
	createCategory,
	deleteCategory,
	listCategories,
	updateCategory,
} from '../../api/categories/route'

export type Category = {
	id: number
	name: string
	created_at?: string
	updated_at?: string
}

export type CategoryCreatePayload = {
	name: string
}

export type CategoryUpdatePayload = {
	name: string
}

export function useCategories() {
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const fetchCategories = useCallback(async (): Promise<Category[]> => {
		setLoading(true)
		setError(null)

		try {
			return await listCategories()
		} catch (err) {
			setError(getApiErrorMessage(err))
			throw err
		} finally {
			setLoading(false)
		}
	}, [])

	const createCategoryItem = useCallback(async (payload: CategoryCreatePayload, token: string): Promise<Category[]> => {
		setLoading(true)
		setError(null)

		try {
			return await createCategory(payload, token)
		} catch (err) {
			setError(getApiErrorMessage(err))
			throw err
		} finally {
			setLoading(false)
		}
	}, [])

	const updateCategoryItem = useCallback(
		async (categoryId: number, payload: CategoryUpdatePayload, token: string): Promise<Category[]> => {
			setLoading(true)
			setError(null)

			try {
				return await updateCategory(categoryId, payload, token)
			} catch (err) {
				setError(getApiErrorMessage(err))
				throw err
			} finally {
				setLoading(false)
			}
		},
		[],
	)

	const deleteCategoryItem = useCallback(async (categoryId: number, token: string): Promise<Category[]> => {
		setLoading(true)
		setError(null)

		try {
			return await deleteCategory(categoryId, token)
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
		fetchCategories,
		createCategoryItem,
		updateCategoryItem,
		deleteCategoryItem,
	}
}
