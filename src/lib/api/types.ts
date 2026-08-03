export type ApiErrorKind = 'http' | 'network' | 'timeout' | 'offline' | 'parse';

export interface ApiFieldIssue {
	field: string;
	code: string;
	message: string;
}

export interface ApiErrorEnvelope {
	error: {
		code: string;
		message?: string;
		details?: ApiFieldIssue[];
		requestId?: string;
	};
}

export interface ApiSuccessEnvelope<T> {
	data: T;
	meta?: Record<string, unknown>;
}

export interface RequestOptions extends Omit<RequestInit, 'body'> {
	body?: unknown;
	query?: Record<string, string | number | boolean | undefined | null>;
	timeoutMs?: number;
}
