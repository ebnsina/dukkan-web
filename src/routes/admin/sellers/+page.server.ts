import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { call, get } from '$lib/server/api';
import { accessAfterParent, readAccess } from '$lib/server/session';
import { failedCall } from '$lib/server/form';
import type { AdminSeller } from '$lib/admin/types';

export const load: PageServerLoad = async ({ fetch, cookies, url, parent }) => {
	const { shop } = await parent();

	/* A shop with one seller has no sellers to review. The page is not merely
	   empty there — it is about a thing that does not exist — so it refuses
	   rather than rendering a table nobody can ever fill. */
	if (shop?.shop_mode !== 'marketplace') {
		error(404, { message: 'This shop does not take other sellers.' });
	}

	const status = url.searchParams.get('status') ?? '';
	const reply = await get<{ vendors: AdminSeller[] }>(fetch, '/v1/admin/vendors', {
		token: await accessAfterParent(parent, cookies),
		query: { status, limit: 100 }
	});

	return { sellers: reply.vendors ?? [], filters: { status } };
};

/* Reviewing somebody's application. Approving spends one of the plan's seller
   places and hands them the seller role in the same transaction, so a refusal
   for being over the allowance comes back from the API rather than being
   guessed at here. */
export const actions: Actions = {
	approve: async ({ request, fetch, cookies }) => {
		const form = await request.formData();
		try {
			await call(fetch, `/v1/admin/vendors/${String(form.get('id') ?? '')}/approve`, {
				method: 'POST',
				token: readAccess(cookies)
			});
		} catch (cause) {
			return failedCall(cause);
		}
		return { done: 'They can start selling now.' };
	},

	reject: async ({ request, fetch, cookies }) => {
		const form = await request.formData();
		const reason = String(form.get('reason') ?? '').trim();
		// The API insists on this too. Asked for here so the person typing finds
		// out before the round trip, and in the same words either way.
		if (!reason) {
			return fail(422, {
				fields: { reason: 'Tell them why, so they can fix it and try again.' },
				message: 'Some details need fixing.'
			});
		}

		try {
			await call(fetch, `/v1/admin/vendors/${String(form.get('id') ?? '')}/reject`, {
				method: 'POST',
				body: { reason },
				token: readAccess(cookies)
			});
		} catch (cause) {
			return failedCall(cause);
		}
		return { done: 'They have been told.' };
	},

	suspend: async ({ request, fetch, cookies }) => {
		const form = await request.formData();
		try {
			await call(fetch, `/v1/admin/vendors/${String(form.get('id') ?? '')}/suspend`, {
				method: 'POST',
				body: { reason: String(form.get('reason') ?? '').trim() },
				token: readAccess(cookies)
			});
		} catch (cause) {
			return failedCall(cause);
		}
		return { done: 'They can no longer sell here.' };
	},

	/* One seller's own rate. An empty box is not a rate of zero — it hands them
	   back to the shop-wide default, which is a different agreement. */
	commission: async ({ request, fetch, cookies }) => {
		const form = await request.formData();
		const typed = String(form.get('percent') ?? '').trim();
		const fixed = String(form.get('fixed') ?? '').trim();

		const percent = typed === '' ? null : Number(typed);
		if (percent !== null && (!Number.isFinite(percent) || percent < 0 || percent > 100)) {
			return fail(422, {
				fields: { percent: 'Enter a rate between 0 and 100, or leave it empty.' },
				message: 'Some details need fixing.'
			});
		}

		const flat = fixed === '' ? null : Number(fixed);
		if (flat !== null && (!Number.isFinite(flat) || flat < 0)) {
			return fail(422, {
				fields: { fixed: 'Enter an amount, or leave it empty.' },
				message: 'Some details need fixing.'
			});
		}

		try {
			await call(fetch, `/v1/admin/vendors/${String(form.get('id') ?? '')}/commission`, {
				method: 'PUT',
				body: {
					commission_milli: percent === null ? null : Math.round(percent * 1000),
					commission_fixed_minor: flat === null ? null : Math.round(flat * 100)
				},
				token: readAccess(cookies)
			});
		} catch (cause) {
			return failedCall(cause);
		}
		return { done: 'Saved. It applies to their next order.' };
	}
};
