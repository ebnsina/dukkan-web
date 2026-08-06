import type { PageServerLoad } from './$types';
import { get } from '$lib/server/api';
import { accessAfterParent } from '$lib/server/session';
import type { Plan } from '$lib/api/types';
import type { BillingReport, UsageReport } from '$lib/admin/types';

export const load: PageServerLoad = async ({ fetch, cookies, parent }) => {
	const token = await accessAfterParent(parent, cookies);
	/* The price list is quoted from the same place the landing page quotes it,
	   so an upgrade prompt can never name a figure nobody charges. */
	const [report, billing, plans] = await Promise.all([
		get<UsageReport>(fetch, '/v1/admin/usage', { token }),
		get<BillingReport>(fetch, '/v1/admin/billing', { token }),
		get<{ plans: Plan[] }>(fetch, '/v1/plans').catch(() => ({ plans: [] }))
	]);
	return { report, billing, plans: plans.plans ?? [] };
};
