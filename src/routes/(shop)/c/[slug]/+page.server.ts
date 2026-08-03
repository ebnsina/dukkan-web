import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { get } from '$lib/server/api';
import { isApiError } from '$lib/api/errors';
import type { ProductPage } from '$lib/api/types';

export const load: PageServerLoad = async ({ fetch, params, url, parent }) => {
	const sort = url.searchParams.get('sort') ?? '';
	const offset = Number(url.searchParams.get('offset') ?? 0);

	try {
		const page = await get<ProductPage>(fetch, '/v1/store/products', {
			query: { category: params.slug, sort, offset, limit: 24 }
		});
		const { categories } = await parent();
		const category = categories.find((c) => c.slug === params.slug);
		return { page, category, sort };
	} catch (cause) {
		if (isApiError(cause) && cause.status === 404) error(404, { message: cause.message });
		throw cause;
	}
};
