import { PUBLIC_SHOP_DOMAIN } from '$env/static/public';

/* Which shop an address belongs to.
 *
 * A subdomain of `PUBLIC_SHOP_DOMAIN` is that shop's; the bare domain is
 * nobody's, and so are signup and the landing page. This is the same rule the API applies to its own
 * Host header — `tenant.KeyFromHost` — deliberately, so a shop is identified one
 * way rather than two that have to agree forever.
 *
 * It lives outside `$lib/server` because the browser needs it too: a canonical
 * URL is rendered on both sides and has to name the same origin on each.
 */
export function shopFromHost(host: string): string {
	const name = host.replace(/:\d+$/, '').toLowerCase();
	const suffix = `.${PUBLIC_SHOP_DOMAIN.toLowerCase()}`;
	if (!name.endsWith(suffix)) return '';

	const slug = name.slice(0, -suffix.length);
	return slug && !slug.includes('.') ? slug : '';
}
