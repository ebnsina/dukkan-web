import { fail } from '@sveltejs/kit';
import * as v from 'valibot';
import type { Actions, PageServerLoad } from './$types';
import { call, get } from '$lib/server/api';
import { accessAfterParent, readAccess } from '$lib/server/session';
import { failedCall } from '$lib/server/form';
import { toMinor } from '$lib/utils/money';
import type { Coupon } from '$lib/admin/types';

export const load: PageServerLoad = async ({ fetch, cookies, parent }) => {
	const reply = await get<{ coupons: Coupon[] }>(fetch, '/v1/admin/coupons', {
		token: await accessAfterParent(parent, cookies)
	});
	return { coupons: reply.coupons ?? [] };
};

/* A shop owner types a percentage and an amount in taka; the API takes basis
   points and minor units. Converting here keeps the form in the language the
   shop thinks in and the request in the one the API bills in. */
const Form = v.object({
	code: v.pipe(
		v.string(),
		v.trim(),
		v.nonEmpty('Give the code a name, like EID15.'),
		v.regex(/^[A-Za-z0-9-]+$/, 'Letters, numbers and hyphens — it gets typed by hand.')
	),
	kind: v.picklist(['percent', 'fixed'], 'Choose a percentage or an amount.'),
	value: v.pipe(
		v.string(),
		v.nonEmpty('How much comes off?'),
		v.transform(Number),
		v.number('That has to be a number.'),
		v.minValue(0.01, 'More than nothing.')
	),
	max_discount: v.pipe(v.string(), v.trim()),
	min_order: v.pipe(v.string(), v.trim()),
	max_redemptions: v.pipe(v.string(), v.trim()),
	max_per_customer: v.pipe(v.string(), v.trim())
});

const optionalMinor = (raw: string) => (raw === '' ? null : toMinor(Number(raw)));
const optionalCount = (raw: string) => (raw === '' ? null : Number(raw));

export const actions: Actions = {
	create: async ({ request, fetch, cookies }) => {
		const form = await request.formData();
		const values = Object.fromEntries(
			[
				'code',
				'kind',
				'value',
				'max_discount',
				'min_order',
				'max_redemptions',
				'max_per_customer'
			].map((key) => [key, String(form.get(key) ?? '')])
		);

		const parsed = v.safeParse(Form, values);
		if (!parsed.success) {
			const fields: Record<string, string> = {};
			for (const issue of parsed.issues) {
				fields[String(issue.path?.[0]?.key ?? '')] = issue.message;
			}
			return fail(422, { values, fields, message: 'Some details need fixing.' });
		}

		const { code, kind, value } = parsed.output;
		if (kind === 'percent' && value > 100) {
			return fail(422, {
				values,
				fields: { value: 'A percentage cannot go above 100.' },
				message: 'Some details need fixing.'
			});
		}

		try {
			await call(fetch, '/v1/admin/coupons', {
				method: 'POST',
				body: {
					code,
					kind,
					// Basis points: a tenth of a percent is the finest a shop needs,
					// and it keeps the wire integer.
					percent_bp: kind === 'percent' ? Math.round(value * 100) : null,
					amount_minor: kind === 'fixed' ? toMinor(value) : null,
					max_discount_minor: kind === 'percent' ? optionalMinor(parsed.output.max_discount) : null,
					min_order_minor: optionalMinor(parsed.output.min_order) ?? 0,
					max_redemptions: optionalCount(parsed.output.max_redemptions),
					max_per_customer: optionalCount(parsed.output.max_per_customer),
					is_active: true
				},
				token: readAccess(cookies)
			});
		} catch (cause) {
			return failedCall(cause, { values });
		}
		return { done: `${code.toUpperCase()} is live.` };
	},

	/* Withdrawing switches a coupon off rather than deleting it: the orders
	   that took it still have to explain why they cost less than list price. */
	withdraw: async ({ request, fetch, cookies }) => {
		const form = await request.formData();
		try {
			await call(fetch, `/v1/admin/coupons/${String(form.get('id') ?? '')}`, {
				method: 'DELETE',
				token: readAccess(cookies)
			});
		} catch (cause) {
			return failedCall(cause);
		}
		return { done: 'That code is withdrawn.' };
	}
};
