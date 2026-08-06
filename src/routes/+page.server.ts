import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { PUBLIC_DEMO_SHOP } from '$env/static/public';
import { get } from '$lib/server/api';
import { shopFromHost, storefrontUrl } from '$lib/server/shop';
import type { Plan } from '$lib/api/types';

/* The landing page quotes what the API bills.
 *
 * It used to invent its own figures, which is the one lie a pricing page
 * cannot tell: the plans table is what a shop is actually charged against, and
 * a page quoting anything else is a promise the product does not keep.
 *
 * A price list that will not load is worn rather than raised. The rest of the
 * page — what the product does, who uses it, how to sign up — is still worth
 * reading, and an empty list says so plainly rather than falling back to
 * numbers nobody checked.
 */
export const load: PageServerLoad = async ({ fetch, url }) => {
	/* This page sells Dukkàn, so it belongs to nobody. On a shop's own address
	   the shop is what was asked for — `rahim.dukkan.store` showing our
	   marketing page instead of Rahim's would be the wrong site entirely. */
	if (shopFromHost(url.host)) redirect(307, '/shop');

	/* "See live stores" has to lead to a live store. `/shop` did, back when the
	   environment pinned the whole app to one shop; now that a shop is its
	   address, that link has no shop in it and resolves to nothing. */
	const demoShop = storefrontUrl(PUBLIC_DEMO_SHOP, url);

	try {
		const reply = await get<{ plans: Plan[] }>(fetch, '/v1/plans');
		return { plans: reply.plans ?? [], demoShop };
	} catch {
		return { plans: [], demoShop };
	}
};
