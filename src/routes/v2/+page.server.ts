import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { PUBLIC_DEMO_SHOP } from '$env/static/public';
import { get } from '$lib/server/api';
import { shopFromHost, storefrontUrl } from '$lib/server/shop';
import type { Plan } from '$lib/api/types';

/* The v2 landing page loads exactly what v1 does, for the same reasons: the
 * prices are what the billing system charges rather than figures written into
 * the page, and a price list that will not load is worn rather than invented.
 */
export const load: PageServerLoad = async ({ fetch, url }) => {
	/* This page sells Dukkàn, so it belongs to nobody. On a shop's own address
	   the shop is what was asked for. */
	if (shopFromHost(url.host)) redirect(307, '/shop');

	const demoShop = storefrontUrl(PUBLIC_DEMO_SHOP, url);

	try {
		const reply = await get<{ plans: Plan[] }>(fetch, '/v1/plans');
		return { plans: reply.plans ?? [], demoShop };
	} catch {
		return { plans: [], demoShop };
	}
};
