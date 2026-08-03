import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { call } from '$lib/server/api';
import { writeSession } from '$lib/server/session';
import { toUserMessage } from '$lib/api/errors';
import type { Tokens } from '$lib/api/types';

export const actions: Actions = {
	request: async ({ request, fetch }) => {
		const form = await request.formData();
		const phone = String(form.get('phone') ?? '').trim();
		if (!phone) return fail(422, { phone, message: 'Enter your mobile number.' });

		try {
			await call(fetch, '/v1/store/auth/otp', { method: 'POST', body: { phone } });
		} catch (cause) {
			return fail(429, { phone, message: toUserMessage(cause) });
		}
		return { sent: true, phone };
	},

	verify: async ({ request, fetch, cookies, url }) => {
		const form = await request.formData();
		const phone = String(form.get('phone') ?? '').trim();
		const code = String(form.get('code') ?? '').trim();

		try {
			const tokens = await call<Tokens>(fetch, '/v1/store/auth/verify', {
				method: 'POST',
				body: { phone, code }
			});
			writeSession(cookies, tokens.data);
		} catch (cause) {
			return fail(422, { sent: true, phone, message: toUserMessage(cause) });
		}
		redirect(303, url.searchParams.get('next') ?? '/admin');
	}
};
