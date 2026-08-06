import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { get } from '$lib/server/api';
import { readAccess } from '$lib/server/session';
import type { OrderSummary } from '$lib/api/types';

/* What the command palette asks as somebody types.
 *
 * It goes through here rather than straight from the browser because the shop
 * is carried by the Host header and the token lives in an httpOnly cookie —
 * neither of which the page can supply for itself. */
export const GET: RequestHandler = async ({ fetch, url, cookies }) => {
	const q = url.searchParams.get('q')?.trim() ?? '';
	if (q.length < 2) return json({ orders: [] });

	try {
		const reply = await get<{ orders: OrderSummary[] }>(fetch, '/v1/admin/orders', {
			token: readAccess(cookies),
			query: { q, limit: 6 }
		});
		// Only what a result row shows; the rest is nobody's business here.
		return json({
			orders: (reply.orders ?? []).map((o) => ({
				id: o.id,
				number: o.number,
				recipient: o.recipient,
				total_minor: o.total_minor
			}))
		});
	} catch {
		// A search that will not load is an empty result, not a broken page.
		return json({ orders: [] });
	}
};
