import type { PageServerLoad } from './$types';
import { get } from '$lib/server/api';
import { accessAfterParent } from '$lib/server/session';
import type { Ticket } from '$lib/admin/types';

export const load: PageServerLoad = async ({ fetch, cookies, url, parent }) => {
	const q = url.searchParams.get('q') ?? '';
	const status = url.searchParams.get('status') ?? '';

	const reply = await get<{ tickets: Ticket[] }>(fetch, '/v1/admin/support', {
		token: await accessAfterParent(parent, cookies),
		query: { q, status, limit: 100 }
	});

	return { tickets: reply.tickets ?? [], filters: { q, status } };
};
