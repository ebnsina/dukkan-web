import { fail } from '@sveltejs/kit';
import * as v from 'valibot';
import type { Actions, PageServerLoad } from './$types';
import { call, get } from '$lib/server/api';
import { accessAfterParent, readAccess } from '$lib/server/session';

import { toMinor } from '$lib/utils/money';
import type { District } from '$lib/api/types';
import type { ShippingZone } from '$lib/admin/types';
import { failedCall } from '$lib/server/form';

const TakaSchema = v.pipe(
	v.string(),
	v.nonEmpty('Enter an amount.'),
	v.transform(Number),
	v.number('That has to be a number.'),
	v.minValue(0, 'An amount cannot be negative.')
);

export const load: PageServerLoad = async ({ fetch, cookies, parent }) => {
	const token = await accessAfterParent(parent, cookies);
	/* Districts are national reference data on the storefront surface — the same
	   list the shopper picks from, so a zone can never name one checkout cannot. */
	const [zones, districts] = await Promise.all([
		get<{ zones: ShippingZone[] }>(fetch, '/v1/admin/shipping/zones', { token }),
		get<{ districts: District[] }>(fetch, '/v1/store/districts')
	]);
	return { zones: zones.zones ?? [], districts: districts.districts ?? [] };
};

/* Reads the id a row's form carries, so the two rate actions agree on it. */
const form_id = (form: FormData) => String(form.get('rate_id') ?? '');

export const actions: Actions = {
	addZone: async ({ request, fetch, cookies }) => {
		const form = await request.formData();
		const name = String(form.get('name') ?? '').trim();
		if (name.length < 2) {
			const fields: Record<string, string> = { name: 'Give this area a name.' };
			return fail(422, { fields, message: 'Some details need fixing.' });
		}

		try {
			await call(fetch, '/v1/admin/shipping/zones', {
				method: 'POST',
				body: {
					name,
					is_default: form.get('is_default') === 'on',
					districts: form.getAll('districts').map(String)
				},
				token: readAccess(cookies)
			});
		} catch (cause) {
			return failedCall(cause);
		}
		return { saved: 'zone' };
	},

	/* The whole membership is sent every time, because a district belongs to
	   exactly one zone: moving Khulna out of one area is putting it into another. */
	setDistricts: async ({ request, fetch, cookies }) => {
		const form = await request.formData();
		try {
			await call(fetch, `/v1/admin/shipping/zones/${String(form.get('zone_id'))}/districts`, {
				method: 'PUT',
				body: { districts: form.getAll('districts').map(String) },
				token: readAccess(cookies)
			});
		} catch (cause) {
			return failedCall(cause);
		}
		return { saved: 'districts' };
	},

	removeRate: async ({ request, fetch, cookies }) => {
		try {
			await call(fetch, `/v1/admin/shipping/rates/${String(form_id(await request.formData()))}`, {
				method: 'DELETE',
				token: readAccess(cookies)
			});
		} catch (cause) {
			return failedCall(cause);
		}
		return { saved: 'rate' };
	},

	addRate: async ({ request, fetch, cookies }) => {
		const form = await request.formData();
		const price = v.safeParse(TakaSchema, String(form.get('price') ?? ''));
		const freeAboveRaw = String(form.get('free_above') ?? '').trim();
		const freeAbove = freeAboveRaw ? v.safeParse(TakaSchema, freeAboveRaw) : null;

		if (!price.success || (freeAbove && !freeAbove.success)) {
			const fields: Record<string, string> = {};
			if (!price.success) fields.price = price.issues[0].message;
			if (freeAbove && !freeAbove.success) fields.free_above = freeAbove.issues[0].message;
			return fail(422, { fields, message: 'Some details need fixing.' });
		}

		const days = (key: string) => {
			const raw = String(form.get(key) ?? '').trim();
			return raw ? Number(raw) : null;
		};

		try {
			await call(fetch, '/v1/admin/shipping/rates', {
				method: 'POST',
				body: {
					zone_id: String(form.get('zone_id') ?? ''),
					name: String(form.get('name') ?? '').trim(),
					price_minor: toMinor(price.output),
					free_above_minor: freeAbove ? toMinor(freeAbove.output as number) : null,
					min_days: days('min_days'),
					max_days: days('max_days'),
					is_active: true
				},
				token: readAccess(cookies)
			});
		} catch (cause) {
			return failedCall(cause);
		}
		return { saved: 'rate' };
	}
};
