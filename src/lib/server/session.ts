import type { Cookies } from '@sveltejs/kit';
import { call } from './api';
import type { Tokens } from '$lib/api/types';

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

/* An access token, renewed if the fifteen minutes ran out.
 *
 * Renewing belongs in one place and one place only: the API rotates the
 * refresh token on every use and treats a reused one as theft, so two requests
 * renewing at once would not be a harmless race — it would end the session. So
 * this is the layout's to call, and nothing that runs beside the layout may
 * call it. Page loads use `accessAfterParent`.
 *
 * A refresh that fails clears the session and returns nothing; deciding what
 * that means is the caller's, because a storefront wears it and the admin
 * redirects. */
export async function renewAccess(
	fetcher: typeof fetch,
	cookies: Cookies
): Promise<string | null> {
	const access = readAccess(cookies);
	if (access) return access;

	const refresh = readRefresh(cookies);
	if (!refresh) return null;

	try {
		const renewed = await call<Tokens>(fetcher, '/v1/store/auth/refresh', {
			method: 'POST',
			body: { refresh_token: refresh }
		});
		writeSession(cookies, renewed.data);
		return renewed.data.access_token;
	} catch {
		clearSession(cookies);
		return null;
	}
}

/* The access token a page load should use.
 *
 * A page load runs in parallel with its layout, so on its own it reads the
 * cookie before the layout has replaced an expired one — sends the request
 * with no token, gets a 401, and turns it into "Something broke on our side".
 * Fifteen minutes after signing in, every admin page did exactly that.
 *
 * Waiting on the layout costs the page its head start and buys the token being
 * there. It also keeps this load out of the renewing business entirely, which
 * is what stops two of them rotating the refresh token at once. */
export async function accessAfterParent(
	parent: () => Promise<unknown>,
	cookies: Cookies
): Promise<string | null> {
	await parent();
	return readAccess(cookies);
}
