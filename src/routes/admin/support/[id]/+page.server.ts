import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { call, get } from '$lib/server/api';
import { accessAfterParent, readAccess } from '$lib/server/session';
import { isApiError } from '$lib/api/errors';
import { failedCall } from '$lib/server/form';
import type { Ticket } from '$lib/admin/types';

export const load: PageServerLoad = async ({ fetch, cookies, params, parent }) => {
	try {
		const ticket = await get<Ticket>(fetch, `/v1/admin/support/${params.id}`, {
			token: await accessAfterParent(parent, cookies)
		});
		return { ticket };
	} catch (cause) {
		if (isApiError(cause) && cause.status === 404) error(404, { message: cause.message });
		throw cause;
	}
};

export const actions: Actions = {
	reply: async ({ request, fetch, cookies, params }) => {
		const form = await request.formData();
		const body = String(form.get('body') ?? '').trim();
		if (!body) {
			return fail(422, { fields: { body: 'Write something to send.' } });
		}

		try {
			await call(fetch, `/v1/admin/support/${params.id}/reply`, {
				method: 'POST',
				body: { body },
				token: readAccess(cookies)
			});
		} catch (cause) {
			return failedCall(cause);
		}
		return { done: 'Sent.' };
	},

	status: async ({ request, fetch, cookies, params }) => {
		const form = await request.formData();
		try {
			await call(fetch, `/v1/admin/support/${params.id}/status`, {
				method: 'PUT',
				body: { status: String(form.get('status') ?? '') },
				token: readAccess(cookies)
			});
		} catch (cause) {
			return failedCall(cause);
		}
		return { done: 'Done.' };
	}
};
