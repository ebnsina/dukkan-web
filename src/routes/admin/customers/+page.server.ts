import type { PageServerLoad } from './$types';
import { get } from '$lib/server/api';
import { accessAfterParent } from '$lib/server/session';
import type { AdminCustomer } from '$lib/admin/types';

export const load: PageServerLoad = async ({ fetch, cookies, url, parent }) => {
	const q = url.searchParams.get('q') ?? '';
	const reply = await get<{ customers: AdminCustomer[] }>(fetch, '/v1/admin/customers', {
		token: await accessAfterParent(parent, cookies),
		query: { q, limit: 100 }
	});
	return { customers: reply.customers ?? [], filters: { q } };
};
