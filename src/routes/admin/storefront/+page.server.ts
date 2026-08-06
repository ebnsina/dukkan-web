import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { call, get } from '$lib/server/api';
import { accessAfterParent, readAccess } from '$lib/server/session';
import { failedCall } from '$lib/server/form';
import type { StorefrontPage, StorefrontSettings } from '$lib/api/types';

export const load: PageServerLoad = async ({ fetch, cookies, parent }) => {
	const token = await accessAfterParent(parent, cookies);
	const [settings, pages] = await Promise.all([
		get<StorefrontSettings>(fetch, '/v1/admin/storefront', { token }),
		// Drafts included: this is the shop looking at its own work.
		get<{ pages: StorefrontPage[] }>(fetch, '/v1/admin/storefront/pages', { token })
	]);

	return { settings, pages: pages.pages ?? [] };
};

export const actions: Actions = {
	front: async ({ request, fetch, cookies }) => {
		const form = await request.formData();
		const text = (name: string) => String(form.get(name) ?? '').trim();

		try {
			await call(fetch, '/v1/admin/storefront', {
				method: 'PUT',
				body: {
					notice: text('notice'),
					notice_enabled: form.get('notice_enabled') === 'on',
					headline: text('headline'),
					tagline: text('tagline'),
					hero_link_label: text('hero_link_label'),
					hero_link_href: text('hero_link_href'),
					about: text('about'),
					contact_phone: text('contact_phone'),
					contact_email: text('contact_email'),
					contact_address: text('contact_address'),
					facebook_url: text('facebook_url'),
					whatsapp_number: text('whatsapp_number')
				},
				token: readAccess(cookies)
			});
		} catch (cause) {
			return failedCall(cause, { section: 'front' });
		}
		return { section: 'front', done: 'Saved. Your shop shows it now.' };
	},

	/* A page is written by its address, so editing "returns" twice leaves one
	   page rather than two. The API keys the upsert the same way. */
	page: async ({ request, fetch, cookies }) => {
		const form = await request.formData();
		const title = String(form.get('title') ?? '').trim();
		if (!title) {
			return fail(422, {
				section: 'page',
				fields: { title: 'Give the page a name.' },
				message: 'Some details need fixing.'
			});
		}

		try {
			await call(fetch, '/v1/admin/storefront/pages', {
				method: 'PUT',
				body: {
					slug: String(form.get('slug') ?? '').trim(),
					title,
					body: String(form.get('body') ?? ''),
					is_published: form.get('is_published') === 'on',
					position: Number(form.get('position') ?? 0)
				},
				token: readAccess(cookies)
			});
		} catch (cause) {
			return failedCall(cause, { section: 'page' });
		}
		return { section: 'page', done: 'Saved.' };
	},

	removePage: async ({ request, fetch, cookies }) => {
		const form = await request.formData();
		try {
			await call(fetch, `/v1/admin/storefront/pages/${String(form.get('id') ?? '')}`, {
				method: 'DELETE',
				token: readAccess(cookies)
			});
		} catch (cause) {
			return failedCall(cause, { section: 'page' });
		}
		return { section: 'page', done: 'Taken off your shop.' };
	}
};
