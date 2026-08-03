import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { call } from '$lib/server/api';
import { clearSession, readAccess, readRefresh, writeSession } from '$lib/server/session';
import type { StoreContext, Tokens } from '$lib/api/types';
import { isApiError } from '$lib/api/errors';

interface Identity {
	id: string;
	roles: string[];
}

const STAFF = ['owner', 'admin', 'staff'];

export const load: LayoutServerLoad = async ({ fetch, cookies, url }) => {
	if (url.pathname === '/admin/signin') return { identity: null, shop: null };

	let access = readAccess(cookies);
	const refresh = readRefresh(cookies);

	// A short-lived access token is refreshed silently before giving up.
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

	if (!access) redirect(303, `/admin/signin?next=${encodeURIComponent(url.pathname)}`);

	let identity: Identity;
	try {
		identity = (await call<Identity>(fetch, '/v1/store/auth/me', { token: access })).data;
	} catch (cause) {
		if (isApiError(cause) && (cause.status === 401 || cause.status === 403)) {
			clearSession(cookies);
			redirect(303, '/admin/signin');
		}
		throw cause;
	}

	if (!identity.roles.some((role) => STAFF.includes(role))) {
		redirect(303, '/admin/signin?denied=1');
	}

	const shop = (await call<StoreContext>(fetch, '/v1/store/context')).data;
	return { identity, shop };
};
