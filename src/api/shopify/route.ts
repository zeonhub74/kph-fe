import { shopifyRequest } from './client'
import type { ShopifyProduct } from '@/hooks/api/useShopifyProducts'
import type { ShopifyCart } from '@/hooks/api/useCart'

const PRODUCT_FIELDS = `
	id
	title
	handle
	productType
	descriptionHtml
	images(first: 10) {
		edges {
			node {
				url
				altText
			}
		}
	}
	priceRange {
		minVariantPrice {
			amount
			currencyCode
		}
	}
	variants(first: 25) {
		edges {
			node {
				id
				title
				availableForSale
				price {
					amount
					currencyCode
				}
				selectedOptions {
					name
					value
				}
			}
		}
	}
`

const LIST_PRODUCTS_QUERY = `
	query ListProducts($first: Int!) {
		products(first: $first) {
			edges {
				node {
					${PRODUCT_FIELDS}
				}
			}
		}
	}
`

const PRODUCT_BY_HANDLE_QUERY = `
	query ProductByHandle($handle: String!) {
		product(handle: $handle) {
			${PRODUCT_FIELDS}
		}
	}
`

const CART_CREATE_MUTATION = `
	mutation CartCreate($lines: [CartLineInput!]!) {
		cartCreate(input: { lines: $lines }) {
			cart {
				id
				checkoutUrl
			}
			userErrors {
				field
				message
			}
		}
	}
`

export async function listShopifyProducts(first = 50): Promise<ShopifyProduct[]> {
	const data = await shopifyRequest<{ products: { edges: { node: ShopifyProduct }[] } }>(LIST_PRODUCTS_QUERY, {
		first,
	})
	return data.products.edges.map((edge) => edge.node)
}

export async function getShopifyProductByHandle(handle: string): Promise<ShopifyProduct | null> {
	const data = await shopifyRequest<{ product: ShopifyProduct | null }>(PRODUCT_BY_HANDLE_QUERY, { handle })
	return data.product
}

export async function createShopifyCart(variantId: string, quantity: number): Promise<ShopifyCart> {
	const data = await shopifyRequest<{
		cartCreate: { cart: ShopifyCart | null; userErrors: { field: string[]; message: string }[] }
	}>(CART_CREATE_MUTATION, {
		lines: [{ merchandiseId: variantId, quantity }],
	})

	const { cart, userErrors } = data.cartCreate

	if (userErrors.length > 0) {
		throw new Error(userErrors[0].message)
	}

	if (!cart) {
		throw new Error('Unable to create a Shopify checkout for this product.')
	}

	return cart
}
