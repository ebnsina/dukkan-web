import type { PageServerLoad } from './$types';
import { get } from '$lib/server/api';
import type { ProductPage } from '$lib/api/types';

export const load: PageServerLoad = async ({ fetch, url }) => {
	const q = url.searchParams.get('q') ?? '';
	if (!q) return { q, page: null };
	const page = await get<ProductPage>(fetch, '/v1/store/products', { query: { q, limit: 48 } });
	return { q, page };
};
