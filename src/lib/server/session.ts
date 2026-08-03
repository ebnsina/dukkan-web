import type { Cookies } from '@sveltejs/kit';

const CART = 'dukkan_cart';
const ACCESS = 'dukkan_access';
const REFRESH = 'dukkan_refresh';

const base = {
	path: '/',
	httpOnly: true,
	sameSite: 'lax' as const,
	secure: process.env.NODE_ENV === 'production'
};

export function readCart(cookies: Cookies): string | null {
	return cookies.get(CART) ?? null;
}

/* The API returns the resolved token on every cart reply, and it changes when a
   guest basket is merged into an account, so it is always written back. */
export function writeCart(cookies: Cookies, token: string | null) {
	if (token) cookies.set(CART, token, { ...base, maxAge: 60 * 60 * 24 * 30 });
}

export function clearCart(cookies: Cookies) {
	cookies.delete(CART, { path: '/' });
}

export function readAccess(cookies: Cookies): string | null {
	return cookies.get(ACCESS) ?? null;
}

export function readRefresh(cookies: Cookies): string | null {
	return cookies.get(REFRESH) ?? null;
}

export function writeSession(
	cookies: Cookies,
	tokens: { access_token: string; refresh_token: string }
) {
	cookies.set(ACCESS, tokens.access_token, { ...base, maxAge: 60 * 15 });
	cookies.set(REFRESH, tokens.refresh_token, { ...base, maxAge: 60 * 60 * 24 * 30 });
}

export function clearSession(cookies: Cookies) {
	cookies.delete(ACCESS, { path: '/' });
	cookies.delete(REFRESH, { path: '/' });
}
