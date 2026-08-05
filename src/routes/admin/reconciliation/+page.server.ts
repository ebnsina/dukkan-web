import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { call, get } from '$lib/server/api';
import { accessAfterParent, readAccess } from '$lib/server/session';
import { toUserMessage } from '$lib/api/errors';
import type { ReconciliationIssue } from '$lib/admin/types';
import { failedCall } from '$lib/server/form';

export const load: PageServerLoad = async ({ fetch, cookies, parent }) => {
	const reply = await get<{ issues: ReconciliationIssue[] }>(
		fetch,
		'/v1/admin/reconciliation/issues',
		{ token: await accessAfterParent(parent, cookies), query: { limit: 200 } }
	);
	return { issues: reply.issues ?? [] };
};

export const actions: Actions = {
	resolve: async ({ request, fetch, cookies }) => {
		const form = await request.formData();
		const id = String(form.get('id') ?? '');
		const resolution = String(form.get('resolution') ?? '').trim();

		if (!resolution) {
			return fail(422, { id, message: 'Say what you did about it.' });
		}

		try {
			await call(fetch, `/v1/admin/reconciliation/issues/${id}/resolve`, {
				method: 'POST',
				body: { resolution },
				token: readAccess(cookies)
			});
		} catch (cause) {
			return failedCall(cause, { id });
		}
		return { done: true };
	},

	sweep: async ({ fetch, cookies }) => {
		try {
			const reply = await call<{ flagged: number }>(fetch, '/v1/admin/reconciliation/sweep', {
				method: 'POST',
				token: readAccess(cookies)
			});
			return { flagged: reply.data.flagged };
		} catch (cause) {
			return fail(500, { message: toUserMessage(cause) });
		}
	}
};
