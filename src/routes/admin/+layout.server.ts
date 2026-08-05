import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { call } from '$lib/server/api';
import { clearSession, renewAccess } from '$lib/server/session';
import type { StoreContext } from '$lib/api/types';
import { isApiError } from '$lib/api/errors';

interface Identity {
	id: string;
	roles: string[];
}

const STAFF = ['owner', 'admin', 'staff'];

export const load: LayoutServerLoad = async ({ fetch, cookies, url }) => {
	if (url.pathname === '/admin/signin') return { identity: null, shop: null };

	/* The layout renews, and every page under it waits for this before reading
	   the cookie — see `accessAfterParent`. Doing it here rather than per page
	   is what keeps two loads from rotating the refresh token at once. */
	const access = await renewAccess(fetch, cookies);
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
