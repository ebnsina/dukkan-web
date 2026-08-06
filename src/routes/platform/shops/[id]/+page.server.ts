import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { call, get } from '$lib/server/api';
import { readOperator } from '$lib/server/operator';
import { isApiError } from '$lib/api/errors';
import { failedCall } from '$lib/server/form';
import type { PlatformPlan, PlatformShopDetail } from '$lib/platform/types';

export const load: PageServerLoad = async ({ fetch, cookies, params }) => {
	const token = readOperator(cookies);
	try {
		const [detail, plans] = await Promise.all([
			get<PlatformShopDetail>(fetch, `/v1/platform/shops/${params.id}`, { token }),
			get<{ plans: PlatformPlan[] }>(fetch, '/v1/platform/plans', { token })
		]);
		return { ...detail, overrides: detail.overrides ?? [], plans: plans.plans ?? [] };
	} catch (cause) {
		if (isApiError(cause) && cause.status === 404) error(404, { message: 'No such shop.' });
		throw cause;
	}
};

export const actions: Actions = {
	plan: async ({ request, fetch, cookies, params }) => {
		const form = await request.formData();
		try {
			await call(fetch, `/v1/platform/shops/${params.id}/plan`, {
				method: 'PUT',
				body: { plan_code: String(form.get('plan_code') ?? '') },
				token: readOperator(cookies)
			});
		} catch (cause) {
			return failedCall(cause);
		}
		return { done: 'Plan changed. Their limits moved straight away.' };
	},

	/* Suspending takes a real shop's storefront down. It is one click behind a
	   confirmation rather than two, because an operator doing this has already
	   decided — but the wording on the button says what it does. */
	status: async ({ request, fetch, cookies, params }) => {
		const form = await request.formData();
		const status = String(form.get('status') ?? '');
		try {
			await call(fetch, `/v1/platform/shops/${params.id}/status`, {
				method: 'PUT',
				body: { status, reason: String(form.get('reason') ?? '') },
				token: readOperator(cookies)
			});
		} catch (cause) {
			return failedCall(cause);
		}
		return {
			done:
				status === 'suspended'
					? 'Their storefront is down. Customers see a closed shop.'
					: `Status is now ${status.replace('_', ' ')}.`
		};
	},

	override: async ({ request, fetch, cookies, params }) => {
		const form = await request.formData();
		const feature = String(form.get('feature') ?? '');
		const raw = String(form.get('limit') ?? '').trim();
		const enabled = form.get('enabled') === 'on';

		// Blank means unlimited, which is a real answer and not a missing one.
		let limit: number | null = null;
		if (raw !== '') {
			limit = Number(raw);
			if (!Number.isInteger(limit) || limit < 0) {
				return fail(422, { message: 'A limit has to be a whole number, or blank for unlimited.' });
			}
		}

		try {
			await call(fetch, `/v1/platform/shops/${params.id}/entitlements`, {
				method: 'PUT',
				body: { feature, enabled, limit },
				token: readOperator(cookies)
			});
		} catch (cause) {
			return failedCall(cause);
		}
		return { done: `Override set on ${feature.replace(/_/g, ' ')}.` };
	},

	clearOverride: async ({ request, fetch, cookies, params }) => {
		const form = await request.formData();
		const feature = String(form.get('feature') ?? '');
		try {
			await call(fetch, `/v1/platform/shops/${params.id}/entitlements/${feature}`, {
				method: 'DELETE',
				token: readOperator(cookies)
			});
		} catch (cause) {
			return failedCall(cause);
		}
		return { done: `Back to whatever the plan says for ${feature.replace(/_/g, ' ')}.` };
	}
};
