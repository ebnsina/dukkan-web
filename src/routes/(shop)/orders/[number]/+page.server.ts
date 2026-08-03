import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { call } from '$lib/server/api';
import { isApiError } from '$lib/api/errors';
import type { OrderDetail } from '$lib/api/types';

export const load: PageServerLoad = async ({ fetch, params, url }) => {
	const phone = url.searchParams.get('phone');
	if (!phone) {
		return { order: null, number: params.number, placed: url.searchParams.get('placed') === '1' };
	}

	try {
		const reply = await call<OrderDetail>(fetch, '/v1/store/orders/track', {
			method: 'POST',
			body: { number: params.number, phone }
		});
		return {
			order: reply.data,
			number: params.number,
			placed: url.searchParams.get('placed') === '1'
		};
	} catch (cause) {
		if (isApiError(cause) && cause.status === 404) error(404, { message: cause.message });
		throw cause;
	}
};
