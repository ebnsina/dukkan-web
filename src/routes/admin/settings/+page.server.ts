import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { call, get } from '$lib/server/api';
import { readAccess } from '$lib/server/session';
import { fieldErrors, isApiError, toUserMessage } from '$lib/api/errors';
import type { PaymentMethod } from '$lib/api/types';

export const load: PageServerLoad = async ({ fetch }) => {
	const reply = await get<{ payment_methods: PaymentMethod[] | null }>(
		fetch,
		'/v1/store/payment-methods'
	);
	return { live: reply.payment_methods ?? [] };
};

export const actions: Actions = {
	payments: async ({ request, fetch, cookies }) => {
		const form = await request.formData();
		try {
			await call(fetch, '/v1/admin/payment-methods/sslcommerz', {
				method: 'PUT',
				body: {
					store_id: String(form.get('store_id') ?? ''),
					store_password: String(form.get('store_password') ?? ''),
					is_sandbox: form.get('is_sandbox') === 'on',
					is_enabled: form.get('is_enabled') === 'on'
				},
				token: readAccess(cookies)
			});
		} catch (cause) {
			return fail(isApiError(cause) ? (cause.status ?? 500) : 500, {
				section: 'payments',
				fields: fieldErrors(cause),
				message: toUserMessage(cause)
			});
		}
		return { section: 'payments', done: 'Card and mobile payments are saved.' };
	},

	courier: async ({ request, fetch, cookies }) => {
		const form = await request.formData();
		try {
			await call(fetch, '/v1/admin/courier-account', {
				method: 'PUT',
				body: {
					api_key: String(form.get('api_key') ?? ''),
					secret_key: String(form.get('secret_key') ?? ''),
					webhook_token: String(form.get('webhook_token') ?? ''),
					is_enabled: form.get('is_enabled') === 'on'
				},
				token: readAccess(cookies)
			});
		} catch (cause) {
			return fail(isApiError(cause) ? (cause.status ?? 500) : 500, {
				section: 'courier',
				fields: fieldErrors(cause),
				message: toUserMessage(cause)
			});
		}
		return { section: 'courier', done: 'Delivery is saved.' };
	}
};
