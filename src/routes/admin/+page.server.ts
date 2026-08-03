import type { PageServerLoad } from './$types';
import { get } from '$lib/server/api';
import { readAccess } from '$lib/server/session';
import type { OrderSummary } from '$lib/api/types';
import type { ReconciliationIssue } from '$lib/admin/types';

/* The API has no dashboard endpoint, so the figures are counted from the two
   lists the shop owner actually acts on. */
export const load: PageServerLoad = async ({ fetch, cookies }) => {
	const token = readAccess(cookies);
	const [orders, issues] = await Promise.all([
		get<{ orders: OrderSummary[] }>(fetch, '/v1/admin/orders', { token, query: { limit: 100 } }),
		get<{ issues: ReconciliationIssue[] }>(fetch, '/v1/admin/reconciliation/issues', {
			token,
			query: { limit: 200 }
		})
	]);

	const list = orders.orders ?? [];
	const open = list.filter((o) => !['delivered', 'cancelled', 'returned'].includes(o.status));
	const awaitingCash = list.filter(
		(o) => o.payment_method === 'cod' && o.payment_state === 'pending'
	);

	return {
		recent: list.slice(0, 8),
		counts: {
			total: list.length,
			open: open.length,
			awaitingCash: awaitingCash.length,
			critical: (issues.issues ?? []).filter((i) => i.severity === 'critical').length
		},
		owed: awaitingCash.reduce((sum, o) => sum + o.total_minor, 0),
		issues: (issues.issues ?? []).slice(0, 4)
	};
};
