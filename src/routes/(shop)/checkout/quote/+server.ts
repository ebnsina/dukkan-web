import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { get } from '$lib/server/api';

/* What delivery will cost, asked as soon as the shopper picks a district.
 *
 * It goes through here rather than straight from the browser because the shop
 * is carried by the Host header, and `originFor` is the one place that knows
 * how to turn this request into the right shop's API origin.
 *
 * Delivery is a large share of a small order in this market — ৳60–130 on a
 * basket that might be ৳500 — and cash on delivery means a shopper surprised
 * by it at the door simply refuses the parcel. The shop still pays the courier.
 * So the number belongs on the page before the order, not after it. */
export const GET: RequestHandler = async ({ fetch, url, setHeaders }) => {
	const district = url.searchParams.get('district_code') ?? '';
	const subtotal = Number(url.searchParams.get('subtotal_minor') ?? 0);

	if (!district || !Number.isFinite(subtotal) || subtotal < 0) {
		return json({ error: 'bad_request' }, { status: 400 });
	}

	try {
		const quote = await get<{ shipping_minor: number; total_minor: number; currency: string }>(
			fetch,
			'/v1/store/shipping/quote',
			{ query: { district_code: district, subtotal_minor: subtotal } }
		);
		// Same district, same basket, same answer for a minute — a shopper
		// correcting a typo in their street should not re-ask.
		setHeaders({ 'Cache-Control': 'private, max-age=60' });
		return json(quote);
	} catch {
		/* A quote that will not load must not block checkout: the API prices the
		   order authoritatively at submit either way. The page falls back to
		   saying delivery is added, which is what it said before. */
		return json({ error: 'unavailable' }, { status: 502 });
	}
};
