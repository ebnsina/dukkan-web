import { fail } from '@sveltejs/kit';
import * as v from 'valibot';
import type { Actions, ServerLoadEvent } from '@sveltejs/kit';
import { call, get } from './api';
import { accessAfterParent, readAccess } from './session';
import { failedCall } from './form';
import { toMinor } from '$lib/utils/money';
import type { Category, ProductImage } from '$lib/api/types';
import type { AdminProduct } from '$lib/admin/types';

/* Managing a catalogue, for whoever owns it.
 *
 * The API mirrors every catalogue route across `/v1/admin` and `/v1/vendor` —
 * same shapes, same rules, different scope — because in a single shop the
 * owner *is* the seller and nothing should branch on that. The screens follow:
 * one implementation, told which prefix it is speaking to.
 *
 * Two copies would be two places to fix a validation message, and the seller's
 * copy is the one that would quietly fall behind.
 */
export type Surface = '/v1/admin' | '/v1/vendor';

/* Categories are the marketplace's, not a seller's, so there is no vendor
   endpoint for them and there should not be. The storefront's public list is
   the right source: it is exactly the set a product may be filed under. */
const categoriesPath = (api: Surface) =>
	api === '/v1/admin' ? '/v1/admin/categories' : '/v1/store/categories';

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

/** Field errors keyed the way the form reads them back. */
function issuesOf(issues: { path?: { key?: unknown }[]; message: string }[], prefix = '') {
	const fields: Record<string, string> = {};
	for (const issue of issues) {
		fields[`${prefix}${String(issue.path?.[0]?.key ?? '')}`] = issue.message;
	}
	return fields;
}

export interface ProductListData {
	products: AdminProduct[];
	categories: Category[];
	filters: { q: string; status: string };
}

/* Returned as a concrete shape rather than as `ServerLoad`, so SvelteKit still
   infers PageData for the page that exports it — the broad type erases it. */
export function productListLoad(api: Surface) {
	return async ({ fetch, cookies, url, parent }: ServerLoadEvent): Promise<ProductListData> => {
		const q = url.searchParams.get('q') ?? '';
		const status = url.searchParams.get('status') ?? '';
		const token = await accessAfterParent(parent, cookies);

		// The add sheet's category picker needs these, and the sheet is on this page.
		const [reply, categories] = await Promise.all([
			get<{ products: AdminProduct[] }>(fetch, `${api}/products`, {
				token,
				query: { q, status, limit: 100 }
			}),
			get<{ categories: Category[] }>(fetch, categoriesPath(api), { token })
		]);

		return {
			products: reply.products ?? [],
			categories: categories.categories ?? [],
			filters: { q, status }
		};
	};
}

export function productListActions(api: Surface): Actions {
	return {
		create: async ({ request, fetch, cookies }) => {
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

			const product = v.safeParse(DetailsSchema, values);
			const variants = rows.map((row) => v.safeParse(VariantSchema, row));

			if (!product.success || variants.some((r) => !r.success)) {
				let fields: Record<string, string> = product.success ? {} : issuesOf(product.issues);
				variants.forEach((result, index) => {
					if (result.success) return;
					fields = { ...fields, ...issuesOf(result.issues, `variant.${index}.`) };
				});
				return fail(422, { values, rows, fields, message: 'Some details need fixing.' });
			}

			let created: AdminProduct;
			try {
				const reply = await call<AdminProduct>(fetch, `${api}/products`, {
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
				return failedCall(cause, { values, rows });
			}

			return { created: created.title };
		},

		setStatus: async ({ request, fetch, cookies }) => {
			const form = await request.formData();
			try {
				await call(fetch, `${api}/products/${String(form.get('id') ?? '')}/status`, {
					method: 'PUT',
					body: { status: String(form.get('status') ?? '') },
					token: readAccess(cookies)
				});
			} catch (cause) {
				return failedCall(cause);
			}
			return { done: true };
		}
	};
}

export interface ProductDetailData {
	product: AdminProduct & { images?: ProductImage[] };
	categories: Category[];
}

export function productDetailLoad(api: Surface) {
	return async ({
		fetch,
		cookies,
		params,
		parent
	}: ServerLoadEvent): Promise<ProductDetailData> => {
		const token = await accessAfterParent(parent, cookies);
		const [product, categories] = await Promise.all([
			get<AdminProduct & { images?: ProductImage[] }>(fetch, `${api}/products/${params.id}`, {
				token
			}),
			get<{ categories: Category[] }>(fetch, categoriesPath(api), { token })
		]);
		return { product, categories: categories.categories ?? [] };
	};
}

export function productDetailActions(api: Surface): Actions {
	return {
		/* Wording only. A price is a separate decision from a spelling mistake,
		   and the API splits them the same way. */
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
				return fail(422, {
					values,
					fields: issuesOf(parsed.issues),
					message: 'Some details need fixing.'
				});
			}

			try {
				await call(fetch, `${api}/products/${params.id}`, {
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
		   delta because this form shows the number being replaced. */
		variant: async ({ request, fetch, cookies }) => {
			const form = await request.formData();
			const id = String(form.get('variant_id') ?? '');
			const values = {
				price: String(form.get('price') ?? ''),
				on_hand: String(form.get('on_hand') ?? '0')
			};

			const parsed = v.safeParse(PriceSchema, values);
			if (!parsed.success) {
				return fail(422, {
					fields: issuesOf(parsed.issues, `variant.${id}.`),
					message: 'Some details need fixing.'
				});
			}

			const token = readAccess(cookies);
			try {
				await call(fetch, `${api}/variants/${id}`, {
					method: 'PATCH',
					body: {
						sku: String(form.get('sku') ?? ''),
						title: String(form.get('title') ?? ''),
						price_minor: toMinor(parsed.output.price)
					},
					token
				});
				await call(fetch, `${api}/variants/${id}/stock`, {
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
				await call(fetch, `${api}/products/${params.id}/status`, {
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
		   attaching puts it on this product. The same picture can hang on
		   several. */
		addPhoto: async ({ request, fetch, cookies, params }) => {
			const form = await request.formData();
			const file = form.get('file');
			if (!(file instanceof File) || file.size === 0) {
				return fail(422, { fields: { file: 'Choose a photo to upload.' } });
			}

			const token = readAccess(cookies);
			const upload = new FormData();
			upload.set('file', file);
			upload.set('alt_text', String(form.get('alt_text') ?? ''));

			try {
				const stored = await call<ProductImage>(fetch, `${api}/media`, {
					method: 'POST',
					upload,
					token
				});
				await call(fetch, `${api}/products/${params.id}/media`, {
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
				await call(fetch, `${api}/products/${params.id}/media/${String(form.get('media_id'))}`, {
					method: 'DELETE',
					token: readAccess(cookies)
				});
			} catch (cause) {
				return failedCall(cause);
			}
			return { saved: 'photo' };
		}
	};
}
