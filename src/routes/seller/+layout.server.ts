import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { call } from '$lib/server/api';
import { clearSession, renewAccess } from '$lib/server/session';
import type { StoreContext } from '$lib/api/types';
import type { SellerShop } from '$lib/seller/types';
import { isApiError } from '$lib/api/errors';

interface Identity {
	id: string;
	roles: string[];
}

export const load: LayoutServerLoad = async ({ fetch, cookies, url }) => {
	if (url.pathname === '/seller/signin') return { identity: null, shop: null, seller: null };

	/* Renewed here rather than per page, so two loads cannot rotate the refresh
	   token at once — the same reason the admin layout does it. */
	const access = await renewAccess(fetch, cookies);
	if (!access) redirect(303, `/seller/signin?next=${encodeURIComponent(url.pathname)}`);

	let identity: Identity;
	try {
		identity = (await call<Identity>(fetch, '/v1/store/auth/me', { token: access })).data;
	} catch (cause) {
		if (isApiError(cause) && (cause.status === 401 || cause.status === 403)) {
			clearSession(cookies);
			redirect(303, '/seller/signin');
		}
		throw cause;
	}

	if (!identity.roles.includes('vendor')) {
		redirect(303, '/seller/signin?denied=1');
	}

	/* Which shop this person sells for. The API resolves it from the token and
	   refuses while the application is still being reviewed, so a seller who is
	   not approved yet is turned away here rather than shown an empty shell. */
	let seller: SellerShop;
	try {
		seller = (await call<SellerShop>(fetch, '/v1/vendor/shop', { token: access })).data;
	} catch (cause) {
		if (isApiError(cause) && cause.status === 403) {
			redirect(303, '/seller/signin?pending=1');
		}
		throw cause;
	}

	const shop = (await call<StoreContext>(fetch, '/v1/store/context')).data;
	return { identity, shop, seller };
};
