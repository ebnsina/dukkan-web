import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { call, get } from '$lib/server/api';
import { readAccess, readCart, writeCart } from '$lib/server/session';
import { isApiError } from '$lib/api/errors';
import type { Cart, ProductDetail } from '$lib/api/types';
import { failedCall } from '$lib/server/form';

export const load: PageServerLoad = async ({ fetch, params }) => {
	try {
		/* The API builds the JSON-LD, because it holds the price and the price is
		   never a float — it goes out as a decimal string, and rebuilding it here
		   would be the one place a rounding error could get back in. A shop with
		   no structured data still sells, so a failure here is worn, not raised. */
		const [product, schema] = await Promise.all([
			get<ProductDetail>(fetch, `/v1/store/products/${params.slug}`),
			get<unknown>(fetch, `/v1/store/products/${params.slug}/schema`).catch(() => null)
		]);
		return { product, schema };
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
			return failedCall(cause);
		}
		redirect(303, '/cart');
	}
};
