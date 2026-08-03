export type ApiErrorKind = 'http' | 'network' | 'timeout' | 'offline' | 'parse';

export class ApiError extends Error {
	readonly kind: ApiErrorKind;
	readonly code: string;
	readonly status: number | null;
	readonly fields: Record<string, string>;
	readonly requestId: string | null;

	constructor(init: {
		kind: ApiErrorKind;
		code: string;
		status?: number | null;
		fields?: Record<string, string>;
		requestId?: string | null;
		message?: string;
	}) {
		super(init.message ?? init.code);
		this.name = 'ApiError';
		this.kind = init.kind;
		this.code = init.code;
		this.status = init.status ?? null;
		this.fields = init.fields ?? {};
		this.requestId = init.requestId ?? null;
	}
}

export function isApiError(value: unknown): value is ApiError {
	return value instanceof ApiError;
}

/* The API writes its messages for a shop owner, so they are rendered as given.
   Only transport failures, which never reach the API, are worded here. */
const TRANSPORT: Record<string, string> = {
	OFFLINE: 'You are offline. Reconnect and try again.',
	NETWORK: 'We could not reach the shop. Try again in a moment.',
	TIMEOUT: 'That took too long. Try again.',
	PARSE: 'We got a reply we could not read. Try again in a moment.'
};

const LAST_RESORT = 'That did not work. Try again in a moment.';

export function toUserMessage(error: unknown): string {
	if (!isApiError(error)) return LAST_RESORT;
	if (TRANSPORT[error.code]) return TRANSPORT[error.code];
	return error.message || LAST_RESORT;
}

export function fieldErrors(error: unknown): Record<string, string> {
	return isApiError(error) ? error.fields : {};
}

export function isOutOfStock(error: unknown): boolean {
	return isApiError(error) && error.status === 409;
}
