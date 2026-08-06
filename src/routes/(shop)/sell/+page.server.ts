import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { call, get } from '$lib/server/api';
import { readAccess } from '$lib/server/session';
import { failedCall } from '$lib/server/form';
import type { District } from '$lib/api/types';
import type { AdminSeller } from '$lib/admin/types';

export const load: PageServerLoad = async ({ fetch, cookies, url, parent }) => {
	const { shop } = await parent();

	/* A shop with one seller is not recruiting. A database trigger refuses a
	   second seller and the API now says so plainly, but there is no reason to
	   show somebody a form that cannot succeed. */
	if (shop.shop_mode !== 'marketplace') {
		error(404, { message: 'This shop does not take other sellers.' });
	}

	/* Applying needs an account, because an application belongs to a person —
	   it is how they sign in afterwards and how the shop reaches them. Sent to
	   sign in and brought straight back. */
	const token = readAccess(cookies);
	if (!token) redirect(303, `/signin?next=${encodeURIComponent(url.pathname)}`);

	const [districts, mine] = await Promise.all([
		get<{ districts: District[] }>(fetch, '/v1/store/districts'),
		get<{ vendors: AdminSeller[] }>(fetch, '/v1/store/vendor-signup/mine', { token })
	]);

	return {
		districts: districts.districts ?? [],
		/* What they already have here, if anything. Somebody who applied last
		   week should see where it got to, not an empty form inviting them to
		   apply again — the API would refuse that anyway. */
		existing: (mine.vendors ?? []).find((v) => v.status !== 'rejected') ?? null
	};
};

export const actions: Actions = {
	default: async ({ request, fetch, cookies }) => {
		const form = await request.formData();

		try {
			await call(fetch, '/v1/store/vendor-signup/apply', {
				method: 'POST',
				body: {
					name: String(form.get('name') ?? '').trim(),
					phone: String(form.get('phone') ?? '').trim(),
					email: String(form.get('email') ?? '').trim(),
					tagline: String(form.get('tagline') ?? '').trim(),
					description: String(form.get('description') ?? '').trim(),
					address: String(form.get('address') ?? '').trim(),
					district: String(form.get('district') ?? '').trim()
				},
				token: readAccess(cookies)
			});
		} catch (cause) {
			return failedCall(cause);
		}

		/* Reloaded rather than toasted: the page's answer to "what now" changes
		   completely once an application exists, and that is a standing state
		   rather than something that just happened. */
		redirect(303, '/sell');
	}
};
