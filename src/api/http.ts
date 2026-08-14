export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export type ApiErrorBody = {
	detail?: string
	message?: string
	error_description?: string
	msg?: string
}

export type ApiRequestOptions = {
	method?: HttpMethod
	body?: unknown
	token?: string
	headers?: Record<string, string>
}

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? 'https://kph-be.vercel.app').replace(/\/+$/, '')

export class ApiError extends Error {
	status: number
	data: unknown

	constructor(message: string, status: number, data: unknown) {
		super(message)
		this.name = 'ApiError'
		this.status = status
		this.data = data
	}
}

export function getApiErrorMessage(error: unknown): string {
	if (error instanceof ApiError) {
		return error.message
	}
	if (error instanceof Error) {
		return error.message
	}
	return 'Something went wrong while calling the API.'
}

function tryParseJson(text: string): unknown {
	try {
		return JSON.parse(text)
	} catch {
		return null
	}
}

function resolveErrorMessage(statusText: string, body: unknown): string {
	if (typeof body === 'object' && body !== null) {
		const typed = body as ApiErrorBody
		return typed.detail ?? typed.message ?? typed.error_description ?? typed.msg ?? statusText
	}
	return statusText
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
	const { method = 'GET', body, token, headers = {} } = options
	const mergedHeaders: Record<string, string> = {
		Accept: 'application/json',
		...headers,
	}

	if (body !== undefined) {
		mergedHeaders['Content-Type'] = 'application/json'
	}

	if (token) {
		mergedHeaders.Authorization = `Bearer ${token}`
	}

	const response = await fetch(`${API_BASE_URL}${path}`, {
		method,
		headers: mergedHeaders,
		body: body !== undefined ? JSON.stringify(body) : undefined,
	})

	const text = await response.text()
	const data = text ? tryParseJson(text) : null

	if (!response.ok) {
		const detail = resolveErrorMessage(response.statusText, data)
		throw new ApiError(detail, response.status, data)
	}

	return (data ?? ({} as T)) as T
}

export { API_BASE_URL }
