import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getText } from '$lib/server/api';
import { shopFromHost } from '$lib/utils/host';

/* A crawler looks for `/sitemap.xml` at the shop's own address and nowhere
   else, so the shop's list is served from there rather than from an API path
   nobody would guess. The API builds it: only active products of approved
   sellers belong in it, which is a rule the storefront must not restate. */
export const GET: RequestHandler = async ({ fetch, url, setHeaders }) => {
	if (!shopFromHost(url.host)) error(404, 'Not found.');

	let body: string;
	try {
		body = await getText(fetch, '/v1/store/sitemap.xml');
	} catch {
		error(502, 'The sitemap could not be built.');
	}

	setHeaders({ 'Cache-Control': 'public, max-age=3600' });
	return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
