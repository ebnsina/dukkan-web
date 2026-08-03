import type { LayoutServerLoad } from './$types';
import { get, call } from '$lib/server/api';
import { readAccess, readCart, writeCart } from '$lib/server/session';
import type { Cart, Category, StoreContext } from '$lib/api/types';

export const load: LayoutServerLoad = async ({ fetch, cookies }) => {
	const [shop, categories] = await Promise.all([
		get<StoreContext>(fetch, '/v1/store/context'),
		get<{ categories: Category[] }>(fetch, '/v1/store/categories')
	]);

	const reply = await call<Cart>(fetch, '/v1/store/cart', {
		cartToken: readCart(cookies),
		token: readAccess(cookies)
	});
	writeCart(cookies, reply.cartToken);

	return {
		shop,
		categories: categories.categories ?? [],
		itemCount: reply.data.item_count,
		signedIn: Boolean(readAccess(cookies))
	};
};
