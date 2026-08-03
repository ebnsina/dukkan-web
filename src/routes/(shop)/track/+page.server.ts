import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { call } from '$lib/server/api';
import { toUserMessage } from '$lib/api/errors';
import type { OrderDetail } from '$lib/api/types';

export const actions: Actions = {
	default: async ({ request, fetch }) => {
		const form = await request.formData();
		const number = String(form.get('number') ?? '').trim();
		const phone = String(form.get('phone') ?? '').trim();

		if (!number || !phone) {
			return fail(422, {
				values: { number, phone },
				message: 'Enter your order number and the mobile number you ordered with.'
			});
		}

		try {
			const reply = await call<OrderDetail>(fetch, '/v1/store/orders/track', {
				method: 'POST',
				body: { number, phone }
			});
			return { order: reply.data };
		} catch (cause) {
			return fail(404, { values: { number, phone }, message: toUserMessage(cause) });
		}
	}
};
