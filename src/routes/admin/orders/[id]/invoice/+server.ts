import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getText } from '$lib/server/api';
import { renewAccess } from '$lib/server/session';
import { isApiError } from '$lib/api/errors';

/* The invoice is a document, not JSON: the API renders HTML so the browser
   handles Bangla and page breaks. It is served behind a bearer token the
   browser has no way to send, so the shop owner's link comes through here and
   the token is attached server-side.
 *
 * This is not under `+page.server.ts`, so `accessAfterParent` has no layout to
 * wait on — it renews the token itself. */
export const GET: RequestHandler = async ({ fetch, cookies, params }) => {
	const token = await renewAccess(fetch, cookies);
	if (!token) error(401, 'Sign in again to print this invoice.');

	try {
		const page = await getText(fetch, `/v1/admin/orders/${params.id}/invoice`, { token });
		return new Response(page, {
			headers: {
				'Content-Type': 'text/html; charset=utf-8',
				// A customer's address and total. Never a shared cache's.
				'Cache-Control': 'private, no-store'
			}
		});
	} catch (cause) {
		if (isApiError(cause) && cause.status === 404) error(404, 'We could not find that order.');
		error(502, 'The invoice could not be prepared.');
	}
};
