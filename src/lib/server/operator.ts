import type { Cookies } from '@sveltejs/kit';

/* The operator's own credential.
 *
 * Not a session and not a login — the API's platform surface takes one shared
 * secret, because with one or two operators there is nobody to tell apart. So
 * signing in here is typing that secret once and having the browser hold it,
 * and signing out is forgetting it. When a second operator exists this becomes
 * a real login and this file becomes a session.
 *
 * `httpOnly`, so the token opening every shop on the box is never readable by
 * script — including any script that ends up on this page by accident. */
const OPERATOR = 'dukkan_operator';

const base = {
	path: '/platform',
	httpOnly: true,
	sameSite: 'strict' as const,
	secure: process.env.NODE_ENV === 'production'
};

export function readOperator(cookies: Cookies): string | null {
	return cookies.get(OPERATOR) ?? null;
}

// Twelve hours. Long enough for a working day, short enough that a shared
// laptop does not keep the keys to every shop indefinitely.
export function writeOperator(cookies: Cookies, token: string) {
	cookies.set(OPERATOR, token, { ...base, maxAge: 60 * 60 * 12 });
}

export function clearOperator(cookies: Cookies) {
	cookies.delete(OPERATOR, { path: '/platform' });
}
