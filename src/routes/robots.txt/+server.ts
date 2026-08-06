import type { RequestHandler } from './$types';
import { shopFromHost } from '$lib/utils/host';

/* Written per host rather than kept in `static/`, because the sitemap line has
   to name the shop's own address — one file served to every shop would send
   every crawler to the same one.
 *
 * The admin and a shopper's own account carry `noindex` already; they are
 * disallowed here too so a crawler does not spend a shop's bandwidth fetching
 * pages it will then be told to drop. */
export const GET: RequestHandler = ({ url, setHeaders }) => {
	const shop = shopFromHost(url.host);

	const lines = ['User-agent: *', 'Disallow: /admin', 'Disallow: /account', 'Disallow: /checkout'];
	if (shop) {
		lines.push('Disallow: /cart', '', `Sitemap: ${url.origin}/sitemap.xml`);
	} else {
		lines.push('Disallow: /signup', '');
	}

	setHeaders({ 'Cache-Control': 'public, max-age=86400' });
	return new Response(lines.join('\n') + '\n', {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' }
	});
};
