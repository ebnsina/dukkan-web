import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { get, call } from '$lib/server/api';
import { shopFromHost } from '$lib/server/shop';
import { readAccess, readCart, writeCart } from '$lib/server/session';
import type { AppliedTheme, Cart, Category, StoreContext } from '$lib/api/types';

const FALLBACK: AppliedTheme = {
	theme_code: 'counter',
	theme_name: 'Counter',
	layout: 'grid-dense',
	preset_code: 'plain',
	preset_name: 'Plain',
	tokens: { accent: '#0b0b0d', 'accent-ink': '#ffffff', surface: '#f7f7f8', density: 'compact' }
};

export const load: LayoutServerLoad = async ({ fetch, cookies, url }) => {
	/* A storefront needs a shop, and the shop is the address. Asked for on the
	   marketing host there is nothing to serve and nothing has gone wrong — it
	   is the wrong address rather than a broken one, so it goes to the page that
	   explains what this is. */
	if (!shopFromHost(url.host)) redirect(307, '/');

	const [shop, categories, theme] = await Promise.all([
		get<StoreContext>(fetch, '/v1/store/context'),
		get<{ categories: Category[] }>(fetch, '/v1/store/categories'),
		// A shop with no design still has to open, so this one failure is worn
		// rather than raised.
		get<AppliedTheme>(fetch, '/v1/store/theme').catch(() => FALLBACK)
	]);

	const reply = await call<Cart>(fetch, '/v1/store/cart', {
		cartToken: readCart(cookies),
		token: readAccess(cookies)
	});
	writeCart(cookies, reply.cartToken);

	return {
		shop,
		theme,
		categories: categories.categories ?? [],
		itemCount: reply.data.item_count,
		signedIn: Boolean(readAccess(cookies))
	};
};
