import { PUBLIC_SHOP_DOMAIN } from '$env/static/public';

/* The rule itself lives in `$lib/utils/host` because the browser needs it as
   well. Re-exported here so server code keeps reading as it did. */
export { shopFromHost } from '$lib/utils/host';

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
