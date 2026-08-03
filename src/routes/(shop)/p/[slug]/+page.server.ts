import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { call, get } from '$lib/server/api';
import { readAccess, readCart, writeCart } from '$lib/server/session';
import { isApiError, toUserMessage } from '$lib/api/errors';
import type { Cart, ProductDetail } from '$lib/api/types';

export const load: PageServerLoad = async ({ fetch, params }) => {
	try {
		return { product: await get<ProductDetail>(fetch, `/v1/store/products/${params.slug}`) };
	} catch (cause) {
		if (isApiError(cause) && cause.status === 404) error(404, { message: cause.message });
		throw cause;
	}
};

export const actions: Actions = {
	add: async ({ request, fetch, cookies }) => {
		const form = await request.formData();
		const variantId = String(form.get('variant_id') ?? '');
		const quantity = Number(form.get('quantity') ?? 1);

		try {
			const reply = await call<Cart>(fetch, '/v1/store/cart/items', {
				method: 'POST',
				body: { variant_id: variantId, quantity },
				cartToken: readCart(cookies),
				token: readAccess(cookies)
			});
			writeCart(cookies, reply.cartToken);
		} catch (cause) {
			return fail(isApiError(cause) ? (cause.status ?? 500) : 500, {
				message: toUserMessage(cause)
			});
		}
		redirect(303, '/cart');
	}
};
