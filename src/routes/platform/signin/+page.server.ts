import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { get } from '$lib/server/api';
import { clearOperator, writeOperator } from '$lib/server/operator';
import { isApiError } from '$lib/api/errors';

export const actions: Actions = {
	enter: async ({ request, fetch, cookies, url }) => {
		const form = await request.formData();
		const token = String(form.get('token') ?? '').trim();
		if (!token) return fail(422, { message: 'Paste the operator token.' });

		/* Proved against the API rather than taken on trust, so a wrong token is
		   rejected at the door instead of on every page behind it. */
		try {
			await get(fetch, '/v1/platform/plans', { token });
		} catch (cause) {
			if (isApiError(cause) && cause.status === 401) {
				return fail(401, { message: 'That token is not right.' });
			}
			return fail(502, { message: 'The API could not be reached.' });
		}

		writeOperator(cookies, token);
		redirect(303, url.searchParams.get('next') ?? '/platform');
	},

	out: async ({ cookies }) => {
		clearOperator(cookies);
		redirect(303, '/platform/signin');
	}
};
