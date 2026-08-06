import type { PageServerLoad } from './$types';
import { get } from '$lib/server/api';
import { accessAfterParent } from '$lib/server/session';
import type { SellerOrder, SellerOwed } from '$lib/seller/types';

export const load: PageServerLoad = async ({ fetch, cookies, parent }) => {
	const token = await accessAfterParent(parent, cookies);

	const [owed, recent] = await Promise.all([
		get<SellerOwed>(fetch, '/v1/vendor/owed', { token }),
		/* Only what still needs doing. A seller landing here wants the parcels
		   waiting on them, not a history. */
		get<{ orders: SellerOrder[] }>(fetch, '/v1/vendor/orders', {
			token,
			query: { status: 'pending', limit: 8 }
		})
	]);

	return { owed, waiting: recent.orders ?? [] };
};
