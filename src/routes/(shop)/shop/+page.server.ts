import type { PageServerLoad } from './$types';
import { get } from '$lib/server/api';
import type { ProductPage } from '$lib/api/types';

export const load: PageServerLoad = async ({ fetch }) => {
	const page = await get<ProductPage>(fetch, '/v1/store/products', { query: { limit: 24 } });
	return { page };
};
