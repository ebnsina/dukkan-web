import type { PageServerLoad } from './$types';
import { get } from '$lib/server/api';
import { accessAfterParent } from '$lib/server/session';
import type { OrderSummary } from '$lib/api/types';

export const load: PageServerLoad = async ({ fetch, cookies, url, parent }) => {
	const q = url.searchParams.get('q') ?? '';
	const status = url.searchParams.get('status') ?? '';
	const payment_state = url.searchParams.get('payment_state') ?? '';

	const reply = await get<{ orders: OrderSummary[] }>(fetch, '/v1/admin/orders', {
		token: await accessAfterParent(parent, cookies),
		query: { q, status, payment_state, limit: 100 }
	});

	return { orders: reply.orders ?? [], filters: { q, status, payment_state } };
};
