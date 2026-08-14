const SHOPIFY_DOMAIN = import.meta.env.VITE_SHOPIFY_DOMAIN as string | undefined
const SHOPIFY_STOREFRONT_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN as string | undefined
const SHOPIFY_API_VERSION = '2024-10'

export class ShopifyApiError extends Error {
	errors: unknown

	constructor(message: string, errors: unknown) {
		super(message)
		this.name = 'ShopifyApiError'
		this.errors = errors
	}
}

export async function shopifyRequest<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
	if (!SHOPIFY_DOMAIN || !SHOPIFY_STOREFRONT_TOKEN) {
		throw new ShopifyApiError(
			'Shopify storefront credentials are not configured. Set VITE_SHOPIFY_DOMAIN and VITE_SHOPIFY_STOREFRONT_TOKEN.',
			null,
		)
	}

	const response = await fetch(`https://${SHOPIFY_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN,
		},
		body: JSON.stringify({ query, variables }),
	})

	const json = await response.json()

	if (!response.ok || json.errors) {
		const message = Array.isArray(json.errors) ? json.errors[0]?.message : response.statusText
		throw new ShopifyApiError(message ?? 'Shopify request failed.', json.errors)
	}

	return json.data as T
}
