import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { call, get } from '$lib/server/api';
import { clearSession, readAccess, readRefresh, writeSession } from '$lib/server/session';
import { isApiError } from '$lib/api/errors';
import type { OrderSummary, Tokens } from '$lib/api/types';

export const load: PageServerLoad = async ({ fetch, cookies }) => {
	let access = readAccess(cookies);
	const refresh = readRefresh(cookies);

	if (!access && refresh) {
		try {
			const renewed = await call<Tokens>(fetch, '/v1/store/auth/refresh', {
				method: 'POST',
				body: { refresh_token: refresh }
			});
			writeSession(cookies, renewed.data);
			access = renewed.data.access_token;
		} catch {
			clearSession(cookies);
		}
	}

	if (!access) redirect(303, '/signin?next=/account');

	try {
		const reply = await get<{ orders: OrderSummary[] }>(fetch, '/v1/store/orders', {
			token: access,
			query: { limit: 50 }
		});
		return { orders: reply.orders ?? [] };
	} catch (cause) {
		if (isApiError(cause) && (cause.status === 401 || cause.status === 403)) {
			clearSession(cookies);
			redirect(303, '/signin?next=/account');
		}
		throw cause;
	}
};

export const actions: Actions = {
	signOut: async ({ fetch, cookies }) => {
		const refresh = readRefresh(cookies);
		try {
			await call(fetch, '/v1/store/auth/logout', {
				method: 'POST',
				body: { refresh_token: refresh ?? '' }
			});
		} catch {
			/* the local session is cleared either way */
		}
		clearSession(cookies);
		redirect(303, '/shop');
	}
};
