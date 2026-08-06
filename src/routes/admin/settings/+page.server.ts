import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { call, get } from '$lib/server/api';
import { accessAfterParent, readAccess } from '$lib/server/session';

import type { AppliedTheme, PaymentMethod, SettingsOverview, ThemeSummary } from '$lib/api/types';
import type { StaffMember } from '$lib/admin/types';
import { failedCall } from '$lib/server/form';

export const load: PageServerLoad = async ({ fetch, cookies, parent }) => {
	const token = await accessAfterParent(parent, cookies);

	const [payments, themes, applied, staff, overview] = await Promise.all([
		get<{ payment_methods: PaymentMethod[] | null }>(fetch, '/v1/store/payment-methods'),
		get<{ themes: ThemeSummary[] }>(fetch, '/v1/admin/themes', { token }),
		get<AppliedTheme>(fetch, '/v1/admin/theme', { token }),
		get<{ staff: StaffMember[] }>(fetch, '/v1/admin/staff', { token }),
		get<SettingsOverview>(fetch, '/v1/admin/settings', { token })
	]);

	return {
		live: payments.payment_methods ?? [],
		staff: staff.staff ?? [],
		/* Whether a credential is behind each provider. The values themselves are
		   sealed and never returned, so this is all a card can honestly say. */
		payments: overview.payment ?? [],
		couriers: overview.courier ?? [],
		themes: themes.themes ?? [],
		applied
	};
};

export const actions: Actions = {
	/* Who can sign in. The API holds these to owner and admin, so a staff
	   account reaching this action is refused there rather than here. */
	staffAdd: async ({ request, fetch, cookies }) => {
		const form = await request.formData();
		const phone = String(form.get('phone') ?? '').trim();
		const role = String(form.get('role') ?? '');

		if (!/^(\+?88)?01[3-9]\d{8}$/.test(phone)) {
			return fail(422, {
				section: 'staff',
				fields: { phone: 'Enter a Bangladeshi mobile number, like 01712345678.' },
				message: 'Some details need fixing.'
			});
		}

		try {
			await call(fetch, '/v1/admin/staff', {
				method: 'POST',
				body: { phone, name: String(form.get('name') ?? '').trim(), role },
				token: readAccess(cookies)
			});
		} catch (cause) {
			return failedCall(cause, { section: 'staff' });
		}
		return { section: 'staff', done: 'They can sign in now.' };
	},

	staffRole: async ({ request, fetch, cookies }) => {
		const form = await request.formData();
		try {
			await call(fetch, `/v1/admin/staff/${String(form.get('id') ?? '')}/role`, {
				method: 'PUT',
				body: { role: String(form.get('role') ?? '') },
				token: readAccess(cookies)
			});
		} catch (cause) {
			return failedCall(cause, { section: 'staff' });
		}
		return { section: 'staff', done: 'Their role is changed.' };
	},

	staffRemove: async ({ request, fetch, cookies }) => {
		const form = await request.formData();
		try {
			await call(fetch, `/v1/admin/staff/${String(form.get('id') ?? '')}`, {
				method: 'DELETE',
				token: readAccess(cookies)
			});
		} catch (cause) {
			return failedCall(cause, { section: 'staff' });
		}
		return { section: 'staff', done: 'They can no longer sign in.' };
	},

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
