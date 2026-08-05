import { PUBLIC_SHOP_DOMAIN } from '$env/static/public';

/* Which shop an address belongs to.
 *
 * `rahim.dukkan.store` is Rahim's shop; `dukkan.store` is nobody's, and so are
 * signup and the landing page. This is the same rule the API applies to its own
 * Host header — `tenant.KeyFromHost` — deliberately, so a shop is identified one
 * way rather than two that have to agree forever.
 */
export function shopFromHost(host: string): string {
	const name = host.replace(/:\d+$/, '').toLowerCase();
	const suffix = `.${PUBLIC_SHOP_DOMAIN.toLowerCase()}`;
	if (!name.endsWith(suffix)) return '';

	const slug = name.slice(0, -suffix.length);
	return slug && !slug.includes('.') ? slug : '';
}
