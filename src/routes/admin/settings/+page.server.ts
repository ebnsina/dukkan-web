import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { call, get } from '$lib/server/api';
import { accessAfterParent, readAccess } from '$lib/server/session';

import type { AppliedTheme, PaymentMethod, SettingsOverview, ThemeSummary } from '$lib/api/types';
import type { DomainStatus, NotificationPrefs, StaffMember, UsageReport } from '$lib/admin/types';
import { failedCall } from '$lib/server/form';

export const load: PageServerLoad = async ({ fetch, cookies, parent }) => {
	const token = await accessAfterParent(parent, cookies);

	const [payments, themes, applied, staff, overview, notifications, domain, usage] =
		await Promise.all([
			get<{ payment_methods: PaymentMethod[] | null }>(fetch, '/v1/store/payment-methods'),
			get<{ themes: ThemeSummary[] }>(fetch, '/v1/admin/themes', { token }),
			get<AppliedTheme>(fetch, '/v1/admin/theme', { token }),
			get<{ staff: StaffMember[] }>(fetch, '/v1/admin/staff', { token }),
			get<SettingsOverview>(fetch, '/v1/admin/settings', { token }),
			get<NotificationPrefs>(fetch, '/v1/admin/notifications', { token }),
			/* Staff cannot read this endpoint, and settings is open to them — so a
		   refusal is a state of the page rather than a failure of it. */
			get<DomainStatus>(fetch, '/v1/admin/domain', { token }).catch(() => null),
			/* Whether the plan carries a custom domain at all, so the card offers a
		   box or explains why there is none rather than failing on submit. */
			get<UsageReport>(fetch, '/v1/admin/usage', { token }).catch(() => null)
		]);

	return {
		live: payments.payment_methods ?? [],
		staff: staff.staff ?? [],
		/* Whether a credential is behind each provider. The values themselves are
		   sealed and never returned, so this is all a card can honestly say. */
		payments: overview.payment ?? [],
		couriers: overview.courier ?? [],
		themes: themes.themes ?? [],
		applied,
		notifications,
		/* The shop-wide commission default, and the shop mode that decides
		   whether it is worth showing at all. */
		shopSettings: overview.shop,
		domain: domain ?? { domain: '', verified: false, claimed_at: null, verified_at: null },
		domainIncluded: usage?.usage.find((u) => u.feature === 'custom_domain')?.enabled ?? false
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

	/* What the marketplace keeps out of each seller's sale. Typed as a
	   percentage because that is how it is agreed with a seller, and sent as
	   thousandths because that is how it stays integer the whole way down. */
	commission: async ({ request, fetch, cookies }) => {
		const form = await request.formData();
		const typed = String(form.get('percent') ?? '').trim();
		const percent = Number(typed);

		if (typed === '' || !Number.isFinite(percent) || percent < 0 || percent > 100) {
			return fail(422, {
				section: 'commission',
				fields: { percent: 'Enter a rate between 0 and 100.' },
				message: 'Some details need fixing.'
			});
		}

		try {
			await call(fetch, '/v1/admin/commission', {
				method: 'PUT',
				body: { commission_milli: Math.round(percent * 1000) },
				token: readAccess(cookies)
			});
		} catch (cause) {
			return failedCall(cause, { section: 'commission' });
		}
		return { section: 'commission', done: 'Saved. New orders use this rate.' };
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

	/* Which messages go out, and the shop's own SMS account to send them with.
	   Bangla is unicode — 70 characters a part against 160 — so every message
	   the shop turns on costs them, and each one is a separate decision. */
	notifications: async ({ request, fetch, cookies }) => {
		const form = await request.formData();
		try {
			await call(fetch, '/v1/admin/notifications', {
				method: 'PUT',
				body: {
					sms_enabled: form.get('sms_enabled') === 'on',
					provider: String(form.get('provider') ?? ''),
					api_key: String(form.get('api_key') ?? ''),
					sender_id: String(form.get('sender_id') ?? ''),
					sender_name: String(form.get('sender_name') ?? '').trim(),
					notify_placed: form.get('notify_placed') === 'on',
					notify_shipped: form.get('notify_shipped') === 'on',
					notify_delivered: form.get('notify_delivered') === 'on',
					notify_cancelled: form.get('notify_cancelled') === 'on'
				},
				token: readAccess(cookies)
			});
		} catch (cause) {
			return failedCall(cause, { section: 'notifications' });
		}
		return { section: 'notifications', done: 'Text messages are saved.' };
	},

	domainClaim: async ({ request, fetch, cookies }) => {
		const form = await request.formData();
		try {
			await call(fetch, '/v1/admin/domain', {
				method: 'PUT',
				body: { domain: String(form.get('domain') ?? '') },
				token: readAccess(cookies)
			});
		} catch (cause) {
			return failedCall(cause, { section: 'domain' });
		}
		return { section: 'domain', done: 'Now add the record it shows you.' };
	},

	domainVerify: async ({ fetch, cookies }) => {
		try {
			await call(fetch, '/v1/admin/domain/verify', {
				method: 'POST',
				token: readAccess(cookies)
			});
		} catch (cause) {
			return failedCall(cause, { section: 'domain' });
		}
		return { section: 'domain', done: "That is your shop's address now." };
	},

	domainRelease: async ({ fetch, cookies }) => {
		try {
			await call(fetch, '/v1/admin/domain', {
				method: 'DELETE',
				token: readAccess(cookies)
			});
		} catch (cause) {
			return failedCall(cause, { section: 'domain' });
		}
		return { section: 'domain', done: 'Your shop is back on its own address only.' };
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
