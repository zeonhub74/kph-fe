import { useCallback, useState } from 'react'
import { getApiErrorMessage } from '@/api/http'
import { createShopifyCart } from '@/api/shopify/route'

export type ShopifyCart = {
	id: string
	checkoutUrl: string
}

export function useCart() {
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	// Creates a Shopify cart for a single variant and returns its hosted checkout URL.
	const buyNow = useCallback(async (variantId: string, quantity = 1): Promise<ShopifyCart> => {
		setLoading(true)
		setError(null)

		try {
			return await createShopifyCart(variantId, quantity)
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
		buyNow,
	}
}
