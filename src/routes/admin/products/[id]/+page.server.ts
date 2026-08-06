import { fail } from '@sveltejs/kit';
import * as v from 'valibot';
import type { Actions, PageServerLoad } from './$types';
import { call, get } from '$lib/server/api';
import { accessAfterParent, readAccess } from '$lib/server/session';

import { toMinor } from '$lib/utils/money';
import type { Category, ProductImage } from '$lib/api/types';
import type { AdminProduct } from '$lib/admin/types';
import { failedCall } from '$lib/server/form';

const DetailsSchema = v.object({
	title: v.pipe(v.string(), v.trim(), v.minLength(2, 'Give the product a name.')),
	title_bn: v.pipe(v.string(), v.trim()),
	summary: v.pipe(v.string(), v.trim()),
	description: v.pipe(v.string(), v.trim())
});

const PriceSchema = v.object({
	price: v.pipe(
		v.string(),
		v.nonEmpty('Enter a price.'),
		v.transform(Number),
		v.number('The price has to be a number.'),
		v.minValue(0, 'A price cannot be negative.')
	),
	on_hand: v.pipe(
		v.string(),
		v.transform((value) => Number(value || 0)),
		v.number('Stock has to be a number.'),
		v.minValue(0, 'Stock cannot be negative.')
	)
});

export const load: PageServerLoad = async ({ fetch, cookies, params, parent }) => {
	const token = await accessAfterParent(parent, cookies);
	const [product, categories] = await Promise.all([
		get<AdminProduct & { images?: ProductImage[] }>(fetch, `/v1/admin/products/${params.id}`, {
			token
		}),
		get<{ categories: Category[] }>(fetch, '/v1/admin/categories', { token })
	]);
	return { product, categories: categories.categories ?? [] };
};

export const actions: Actions = {
	/* Wording only. A price is a separate decision from a spelling mistake, and
	   the API splits them the same way. */
	details: async ({ request, fetch, cookies, params }) => {
		const form = await request.formData();
		const values = {
			title: String(form.get('title') ?? ''),
			title_bn: String(form.get('title_bn') ?? ''),
			summary: String(form.get('summary') ?? ''),
			description: String(form.get('description') ?? ''),
			category_id: String(form.get('category_id') ?? '')
		};

		const parsed = v.safeParse(DetailsSchema, values);
		if (!parsed.success) {
			const fields: Record<string, string> = {};
			for (const issue of parsed.issues) {
				fields[String(issue.path?.[0]?.key ?? '')] = issue.message;
			}
			return fail(422, { values, fields, message: 'Some details need fixing.' });
		}

		try {
			await call(fetch, `/v1/admin/products/${params.id}`, {
				method: 'PATCH',
				body: {
					title: parsed.output.title,
					title_bn: parsed.output.title_bn,
					summary: parsed.output.summary,
					description: parsed.output.description,
					category_id: values.category_id || null,
					clear_category: values.category_id === ''
				},
				token: readAccess(cookies)
			});
		} catch (cause) {
			return failedCall(cause, { values });
		}
		return { saved: 'details' };
	},

	/* Price and stock for one choice. Stock is sent as a count rather than a
	   delta because this form shows the owner the number they are replacing. */
	variant: async ({ request, fetch, cookies }) => {
		const form = await request.formData();
		const id = String(form.get('variant_id') ?? '');
		const values = {
			price: String(form.get('price') ?? ''),
			on_hand: String(form.get('on_hand') ?? '0')
		};

		const parsed = v.safeParse(PriceSchema, values);
		if (!parsed.success) {
			const fields: Record<string, string> = {};
			for (const issue of parsed.issues) {
				fields[`variant.${id}.${String(issue.path?.[0]?.key ?? '')}`] = issue.message;
			}
			return fail(422, { fields, message: 'Some details need fixing.' });
		}

		const token = readAccess(cookies);
		try {
			await call(fetch, `/v1/admin/variants/${id}`, {
				method: 'PATCH',
				body: {
					sku: String(form.get('sku') ?? ''),
					title: String(form.get('title') ?? ''),
					price_minor: toMinor(parsed.output.price)
				},
				token
			});
			await call(fetch, `/v1/admin/variants/${id}/stock`, {
				method: 'PUT',
				body: { on_hand: parsed.output.on_hand },
				token
			});
		} catch (cause) {
			return failedCall(cause);
		}
		return { saved: 'variant' };
	},

	setStatus: async ({ request, fetch, cookies, params }) => {
		const form = await request.formData();
		try {
			await call(fetch, `/v1/admin/products/${params.id}/status`, {
				method: 'PUT',
				body: { status: String(form.get('status') ?? '') },
				token: readAccess(cookies)
			});
		} catch (cause) {
			return failedCall(cause);
		}
		return { saved: 'status' };
	},

	/* Two calls, deliberately: the upload stores a photograph the shop owns,
	   attaching puts it on this product. The same picture can hang on several. */
	addPhoto: async ({ request, fetch, cookies, params }) => {
		const form = await request.formData();
		const file = form.get('file');
		if (!(file instanceof File) || file.size === 0) {
			const fields: Record<string, string> = { file: 'Choose a photo to upload.' };
			return fail(422, { fields });
		}

		const token = readAccess(cookies);
		const upload = new FormData();
		upload.set('file', file);
		upload.set('alt_text', String(form.get('alt_text') ?? ''));

		try {
			const stored = await call<ProductImage>(fetch, '/v1/admin/media', {
				method: 'POST',
				upload,
				token
			});
			await call(fetch, `/v1/admin/products/${params.id}/media`, {
				method: 'POST',
				body: { media_id: stored.data.id, position: Number(form.get('position') ?? 0) },
				token
			});
		} catch (cause) {
			return failedCall(cause);
		}
		return { saved: 'photo' };
	},

	removePhoto: async ({ request, fetch, cookies, params }) => {
		const form = await request.formData();
		try {
			await call(fetch, `/v1/admin/products/${params.id}/media/${String(form.get('media_id'))}`, {
				method: 'DELETE',
				token: readAccess(cookies)
			});
		} catch (cause) {
			return failedCall(cause);
		}
		return { saved: 'photo' };
	}
};
