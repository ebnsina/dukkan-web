import type { PageServerLoad } from './$types';
import { get } from '$lib/server/api';
import { accessAfterParent } from '$lib/server/session';
import type { AdminCustomer } from '$lib/admin/types';
import type { OrderSummary } from '$lib/api/types';

export const load: PageServerLoad = async ({ fetch, cookies, params, parent }) => {
	const reply = await get<{ customer: AdminCustomer; orders: OrderSummary[] }>(
		fetch,
		`/v1/admin/customers/${encodeURIComponent(params.phone)}`,
		{ token: await accessAfterParent(parent, cookies) }
	);
	return { customer: reply.customer, orders: reply.orders ?? [] };
};
