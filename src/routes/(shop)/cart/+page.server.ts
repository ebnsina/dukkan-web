import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { call } from '$lib/server/api';
import { readAccess, readCart, writeCart } from '$lib/server/session';
import { isApiError, toUserMessage } from '$lib/api/errors';
import type { Cart } from '$lib/api/types';

export const load: PageServerLoad = async ({ fetch, cookies }) => {
	const reply = await call<Cart>(fetch, '/v1/store/cart', {
		cartToken: readCart(cookies),
		token: readAccess(cookies)
	});
	writeCart(cookies, reply.cartToken);
	return { cart: reply.data };
};

export const actions: Actions = {
	setQuantity: async ({ request, fetch, cookies }) => {
		const form = await request.formData();
		try {
			const reply = await call<Cart>(fetch, '/v1/store/cart/items', {
				method: 'PUT',
				body: {
					variant_id: String(form.get('variant_id') ?? ''),
					quantity: Number(form.get('quantity') ?? 0)
				},
				cartToken: readCart(cookies),
				token: readAccess(cookies)
			});
			writeCart(cookies, reply.cartToken);
		} catch (cause) {
			return fail(isApiError(cause) ? (cause.status ?? 500) : 500, {
				message: toUserMessage(cause)
			});
		}
		return { ok: true };
	}
};
