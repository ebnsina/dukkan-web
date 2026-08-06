import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { get } from '$lib/server/api';
import { isApiError } from '$lib/api/errors';
import type { StorefrontPage } from '$lib/api/types';

export const load: PageServerLoad = async ({ fetch, params }) => {
	try {
		/* A draft comes back as not-found rather than forbidden. To somebody who
		   is not the shop, an unpublished page does not exist — and saying "you
		   may not read that" would tell them it does. */
		const page = await get<StorefrontPage>(fetch, `/v1/store/pages/${params.slug}`);
		return { page };
	} catch (cause) {
		if (isApiError(cause) && cause.status === 404) error(404, { message: cause.message });
		throw cause;
	}
};
