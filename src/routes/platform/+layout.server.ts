import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { get } from '$lib/server/api';
import { clearOperator, readOperator } from '$lib/server/operator';
import { isApiError } from '$lib/api/errors';
import { shopFromHost } from '$lib/utils/host';

/* The console belongs to nobody's shop, so it is served only from the bare
   domain. On a shop's own address the visitor asked for that shop, and an
   operator console answering there would be the wrong site — and a login box
   for our own keys on a customer's address. */
export const load: LayoutServerLoad = async ({ fetch, cookies, url }) => {
	if (shopFromHost(url.host)) redirect(307, '/shop');
	if (url.pathname === '/platform/signin') return { authenticated: false };

	const token = readOperator(cookies);
	if (!token) redirect(303, `/platform/signin?next=${encodeURIComponent(url.pathname)}`);

	/* The cheapest call on the surface, used to prove the token is still good
	   before any page renders behind it. A rotated secret should send the
	   operator back to the door rather than showing eight broken panels. */
	try {
		await get(fetch, '/v1/platform/plans', { token });
	} catch (cause) {
		if (isApiError(cause) && cause.status === 401) {
			clearOperator(cookies);
			redirect(303, '/platform/signin?stale=1');
		}
		throw cause;
	}

	return { authenticated: true };
};
