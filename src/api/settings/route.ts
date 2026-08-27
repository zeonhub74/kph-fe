import { apiRequest } from '../http'

export type ProductPriceSettings = {
	is_price_disabled: boolean
}

// Enable/Disable product price settings
export function getProductPriceSettings(): Promise<ProductPriceSettings> {
	return apiRequest<ProductPriceSettings>('/api/settings/product-prices')
}

export function updateProductPriceSettings(
	isPriceDisabled: boolean,
	token: string,
): Promise<ProductPriceSettings> {
	return apiRequest<ProductPriceSettings>('/api/settings/product-prices', {
		method: 'PUT',
		body: { is_price_disabled: isPriceDisabled },
		token,
	})
}