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
		if (!phone) return fail(422, { phone, message: 'Enter your mobile number.' });

		try {
			await call(fetch, '/v1/store/auth/otp', { method: 'POST', body: { phone } });
		} catch (cause) {
			return fail(429, { phone, message: toUserMessage(cause) });
		}
		return { sent: true, phone };
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

		redirect(303, url.searchParams.get('next') ?? '/account');
	}
};
