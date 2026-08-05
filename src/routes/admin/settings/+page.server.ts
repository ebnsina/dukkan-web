import type { Actions, PageServerLoad } from './$types';
import { call, get } from '$lib/server/api';
import { accessAfterParent, readAccess } from '$lib/server/session';

import type { AppliedTheme, PaymentMethod, ThemeSummary } from '$lib/api/types';
import { failedCall } from '$lib/server/form';

export const load: PageServerLoad = async ({ fetch, cookies, parent }) => {
	const token = await accessAfterParent(parent, cookies);

	const [payments, themes, applied] = await Promise.all([
		get<{ payment_methods: PaymentMethod[] | null }>(fetch, '/v1/store/payment-methods'),
		get<{ themes: ThemeSummary[] }>(fetch, '/v1/admin/themes', { token }),
		get<AppliedTheme>(fetch, '/v1/admin/theme', { token })
	]);

	return {
		live: payments.payment_methods ?? [],
		themes: themes.themes ?? [],
		applied
	};
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
			return failedCall(cause, { section: 'payments' });
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
			return failedCall(cause, { section: 'courier' });
		}
		return { section: 'courier', done: 'Delivery is saved.' };
	},

	// Switching a design changes nothing else — products, orders and settings
	// are untouched, which is the difference between a theme and a copied
	// starter. The server re-checks the pair; a preset can be withdrawn.
	theme: async ({ request, fetch, cookies }) => {
		const form = await request.formData();
		let applied: AppliedTheme;
		try {
			const reply = await call<AppliedTheme>(fetch, '/v1/admin/theme', {
				method: 'PUT',
				body: {
					theme_code: String(form.get('theme_code') ?? ''),
					preset_code: String(form.get('preset_code') ?? '')
				},
				token: readAccess(cookies)
			});
			applied = reply.data;
		} catch (cause) {
			return failedCall(cause, { section: 'theme' });
		}
		return {
			section: 'theme',
			done: `Your shop wears ${applied.theme_name} · ${applied.preset_name} now.`
		};
	}
};
