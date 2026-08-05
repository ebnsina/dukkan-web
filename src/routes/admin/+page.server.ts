import type { PageServerLoad } from './$types';
import { get } from '$lib/server/api';
import { accessAfterParent } from '$lib/server/session';
import type { Dashboard, LowStockItem, OrderSummary } from '$lib/api/types';
import type { ReconciliationIssue } from '$lib/admin/types';

/* The figures are counted in the database. Adding up a page of orders in here
   got a different answer, because it cannot see a delivered parcel the courier
   has not yet paid over — which is the number a shop owner most wants. */
export const load: PageServerLoad = async ({ fetch, cookies, parent }) => {
	const token = await accessAfterParent(parent, cookies);
	const [figures, orders, issues, low] = await Promise.all([
		get<Dashboard>(fetch, '/v1/admin/dashboard', { token }),
		get<{ orders: OrderSummary[] }>(fetch, '/v1/admin/orders', { token, query: { limit: 8 } }),
		get<{ issues: ReconciliationIssue[] }>(fetch, '/v1/admin/reconciliation/issues', {
			token,
			query: { limit: 4 }
		}),
		get<{ items: LowStockItem[] }>(fetch, '/v1/admin/low-stock', { token })
	]);

	return {
		figures,
		recent: orders.orders ?? [],
		issues: issues.issues ?? [],
		low: (low.items ?? []).slice(0, 5)
	};
};
