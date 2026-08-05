import type { Actions, PageServerLoad } from './$types';
import { call, get } from '$lib/server/api';
import { accessAfterParent, readAccess } from '$lib/server/session';

import type { AdminProduct } from '$lib/admin/types';
import { failedCall } from '$lib/server/form';

export const load: PageServerLoad = async ({ fetch, cookies, url, parent }) => {
	const q = url.searchParams.get('q') ?? '';
	const status = url.searchParams.get('status') ?? '';
	const reply = await get<{ products: AdminProduct[] }>(fetch, '/v1/admin/products', {
		token: await accessAfterParent(parent, cookies),
		query: { q, status, limit: 100 }
	});
	return { products: reply.products ?? [], filters: { q, status } };
};

export const actions: Actions = {
	setStatus: async ({ request, fetch, cookies }) => {
		const form = await request.formData();
		try {
			await call(fetch, `/v1/admin/products/${String(form.get('id') ?? '')}/status`, {
				method: 'PUT',
				body: { status: String(form.get('status') ?? '') },
				token: readAccess(cookies)
			});
		} catch (cause) {
			return failedCall(cause);
		}
		return { done: true };
	}
};
