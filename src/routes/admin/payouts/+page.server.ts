import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { call, get } from '$lib/server/api';
import { accessAfterParent, readAccess } from '$lib/server/session';
import { failedCall } from '$lib/server/form';
import { toMinor } from '$lib/utils/money';
import type { PayoutRecord, VendorOwing } from '$lib/admin/types';

export const load: PageServerLoad = async ({ fetch, cookies, parent }) => {
	const { shop } = await parent();

	/* A shop with one seller owes nobody: the money is already the owner's.
	   The page is about a thing that does not exist there, so it refuses
	   rather than showing an empty table nothing can ever fill. */
	if (shop?.shop_mode !== 'marketplace') {
		error(404, { message: 'This shop has no sellers to pay.' });
	}

	const token = await accessAfterParent(parent, cookies);
	const [owing, paid] = await Promise.all([
		get<{ owing: VendorOwing[] }>(fetch, '/v1/admin/payouts/owing', { token }),
		get<{ payouts: PayoutRecord[] }>(fetch, '/v1/admin/payouts', { token, query: { limit: 100 } })
	]);

	return { owing: owing.owing ?? [], payouts: paid.payouts ?? [] };
};

export const actions: Actions = {
	/* Writing down a payment already made. The API refuses more than is owed,
	   checked against the ledger inside its own transaction — this is only the
	   first, friendlier line of defence. */
	record: async ({ request, fetch, cookies }) => {
		const form = await request.formData();
		const amount = Number(String(form.get('amount') ?? '').trim());

		if (!Number.isFinite(amount) || amount <= 0) {
			return fail(422, {
				fields: { amount: 'Enter how much you sent.' },
				message: 'Some details need fixing.'
			});
		}

		try {
			await call(fetch, '/v1/admin/payouts', {
				method: 'POST',
				body: {
					vendor_id: String(form.get('vendor_id') ?? ''),
					amount_minor: toMinor(amount),
					method: String(form.get('method') ?? 'bkash'),
					reference: String(form.get('reference') ?? '').trim(),
					note: String(form.get('note') ?? '').trim(),
					paid_on: String(form.get('paid_on') ?? '').trim()
				},
				token: readAccess(cookies)
			});
		} catch (cause) {
			return failedCall(cause);
		}
		return { done: 'Written down. They are no longer owed it.' };
	}
};
