import { fail, redirect } from '@sveltejs/kit';
import * as v from 'valibot';
import type { Actions, PageServerLoad } from './$types';
import { call, get } from '$lib/server/api';
import { readAccess } from '$lib/server/session';
import { fieldErrors, isApiError, toUserMessage } from '$lib/api/errors';
import { toMinor } from '$lib/utils/money';
import type { Category } from '$lib/api/types';
import type { AdminProduct } from '$lib/admin/types';

const VariantSchema = v.object({
	sku: v.pipe(v.string(), v.trim()),
	title: v.pipe(v.string(), v.trim()),
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

const ProductSchema = v.object({
	title: v.pipe(v.string(), v.trim(), v.minLength(2, 'Give the product a name.')),
	title_bn: v.pipe(v.string(), v.trim()),
	summary: v.pipe(v.string(), v.trim()),
	description: v.pipe(v.string(), v.trim())
});

export const load: PageServerLoad = async ({ fetch, cookies }) => {
	const reply = await get<{ categories: Category[] }>(fetch, '/v1/admin/categories', {
		token: readAccess(cookies)
	});
	return { categories: reply.categories ?? [] };
};

export const actions: Actions = {
	default: async ({ request, fetch, cookies }) => {
		const form = await request.formData();
		const values = {
			title: String(form.get('title') ?? ''),
			title_bn: String(form.get('title_bn') ?? ''),
			summary: String(form.get('summary') ?? ''),
			description: String(form.get('description') ?? ''),
			category_id: String(form.get('category_id') ?? '')
		};

		const rows = form.getAll('variant_price').map((_, index) => ({
			sku: String(form.getAll('variant_sku')[index] ?? ''),
			title: String(form.getAll('variant_title')[index] ?? ''),
			price: String(form.getAll('variant_price')[index] ?? ''),
			on_hand: String(form.getAll('variant_stock')[index] ?? '0')
		}));

		const product = v.safeParse(ProductSchema, values);
		const variants = rows.map((row) => v.safeParse(VariantSchema, row));

		if (!product.success || variants.some((r) => !r.success)) {
			const fields: Record<string, string> = {};
			if (!product.success) {
				for (const issue of product.issues) {
					fields[String(issue.path?.[0]?.key ?? '')] = issue.message;
				}
			}
			variants.forEach((result, index) => {
				if (result.success) return;
				for (const issue of result.issues) {
					fields[`variant.${index}.${String(issue.path?.[0]?.key ?? '')}`] = issue.message;
				}
			});
			return fail(422, { values, rows, fields, message: 'Some details need fixing.' });
		}

		let created: AdminProduct;
		try {
			const reply = await call<AdminProduct>(fetch, '/v1/admin/products', {
				method: 'POST',
				body: {
					title: product.output.title,
					title_bn: product.output.title_bn,
					summary: product.output.summary,
					description: product.output.description,
					category_id: values.category_id || null,
					brand_id: null,
					status: form.get('publish') === 'on' ? 'active' : 'draft',
					variants: variants.map((result) => {
						const row = result.output as v.InferOutput<typeof VariantSchema>;
						return {
							sku: row.sku,
							title: row.title,
							price_minor: toMinor(row.price),
							compare_at_minor: null,
							weight_grams: null,
							options: {},
							on_hand: row.on_hand,
							track: true,
							allow_backorder: false
						};
					})
				},
				token: readAccess(cookies)
			});
			created = reply.data;
		} catch (cause) {
			return fail(isApiError(cause) ? (cause.status ?? 500) : 500, {
				values,
				rows,
				fields: fieldErrors(cause),
				message: toUserMessage(cause)
			});
		}

		redirect(303, `/admin/products?created=${encodeURIComponent(created.title)}`);
	}
};
