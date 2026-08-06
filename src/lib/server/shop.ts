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

/* Where a shop lives, as seen from where the visitor already is.
 *
 * The API names a shop's address but not the port it is served on, and in
 * development that is the whole difference between a working link and a
 * refused connection. Taking the scheme and port from this request means the
 * link is right in development and in production without either side having to
 * know about the other.
 */
export function storefrontUrl(slug: string, from: URL): string {
	const port = from.port ? `:${from.port}` : '';
	return `${from.protocol}//${slug}.${PUBLIC_SHOP_DOMAIN}${port}`;
}
