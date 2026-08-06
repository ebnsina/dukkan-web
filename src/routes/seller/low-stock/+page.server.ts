import type { PageServerLoad } from './$types';
import { get } from '$lib/server/api';
import { accessAfterParent } from '$lib/server/session';
import type { LowStockItem } from '$lib/api/types';

/* The threshold is the shop's own, per item, and the API falls back to a
   sensible one. Passing it here only widens the net when someone asks. */
export const load: PageServerLoad = async ({ fetch, cookies, url, parent }) => {
	const threshold = Number(url.searchParams.get('threshold')) || 0;

	const reply = await get<{ items: LowStockItem[] }>(fetch, '/v1/vendor/low-stock', {
		token: await accessAfterParent(parent, cookies),
		query: threshold > 0 ? { threshold } : {}
	});

	return { items: reply.items ?? [], threshold };
};
