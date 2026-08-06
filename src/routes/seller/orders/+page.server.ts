import type { PageServerLoad } from './$types';
import { get } from '$lib/server/api';
import { accessAfterParent } from '$lib/server/session';
import type { SellerOrder } from '$lib/seller/types';

export const load: PageServerLoad = async ({ fetch, cookies, url, parent }) => {
	const q = url.searchParams.get('q') ?? '';
	const status = url.searchParams.get('status') ?? '';

	/* No seller id goes up with this. The API resolves which shop is asking from
	   the token, so there is nothing here for a seller to change in order to read
	   somebody else's orders. */
	const reply = await get<{ orders: SellerOrder[] }>(fetch, '/v1/vendor/orders', {
		token: await accessAfterParent(parent, cookies),
		query: { q, status, limit: 100 }
	});

	return { orders: reply.orders ?? [], filters: { q, status } };
};
