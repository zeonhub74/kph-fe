import { useCallback, useState } from 'react'
import { getApiErrorMessage } from '@/api/http'
import { getShopifyProductByHandle, listShopifyProducts } from '@/api/shopify/route'

export type ShopifyMoney = {
	amount: string
	currencyCode: string
}

export type ShopifyImage = {
	url: string
	altText: string | null
}

export type ShopifySelectedOption = {
	name: string
	value: string
}

export type ShopifyVariant = {
	id: string
	title: string
	availableForSale: boolean
	price: ShopifyMoney
	selectedOptions: ShopifySelectedOption[]
}

export type ShopifyProduct = {
	id: string
	title: string
	handle: string
	productType: string
	descriptionHtml: string
	images: { edges: { node: ShopifyImage }[] }
	priceRange: { minVariantPrice: ShopifyMoney }
	variants: { edges: { node: ShopifyVariant }[] }
}

export function useShopifyProducts() {
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const fetchProducts = useCallback(async (): Promise<ShopifyProduct[]> => {
		setLoading(true)
		setError(null)

		try {
			return await listShopifyProducts()
		} catch (err) {
			setError(getApiErrorMessage(err))
			throw err
		} finally {
			setLoading(false)
		}
	}, [])

	const fetchProductByHandle = useCallback(async (handle: string): Promise<ShopifyProduct | null> => {
		setLoading(true)
		setError(null)

		try {
			return await getShopifyProductByHandle(handle)
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
		fetchProductByHandle,
	}
}
