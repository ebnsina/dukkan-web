import { PUBLIC_API_URL, PUBLIC_SHOP_DOMAIN } from '$env/static/public';
import { getRequestEvent } from '$app/server';
import { shopFromHost } from './shop';
import { ApiError } from '$lib/api/errors';

const CART_HEADER = 'x-cart-token';

/* The API origin for this request.
 *
 * `PUBLIC_API_URL` is fixed and never edited: it says where the API is, not
 * whose shop we are asking about. The shop is carried by the host, which is
 * how the API has always resolved tenants — so pointing the environment at one
 * shop and restarting to see another was never the design, only the shortcut
 * that grew into the whole local workflow.
 *
 * Off a request — a build, or anything tenant-less — the configured origin is
 * used as it stands. */

/* Signup creates a shop and the price list sells one, so neither belongs to
   one. The operator console is about shops rather than from one, and resolves
   no tenant at all. Every other surface — store, admin, vendor — is resolved
   from the host by `Resolver.Middleware`, and must carry it. */
const TENANTLESS = ['/v1/signup', '/v1/plans', '/v1/platform'];

function originFor(path: string): string {
	const base = new URL(PUBLIC_API_URL);
	if (TENANTLESS.some((prefix) => path.startsWith(prefix))) return base.origin;

	let host: string;
	try {
		host = getRequestEvent().url.host;
	} catch {
		return base.origin;
	}

	const shop = shopFromHost(host);
	if (shop) base.hostname = `${shop}.${PUBLIC_SHOP_DOMAIN}`;
	return base.origin;
}

export interface CallOptions {
	method?: string;
	body?: unknown;
	query?: Record<string, string | number | undefined | null>;
	token?: string | null;
	cartToken?: string | null;
	form?: URLSearchParams;
	/* A file going to the API as it arrived. The boundary has to be chosen by
	   fetch, so this is the one body whose Content-Type we must not set. */
	upload?: FormData;
}

export interface Reply<T> {
	data: T;
	cartToken: string | null;
}

function buildUrl(path: string, query: CallOptions['query']): string {
	const url = new URL(path.replace(/^\//, ''), `${originFor(path)}/`);
	for (const [key, value] of Object.entries(query ?? {})) {
		if (value !== undefined && value !== null && value !== '')
			url.searchParams.set(key, String(value));
	}
	return url.toString();
}

function normalize(status: number, payload: unknown): ApiError {
	const envelope = payload as {
		error?: {
			code?: string;
			message?: string;
			fields?: Record<string, string>;
			request_id?: string;
		};
	};
	const error = envelope?.error;
	if (error?.code) {
		return new ApiError({
			kind: 'http',
			code: error.code,
			status,
			fields: error.fields ?? {},
			requestId: error.request_id ?? null,
			message: error.message
		});
	}
	return new ApiError({ kind: 'http', code: `http_${status}`, status });
}

/* The shop is carried by the host `originFor` builds, not by configuration.
   Calls are server-side, which keeps cart and session tokens out of the browser. */
export async function call<T>(
	fetcher: typeof fetch,
	path: string,
	options: CallOptions = {}
): Promise<Reply<T>> {
	const { method = 'GET', body, query, token, cartToken, form, upload } = options;

	const headers: Record<string, string> = { Accept: 'application/json' };
	if (body !== undefined) headers['Content-Type'] = 'application/json';
	if (form) headers['Content-Type'] = 'application/x-www-form-urlencoded';
	if (token) headers.Authorization = `Bearer ${token}`;
	if (cartToken) headers['X-Cart-Token'] = cartToken;

	let response: Response;
	try {
		response = await fetcher(buildUrl(path, query), {
			method,
			headers,
			body: upload
				? upload
				: form
					? form.toString()
					: body === undefined
						? undefined
						: JSON.stringify(body)
		});
	} catch {
		throw new ApiError({ kind: 'network', code: 'NETWORK' });
	}

	const returnedCart = response.headers.get(CART_HEADER);

	if (response.status === 204) return { data: undefined as T, cartToken: returnedCart };

	let payload: unknown;
	try {
		payload = await response.json();
	} catch {
		if (response.ok) throw new ApiError({ kind: 'parse', code: 'PARSE', status: response.status });
		throw new ApiError({ kind: 'http', code: `http_${response.status}`, status: response.status });
	}

	if (!response.ok) throw normalize(response.status, payload);
	return { data: payload as T, cartToken: returnedCart };
}

export async function get<T>(fetcher: typeof fetch, path: string, options: CallOptions = {}) {
	return (await call<T>(fetcher, path, { ...options, method: 'GET' })).data;
}

/* A document rather than a payload. The invoice is HTML because it gets
   printed, so it cannot go through `call`, which parses JSON — but a failure
   still arrives as the usual error envelope and is read as one. */
export async function getText(
	fetcher: typeof fetch,
	path: string,
	options: CallOptions = {}
): Promise<string> {
	const headers: Record<string, string> = { Accept: 'text/html' };
	if (options.token) headers.Authorization = `Bearer ${options.token}`;

	let response: Response;
	try {
		response = await fetcher(buildUrl(path, options.query), { headers });
	} catch {
		throw new ApiError({ kind: 'network', code: 'NETWORK' });
	}

	const body = await response.text();
	if (response.ok) return body;

	try {
		throw normalize(response.status, JSON.parse(body));
	} catch (cause) {
		if (cause instanceof ApiError) throw cause;
		throw new ApiError({ kind: 'http', code: `http_${response.status}`, status: response.status });
	}
}
