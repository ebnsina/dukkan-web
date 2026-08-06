import type { PageServerLoad } from './$types';
import { get } from '$lib/server/api';
import { readOperator } from '$lib/server/operator';
import type { PlatformPlan, PlatformShop } from '$lib/platform/types';

export const load: PageServerLoad = async ({ fetch, cookies, url }) => {
	const token = readOperator(cookies);
	const q = url.searchParams.get('q') ?? '';
	const status = url.searchParams.get('status') ?? '';

	const [shops, plans] = await Promise.all([
		get<{ shops: PlatformShop[] }>(fetch, '/v1/platform/shops', {
			token,
			query: { q, status, limit: 200 }
		}),
		get<{ plans: PlatformPlan[] }>(fetch, '/v1/platform/plans', { token })
	]);

	return { shops: shops.shops ?? [], plans: plans.plans ?? [], filters: { q, status } };
};
