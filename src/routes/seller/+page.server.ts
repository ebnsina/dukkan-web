import type { PageServerLoad } from './$types';
import { get } from '$lib/server/api';
import { accessAfterParent } from '$lib/server/session';
import type { SellerOrder, SellerOwed } from '$lib/seller/types';
import type { PayoutRecord } from '$lib/admin/types';

export const load: PageServerLoad = async ({ fetch, cookies, parent }) => {
	const token = await accessAfterParent(parent, cookies);

	const [owed, recent, paid] = await Promise.all([
		get<SellerOwed>(fetch, '/v1/vendor/owed', { token }),
		/* Only what still needs doing. A seller landing here wants the parcels
		   waiting on them, not a history. */
		get<{ orders: SellerOrder[] }>(fetch, '/v1/vendor/orders', {
			token,
			query: { status: 'pending', limit: 8 }
		}),
		/* What the shop has actually sent, and the balance it still holds. On a
		   marketplace this is a real ledger balance; on a shop with one seller
		   there is no ledger and it is simply zero — which is true, because the
		   money never belonged to anybody else. */
		get<{ payouts: PayoutRecord[]; owed_minor: number }>(fetch, '/v1/vendor/payouts', { token })
	]);

	return {
		owed,
		waiting: recent.orders ?? [],
		payouts: paid.payouts ?? [],
		balanceMinor: paid.owed_minor ?? 0
	};
};
