import { fail, redirect } from '@sveltejs/kit';
import * as v from 'valibot';
import type { Actions, PageServerLoad } from './$types';
import { call, get } from '$lib/server/api';
import { clearCart, readAccess, readCart, writeCart } from '$lib/server/session';
import { isApiError } from '$lib/api/errors';
import type { Cart, District, PaymentMethod, PlacedOrder } from '$lib/api/types';
import { failedCall } from '$lib/server/form';

const CheckoutSchema = v.object({
	recipient: v.pipe(
		v.string(),
		v.trim(),
		v.nonEmpty('Enter the name of the person receiving this.')
	),
	phone: v.pipe(
		v.string(),
		v.trim(),
		v.nonEmpty('Enter a mobile number for delivery.'),
		v.regex(/^(\+?88)?01[3-9]\d{8}$/, 'Enter a Bangladeshi mobile number, like 01712345678.')
	),
	email: v.pipe(v.string(), v.trim()),
	district_code: v.pipe(v.string(), v.nonEmpty('Choose a district.')),
	thana: v.pipe(v.string(), v.trim(), v.nonEmpty('Enter the thana or upazila.')),
	area: v.pipe(v.string(), v.trim()),
	street: v.pipe(v.string(), v.trim(), v.nonEmpty('Enter the delivery address.')),
	postcode: v.pipe(v.string(), v.trim()),
	payment_method: v.pipe(v.string(), v.nonEmpty('Choose how you want to pay.')),
	note: v.pipe(v.string(), v.trim())
});

export const load: PageServerLoad = async ({ fetch, cookies }) => {
	const cartReply = await call<Cart>(fetch, '/v1/store/cart', {
		cartToken: readCart(cookies),
		token: readAccess(cookies)
	});
	writeCart(cookies, cartReply.cartToken);

	if (cartReply.data.lines.length === 0) redirect(303, '/cart');

	const [districts, methods] = await Promise.all([
		get<{ districts: District[] }>(fetch, '/v1/store/districts'),
		get<{ payment_methods: PaymentMethod[] | null }>(fetch, '/v1/store/payment-methods')
	]);

	return {
		cart: cartReply.data,
		districts: districts.districts ?? [],
		methods: methods.payment_methods ?? [{ provider: 'cod', display_name: 'Cash on delivery' }]
	};
};

export const actions: Actions = {
	default: async ({ request, fetch, cookies }) => {
		const form = await request.formData();
		const values = Object.fromEntries(
			[
				'recipient',
				'phone',
				'email',
				'district_code',
				'thana',
				'area',
				'street',
				'postcode',
				'payment_method',
				'note'
			].map((key) => [key, String(form.get(key) ?? '')])
		);

		const parsed = v.safeParse(CheckoutSchema, values);
		if (!parsed.success) {
			const fields = Object.fromEntries(
				parsed.issues.map((issue) => [String(issue.path?.[0]?.key ?? ''), issue.message])
			);
			return fail(422, {
				values,
				fields,
				message: 'Some of the details you entered need fixing.',
				soldOut: false
			});
		}

		let order: PlacedOrder;
		try {
			const reply = await call<PlacedOrder>(fetch, '/v1/store/cart/checkout', {
				method: 'POST',
				body: parsed.output,
				cartToken: readCart(cookies),
				token: readAccess(cookies)
			});
			order = reply.data;
		} catch (cause) {
			// A 409 means someone else took the last one while this basket was open.
			return failedCall(cause, { values, soldOut: isApiError(cause) && cause.status === 409 });
		}

		clearCart(cookies);
		if (order.redirect_url) redirect(303, order.redirect_url);
		redirect(
			303,
			`/orders/${order.number}?placed=1&phone=${encodeURIComponent(parsed.output.phone)}`
		);
	}
};
