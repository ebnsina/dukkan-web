import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { call, get } from '$lib/server/api';
import { readAccess } from '$lib/server/session';
import { failedCall } from '$lib/server/form';
import type { Ticket } from '$lib/admin/types';

export const load: PageServerLoad = async ({ fetch, cookies }) => {
	/* Signed in, the customer's own conversations come with the page. A guest
	   sees only the form — which is the common case here, and the reason this
	   whole thing does not require an account. */
	const token = readAccess(cookies);
	if (!token) return { tickets: [] };

	const mine = await get<{ tickets: Ticket[] }>(fetch, '/v1/store/support/mine', { token }).catch(
		() => null
	);
	return { tickets: mine?.tickets ?? [] };
};

export const actions: Actions = {
	ask: async ({ request, fetch, cookies }) => {
		const form = await request.formData();
		const values = {
			name: String(form.get('name') ?? '').trim(),
			phone: String(form.get('phone') ?? '').trim(),
			email: String(form.get('email') ?? '').trim(),
			subject: String(form.get('subject') ?? '').trim(),
			body: String(form.get('body') ?? '').trim()
		};

		let ticket: Ticket;
		try {
			const reply = await call<Ticket>(fetch, '/v1/store/support', {
				method: 'POST',
				body: { ...values, order_id: String(form.get('order_id') ?? '') },
				token: readAccess(cookies)
			});
			ticket = reply.data;
		} catch (cause) {
			return failedCall(cause, { values });
		}

		/* Reloaded rather than toasted: what the page says changes completely
		   once the question is in, and "we have it, here is your number" is a
		   standing state rather than something that just happened. */
		redirect(303, `/help?sent=${encodeURIComponent(ticket.number)}`);
	},

	reply: async ({ request, fetch, cookies }) => {
		const form = await request.formData();
		const body = String(form.get('body') ?? '').trim();
		if (!body) return fail(422, { message: 'Write something to send.' });

		try {
			await call(fetch, `/v1/store/support/mine/${String(form.get('id') ?? '')}/reply`, {
				method: 'POST',
				body: { body },
				token: readAccess(cookies)
			});
		} catch (cause) {
			return failedCall(cause);
		}
		return { done: 'Sent.' };
	}
};
