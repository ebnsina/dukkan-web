import { error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { call, get } from '$lib/server/api';
import { accessAfterParent, readAccess } from '$lib/server/session';
import { isApiError } from '$lib/api/errors';
import type { OrderDetail } from '$lib/api/types';
import { failedCall } from '$lib/server/form';

export const load: PageServerLoad = async ({ fetch, cookies, params, parent }) => {
	try {
		return {
			order: await get<OrderDetail>(fetch, `/v1/admin/orders/${params.id}`, {
				token: await accessAfterParent(parent, cookies)
			})
		};
	} catch (cause) {
		if (isApiError(cause) && cause.status === 404) error(404, { message: cause.message });
		throw cause;
	}
};

export const actions: Actions = {
	cancel: async ({ request, fetch, cookies, params }) => {
		const form = await request.formData();
		try {
			await call(fetch, `/v1/admin/orders/${params.id}/cancel`, {
				method: 'POST',
				body: { reason: String(form.get('reason') ?? '') },
				token: readAccess(cookies)
			});
		} catch (cause) {
			return failedCall(cause);
		}
		return { done: 'The order is cancelled.' };
	},

	ship: async ({ request, fetch, cookies }) => {
		const form = await request.formData();
		const packageId = String(form.get('package_id') ?? '');
		try {
			await call(fetch, `/v1/admin/packages/${packageId}/ship`, {
				method: 'POST',
				body: { note: String(form.get('note') ?? '') },
				token: readAccess(cookies)
			});
		} catch (cause) {
			return failedCall(cause);
		}
		return { done: 'The courier has been booked.' };
	}
};
