import { redirect } from '@sveltejs/kit';

/* The library used to live here and the foundations at /ds, which meant two
   addresses for one system. It is all at /ds now; this keeps old links and
   bookmarks working. */
export function load() {
	redirect(308, '/ds#buttons');
}
