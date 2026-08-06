import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { call, get } from '$lib/server/api';
import { accessAfterParent, readAccess } from '$lib/server/session';
import { toUserMessage } from '$lib/api/errors';
import { toMinor } from '$lib/utils/money';
import type { ReconciliationIssue, SettlementImport } from '$lib/admin/types';
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

	/* The courier's own remittance file, sent on as it arrived. Its shape is
	   theirs, not ours — the matcher reads the headers loosely and turns what it
	   cannot place into visible issues rather than dropping the line. */
	import_: async ({ request, fetch, cookies }) => {
		const form = await request.formData();
		const file = form.get('report');
		if (!(file instanceof File) || file.size === 0) {
			return fail(422, { message: "Attach the courier's report as a CSV file." });
		}

		const reference = String(form.get('reference') ?? '').trim();
		if (!reference) {
			return fail(422, { message: "Enter the courier's payment reference." });
		}

		const upload = new FormData();
		upload.set('report', file);
		upload.set('reference', reference);
		upload.set('settled_on', String(form.get('settled_on') ?? ''));
		/* The form asks for taka, because that is what the courier's slip says.
		   Minor units are this API's convention and the conversion belongs here. */
		const declared = Number(String(form.get('declared_total') ?? '0') || 0);
		if (!Number.isFinite(declared) || declared < 0) {
			return fail(422, { message: 'The amount they sent has to be a number.' });
		}
		upload.set('declared_total_minor', String(toMinor(declared)));

		try {
			const reply = await call<SettlementImport>(fetch, '/v1/admin/settlements/import', {
				method: 'POST',
				upload,
				token: readAccess(cookies)
			});
			return { imported: reply.data };
		} catch (cause) {
			return failedCall(cause);
		}
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
