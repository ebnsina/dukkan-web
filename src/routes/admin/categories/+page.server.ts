import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { call, get } from '$lib/server/api';
import { accessAfterParent, readAccess } from '$lib/server/session';
import { failedCall } from '$lib/server/form';
import type { Category } from '$lib/api/types';
import type { AdminProduct } from '$lib/admin/types';

export const load: PageServerLoad = async ({ fetch, cookies, parent }) => {
	const token = await accessAfterParent(parent, cookies);
	/* How many products sit in each category, because "delete" is the one
	   action here whose consequence a shop owner cannot see from the list. */
	const [categories, products] = await Promise.all([
		get<{ categories: Category[] }>(fetch, '/v1/admin/categories', { token }),
		get<{ products: AdminProduct[] }>(fetch, '/v1/admin/products', {
			token,
			query: { limit: 500 }
		}).catch(() => ({ products: [] as AdminProduct[] }))
	]);

	const counts: Record<string, number> = {};
	for (const p of products.products ?? []) {
		if (p.category_id) counts[p.category_id] = (counts[p.category_id] ?? 0) + 1;
	}

	return { categories: categories.categories ?? [], counts };
};

/* The name is the only required field. A slug is derived by the API — and
   `slug.Make` keeps a-z0-9 only, so a Bangla-only name yields nothing and the
   API falls back rather than transliterating somebody's word. */
function nameOf(form: FormData) {
	return String(form.get('name') ?? '').trim();
}

export const actions: Actions = {
	create: async ({ request, fetch, cookies }) => {
		const form = await request.formData();
		const name = nameOf(form);
		if (name.length < 2) {
			return fail(422, { message: 'Give the category a name.' });
		}

		try {
			await call(fetch, '/v1/admin/categories', {
				method: 'POST',
				body: {
					name,
					name_bn: String(form.get('name_bn') ?? '').trim(),
					parent_id: String(form.get('parent_id') ?? '') || null,
					position: Number(form.get('position') ?? 0) || 0,
					is_active: true
				},
				token: readAccess(cookies)
			});
		} catch (cause) {
			return failedCall(cause);
		}
		return { done: 'Added. It shows in your shop straight away.' };
	},

	update: async ({ request, fetch, cookies }) => {
		const form = await request.formData();
		const name = nameOf(form);
		if (name.length < 2) {
			return fail(422, { message: 'Give the category a name.' });
		}

		try {
			await call(fetch, `/v1/admin/categories/${String(form.get('id') ?? '')}`, {
				method: 'PUT',
				body: {
					name,
					name_bn: String(form.get('name_bn') ?? '').trim(),
					parent_id: String(form.get('parent_id') ?? '') || null,
					position: Number(form.get('position') ?? 0) || 0,
					is_active: form.get('is_active') === 'on'
				},
				token: readAccess(cookies)
			});
		} catch (cause) {
			return failedCall(cause);
		}
		return { done: 'Saved.' };
	},

	/* Deleting lifts any children to the top rather than taking them with it,
	   and products keep existing with no category. Nothing a shop sells is ever
	   removed by tidying up how it is filed. */
	remove: async ({ request, fetch, cookies }) => {
		const form = await request.formData();
		try {
			await call(fetch, `/v1/admin/categories/${String(form.get('id') ?? '')}`, {
				method: 'DELETE',
				token: readAccess(cookies)
			});
		} catch (cause) {
			return failedCall(cause);
		}
		return { done: 'Removed. Anything filed there is still in your shop.' };
	}
};
