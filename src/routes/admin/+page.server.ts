import type { PageServerLoad } from './$types';
import { get } from '$lib/server/api';
import { accessAfterParent } from '$lib/server/session';
import type { Dashboard } from '$lib/api/types';

/* The figures are counted in the database. Adding up a page of orders in here
   got a different answer, because it cannot see a delivered parcel the courier
   has not yet paid over — which is the number a shop owner most wants. */
export const load: PageServerLoad = async ({ fetch, cookies, parent }) => {
	/* One call now. The lists this page used to preview each cost a request on
	   every visit to render five rows nobody could act on from here. */
	return {
		figures: await get<Dashboard>(fetch, '/v1/admin/dashboard', {
			token: await accessAfterParent(parent, cookies)
		})
	};
};
