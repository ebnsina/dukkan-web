import type { Actions, PageServerLoad } from './$types';
import { call, get } from '$lib/server/api';
import { readAccess, readCart, writeCart } from '$lib/server/session';

import type { Cart, ProductDetail, ProductImage } from '$lib/api/types';
import { failedCall } from '$lib/server/form';

/* A cart line carries no photograph, so each distinct product is looked up for
   one. Storefront reads are unlimited and a basket is a handful of lines, but
   a `thumb_url` on the line itself would remove the fan-out entirely. */
async function thumbs(
	fetcher: typeof fetch,
	slugs: string[]
): Promise<Record<string, ProductImage | null>> {
	const unique = [...new Set(slugs)].slice(0, 20);
	const found = await Promise.all(
		unique.map(async (slug) => {
			try {
				const product = await get<ProductDetail>(fetcher, `/v1/store/products/${slug}`);
				return [slug, product.images?.[0] ?? null] as const;
			} catch {
				return [slug, null] as const;
			}
		})
	);
	return Object.fromEntries(found);
}

export const load: PageServerLoad = async ({ fetch, cookies }) => {
	const reply = await call<Cart>(fetch, '/v1/store/cart', {
		cartToken: readCart(cookies),
		token: readAccess(cookies)
	});
	writeCart(cookies, reply.cartToken);

	return {
		cart: reply.data,
		thumbs: await thumbs(
			fetch,
			reply.data.lines.map((line) => line.product_slug)
		)
	};
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
			return failedCall(cause);
		}
		return { ok: true };
	}
};
