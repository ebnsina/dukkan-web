import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { call, get } from '$lib/server/api';
import { accessAfterParent, readAccess } from '$lib/server/session';
import { isApiError } from '$lib/api/errors';
import { toMinor } from '$lib/utils/money';
import type { OrderDetail } from '$lib/api/types';
import type { Refund } from '$lib/admin/types';
import { failedCall } from '$lib/server/form';

export const load: PageServerLoad = async ({ fetch, cookies, params, parent }) => {
	const token = await accessAfterParent(parent, cookies);
	try {
		const [order, refunds] = await Promise.all([
			get<OrderDetail>(fetch, `/v1/admin/orders/${params.id}`, { token }),
			get<{ refunds: Refund[] }>(fetch, `/v1/admin/orders/${params.id}/refunds`, { token })
		]);
		return { order, refunds: refunds.refunds ?? [] };
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

	/* Recording money the shop has already handed back through their own
	   gateway or in cash. Dukkàn never held it, so it cannot send it — without
	   this the order goes on reading as paid and reconciliation keeps chasing. */
	refund: async ({ request, fetch, cookies, params }) => {
		const form = await request.formData();
		const amount = Number(String(form.get('amount') ?? '').trim());
		if (!Number.isFinite(amount) || amount <= 0) {
			return fail(422, { message: 'Enter how much you gave back.' });
		}
		const reason = String(form.get('reason') ?? '').trim();
		if (!reason) {
			return fail(422, { message: 'Say why this was refunded.' });
		}

		try {
			await call(fetch, `/v1/admin/orders/${params.id}/refunds`, {
				method: 'POST',
				body: {
					amount_minor: toMinor(amount),
					method: String(form.get('method') ?? 'manual'),
					reference: String(form.get('reference') ?? '').trim(),
					reason
				},
				token: readAccess(cookies)
			});
		} catch (cause) {
			return failedCall(cause);
		}
		return { done: 'The refund is recorded.' };
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
