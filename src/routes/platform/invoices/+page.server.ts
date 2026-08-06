import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { call, get } from '$lib/server/api';
import { readOperator } from '$lib/server/operator';
import { failedCall } from '$lib/server/form';
import type { PlatformInvoice } from '$lib/platform/types';

export const load: PageServerLoad = async ({ fetch, cookies, url }) => {
	const status = url.searchParams.get('status') ?? '';
	const reply = await get<{ invoices: PlatformInvoice[] }>(fetch, '/v1/platform/invoices', {
		token: readOperator(cookies),
		query: { status, limit: 300 }
	});
	return { invoices: reply.invoices ?? [], filters: { status } };
};

export const actions: Actions = {
	/* The sweep, on demand. It is idempotent — the unique index on
	   (tenant_id, period_start) sees to that — which is exactly why an operator
	   can be handed the button without a confirmation in front of it. */
	run: async ({ fetch, cookies }) => {
		try {
			const reply = await call<{ issued: number; past_due: number }>(
				fetch,
				'/v1/platform/billing/run',
				{ method: 'POST', token: readOperator(cookies) }
			);
			return { ran: reply.data };
		} catch (cause) {
			return failedCall(cause);
		}
	},

	paid: async ({ request, fetch, cookies }) => {
		const form = await request.formData();
		const id = String(form.get('id') ?? '');
		const method = String(form.get('method') ?? '').trim();
		if (!method) return fail(422, { id, message: 'Say how they paid.' });

		try {
			await call(fetch, `/v1/platform/invoices/${id}/paid`, {
				method: 'POST',
				body: {
					method,
					reference: String(form.get('reference') ?? '').trim(),
					note: String(form.get('note') ?? '').trim()
				},
				token: readOperator(cookies)
			});
		} catch (cause) {
			return failedCall(cause, { id });
		}
		return { done: 'Marked paid. If that was all they owed, their shop is active again.' };
	},

	// Written off rather than paid: a refund, a shop closing mid-period, or a
	// bill raised in error. None of those should ever look like money arrived.
	void: async ({ request, fetch, cookies }) => {
		const form = await request.formData();
		try {
			await call(fetch, `/v1/platform/invoices/${String(form.get('id') ?? '')}/void`, {
				method: 'POST',
				body: { reason: String(form.get('reason') ?? '').trim() },
				token: readOperator(cookies)
			});
		} catch (cause) {
			return failedCall(cause);
		}
		return { done: 'Written off.' };
	}
};
