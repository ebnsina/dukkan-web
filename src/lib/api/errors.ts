import type { ApiErrorKind, ApiFieldIssue } from './types';

export class ApiError extends Error {
	readonly kind: ApiErrorKind;
	readonly code: string;
	readonly status: number | null;
	readonly issues: ApiFieldIssue[];
	readonly requestId: string | null;

	constructor(init: {
		kind: ApiErrorKind;
		code: string;
		status?: number | null;
		issues?: ApiFieldIssue[];
		requestId?: string | null;
		message?: string;
	}) {
		super(init.message ?? init.code);
		this.name = 'ApiError';
		this.kind = init.kind;
		this.code = init.code;
		this.status = init.status ?? null;
		this.issues = init.issues ?? [];
		this.requestId = init.requestId ?? null;
	}
}

export function isApiError(value: unknown): value is ApiError {
	return value instanceof ApiError;
}

/* One sentence each: what went wrong, and what to do next. No technical detail. */
const MESSAGES: Record<string, string> = {
	OFFLINE: 'You are offline. Reconnect and try again.',
	NETWORK: 'We could not reach Dukkan. Try again in a moment.',
	TIMEOUT: 'That took too long. Try again.',
	PARSE: 'We got a reply we could not read. Try again in a moment.',

	UNAUTHENTICATED: 'Sign in to carry on.',
	SESSION_EXPIRED: 'Your session ended. Sign in again.',
	INVALID_CREDENTIALS: 'That email and password do not match. Check both and try again.',
	FORBIDDEN: 'You do not have access to this. Ask a shop admin to give it to you.',
	NOT_FOUND: 'We could not find that. It may have been removed.',
	CONFLICT: 'Someone changed this while you were working. Reload and try again.',
	ALREADY_EXISTS: 'That name is taken. Pick another one.',
	VALIDATION_FAILED: 'Some details need fixing. Check the marked fields.',
	RATE_LIMITED: 'Too many tries at once. Wait a minute and try again.',
	PAYLOAD_TOO_LARGE: 'That file is too big. Upload a smaller one.',
	UNSUPPORTED_MEDIA_TYPE: 'That kind of file is not allowed here. Try a JPG or a PNG.',

	PLAN_LIMIT_REACHED: 'You have hit your plan limit. Move up a plan to add more.',
	SUBSCRIPTION_INACTIVE: 'Your plan is not active. Renew it to carry on.',
	PAYMENT_FAILED: 'The payment did not go through. Try again or use another method.',
	PAYMENT_PENDING: 'The payment is still being confirmed. Check back shortly.',
	PAYOUT_ACCOUNT_MISSING: 'Add a payout account before money can reach you.',
	COURIER_UNAVAILABLE: 'The courier is not answering. Try again shortly.',

	SERVER_ERROR: 'Something broke on our side. Try again in a moment.',
	SERVICE_UNAVAILABLE: 'Dukkan is down for a short while. Try again in a few minutes.',
	MAINTENANCE: 'We are doing planned work. Come back in a few minutes.'
};

const STATUS_FALLBACK: Record<number, string> = {
	400: MESSAGES.VALIDATION_FAILED,
	401: MESSAGES.UNAUTHENTICATED,
	403: MESSAGES.FORBIDDEN,
	404: MESSAGES.NOT_FOUND,
	409: MESSAGES.CONFLICT,
	413: MESSAGES.PAYLOAD_TOO_LARGE,
	415: MESSAGES.UNSUPPORTED_MEDIA_TYPE,
	422: MESSAGES.VALIDATION_FAILED,
	429: MESSAGES.RATE_LIMITED,
	503: MESSAGES.SERVICE_UNAVAILABLE
};

const GENERIC = 'That did not work. Try again in a moment.';

export function toUserMessage(error: unknown): string {
	if (!isApiError(error)) return GENERIC;
	const byCode = MESSAGES[error.code];
	if (byCode) return byCode;
	if (error.status && STATUS_FALLBACK[error.status]) return STATUS_FALLBACK[error.status];
	if (error.status && error.status >= 500) return MESSAGES.SERVER_ERROR;
	return GENERIC;
}

export function toFieldMessages(error: unknown): Record<string, string> {
	if (!isApiError(error)) return {};
	return Object.fromEntries(error.issues.map((issue) => [issue.field, issue.message]));
}
