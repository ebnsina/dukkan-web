import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { call, get } from '$lib/server/api';
import { readAccess } from '$lib/server/session';
import { isApiError, toUserMessage } from '$lib/api/errors';
import type { AdminProduct } from '$lib/admin/types';

export const load: PageServerLoad = async ({ fetch, cookies, url }) => {
	const q = url.searchParams.get('q') ?? '';
	const status = url.searchParams.get('status') ?? '';
	const reply = await get<{ products: AdminProduct[] }>(fetch, '/v1/admin/products', {
		token: readAccess(cookies),
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
			return fail(isApiError(cause) ? (cause.status ?? 500) : 500, {
				message: toUserMessage(cause)
			});
		}
		return { done: true };
	}
};
