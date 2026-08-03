import { browser } from '$app/environment';
import { PUBLIC_API_URL } from '$env/static/public';
import { ApiError } from './errors';
import type { ApiErrorEnvelope, ApiSuccessEnvelope, RequestOptions } from './types';

const DEFAULT_TIMEOUT_MS = 15_000;

function buildUrl(path: string, query: RequestOptions['query']): string {
	const url = new URL(path.replace(/^\//, ''), `${PUBLIC_API_URL.replace(/\/$/, '')}/`);
	for (const [key, value] of Object.entries(query ?? {})) {
		if (value !== undefined && value !== null) url.searchParams.set(key, String(value));
	}
	return url.toString();
}

function normalizeEnvelope(status: number, payload: unknown): ApiError {
	const envelope = payload as Partial<ApiErrorEnvelope>;
	const error = envelope?.error;
	if (error && typeof error.code === 'string') {
		return new ApiError({
			kind: 'http',
			code: error.code,
			status,
			issues: error.details ?? [],
			requestId: error.requestId ?? null,
			message: error.message
		});
	}
	return new ApiError({ kind: 'http', code: `HTTP_${status}`, status });
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
	const { body, query, timeoutMs = DEFAULT_TIMEOUT_MS, headers, ...init } = options;

	if (browser && !navigator.onLine) {
		throw new ApiError({ kind: 'offline', code: 'OFFLINE' });
	}

	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), timeoutMs);

	let response: Response;
	try {
		response = await fetch(buildUrl(path, query), {
			...init,
			signal: options.signal ?? controller.signal,
			headers: {
				Accept: 'application/json',
				...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
				...headers
			},
			body: body === undefined ? undefined : JSON.stringify(body)
		});
	} catch (cause) {
		clearTimeout(timer);
		if (cause instanceof DOMException && cause.name === 'AbortError') {
			throw new ApiError({ kind: 'timeout', code: 'TIMEOUT' });
		}
		throw new ApiError({ kind: 'network', code: 'NETWORK' });
	}
	clearTimeout(timer);

	if (response.status === 204) return undefined as T;

	let payload: unknown;
	try {
		payload = await response.json();
	} catch {
		if (response.ok) throw new ApiError({ kind: 'parse', code: 'PARSE', status: response.status });
		throw new ApiError({ kind: 'http', code: `HTTP_${response.status}`, status: response.status });
	}

	if (!response.ok) throw normalizeEnvelope(response.status, payload);
	return (payload as ApiSuccessEnvelope<T>).data ?? (payload as T);
}

export const api = {
	get: <T>(path: string, options?: RequestOptions) =>
		request<T>(path, { ...options, method: 'GET' }),
	post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
		request<T>(path, { ...options, method: 'POST', body }),
	patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
		request<T>(path, { ...options, method: 'PATCH', body }),
	put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
		request<T>(path, { ...options, method: 'PUT', body }),
	delete: <T>(path: string, options?: RequestOptions) =>
		request<T>(path, { ...options, method: 'DELETE' })
};
