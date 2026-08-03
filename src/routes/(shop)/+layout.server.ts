import type { LayoutServerLoad } from './$types';
import { get, call } from '$lib/server/api';
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

export const load: LayoutServerLoad = async ({ fetch, cookies }) => {
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
