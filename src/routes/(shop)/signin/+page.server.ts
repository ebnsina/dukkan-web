import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { call } from '$lib/server/api';
import { readCart, writeCart, writeSession } from '$lib/server/session';
import { toUserMessage } from '$lib/api/errors';
import type { Cart, Tokens } from '$lib/api/types';

export const actions: Actions = {
	request: async ({ request, fetch }) => {
		const form = await request.formData();
		const phone = String(form.get('phone') ?? '').trim();
		const next = safeNext(form.get('next'));
		if (!phone) return fail(422, { phone, next, message: 'Enter your mobile number.' });

		try {
			await call(fetch, '/v1/store/auth/otp', { method: 'POST', body: { phone } });
		} catch (cause) {
			return fail(429, { phone, next, message: toUserMessage(cause) });
		}
		return { sent: true, phone, next };
	},

	verify: async ({ request, fetch, cookies, url }) => {
		const form = await request.formData();
		const phone = String(form.get('phone') ?? '').trim();
		const code = String(form.get('code') ?? '').trim();

		let tokens: Tokens;
		try {
			tokens = (
				await call<Tokens>(fetch, '/v1/store/auth/verify', {
					method: 'POST',
					body: { phone, code }
				})
			).data;
			writeSession(cookies, tokens);
		} catch (cause) {
			return fail(422, { sent: true, phone, message: toUserMessage(cause) });
		}

		// Handing the guest token to the first signed-in cart call folds the
		// basket into the account; the API answers with the account's token.
		const guestCart = readCart(cookies);
		if (guestCart) {
			try {
				const merged = await call<Cart>(fetch, '/v1/store/cart', {
					cartToken: guestCart,
					token: tokens.access_token
				});
				writeCart(cookies, merged.cartToken);
			} catch {
				/* the basket survives on its own token if the merge fails */
			}
		}

		redirect(303, safeNext(form.get('next')) ?? url.searchParams.get('next') ?? '/account');
	}
};

/* Where to go once they are in.
 *
 * It is carried through the form rather than read off the URL, because posting
 * to `?/verify` replaces the query string and takes `next` with it. That went
 * unnoticed for as long as the only caller was /account, which is also the
 * fallback — the first page to want somewhere else got sent to the orders list
 * instead.
 *
 * Only a path on this site is honoured. `next` arrives in a query string that
 * anybody can write, and following it to another origin would turn our own
 * sign-in page into a way to bounce somebody somewhere they did not intend.
 */
function safeNext(raw: FormDataEntryValue | null): string | undefined {
	const value = typeof raw === 'string' ? raw.trim() : '';
	if (!value.startsWith('/') || value.startsWith('//')) return undefined;
	return value;
}
