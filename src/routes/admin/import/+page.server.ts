import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { call } from '$lib/server/api';
import { readAccess } from '$lib/server/session';
import { failedCall } from '$lib/server/form';
import type { ImportOutcome, ImportPreview } from '$lib/admin/types';

/* The file is sent twice — once to look, once to commit — rather than parked
   on the server between the two. Holding somebody's catalogue in a cache keyed
   by a token is a thing that expires in the middle of a decision, and a second
   upload of a file already on their disk is cheaper than the machinery to
   avoid it. */
async function forward<T>(fetcher: typeof fetch, path: string, file: File, token: string | null) {
	const upload = new FormData();
	upload.set('file', file);
	const reply = await call<T>(fetcher, path, { method: 'POST', upload, token });
	return reply.data;
}

export const actions: Actions = {
	preview: async ({ request, fetch, cookies }) => {
		const form = await request.formData();
		const file = form.get('file');
		if (!(file instanceof File) || file.size === 0) {
			return fail(422, { fields: { file: 'Choose the file you exported.' } });
		}

		try {
			const preview = await forward<ImportPreview>(
				fetch,
				'/v1/admin/import/preview',
				file,
				readAccess(cookies)
			);
			return { preview, filename: file.name };
		} catch (cause) {
			return failedCall(cause);
		}
	},

	commit: async ({ request, fetch, cookies }) => {
		const form = await request.formData();
		const file = form.get('file');
		if (!(file instanceof File) || file.size === 0) {
			return fail(422, { fields: { file: 'Choose the file again to bring it over.' } });
		}

		try {
			const outcome = await forward<ImportOutcome>(
				fetch,
				'/v1/admin/import',
				file,
				readAccess(cookies)
			);
			return { outcome };
		} catch (cause) {
			return failedCall(cause);
		}
	}
};
