import { error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { call, get } from '$lib/server/api';
import { accessAfterParent, readAccess } from '$lib/server/session';
import { isApiError } from '$lib/api/errors';
import { failedCall } from '$lib/server/form';
import type { SellerOrderDetail } from '$lib/seller/types';

export const load: PageServerLoad = async ({ fetch, cookies, params, parent }) => {
	try {
		const order = await get<SellerOrderDetail>(fetch, `/v1/vendor/orders/${params.id}`, {
			token: await accessAfterParent(parent, cookies)
		});
		return { order };
	} catch (cause) {
		/* A package belonging to another seller comes back as a plain not-found
		   rather than a refusal, and that is the right answer: telling somebody
		   an id exists but is not theirs is itself a small leak. */
		if (isApiError(cause) && cause.status === 404) error(404, { message: cause.message });
		throw cause;
	}
};

export const actions: Actions = {
	/* Booking runs on the shop's courier account, not the seller's — the account
	   belongs to whoever runs the marketplace, and a seller never sees it. The
	   API refuses this outright unless the package is the seller's own. */
	ship: async ({ request, fetch, cookies, params }) => {
		const form = await request.formData();
		try {
			await call(fetch, `/v1/vendor/packages/${params.id}/ship`, {
				method: 'POST',
				body: { note: String(form.get('note') ?? '').trim() },
				token: readAccess(cookies)
			});
		} catch (cause) {
			return failedCall(cause);
		}
		return { done: 'The courier has been booked.' };
	}
};
