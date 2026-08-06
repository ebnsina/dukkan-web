import { toasts } from '$lib/ui';
import type { SubmitFunction } from '@sveltejs/kit';

/* One rule for telling a shop owner what happened.
 *
 * Something you just did says so in a toast, and the toast goes away. Something
 * about the state of your shop — you are behind on a bill, 64 districts have no
 * delivery charge — stays on the page as a banner until it stops being true.
 *
 * Before this, a page could report the same save twice: the sheet toasted and
 * the page also drew a green "Done" banner underneath. Two reports of one event
 * reads as two events.
 */
export function announce(saved: string): SubmitFunction {
	return () =>
		async ({ result, update }) => {
			await update({ reset: false });
			if (result.type === 'success' || result.type === 'redirect') {
				toasts.success(saved);
			} else if (result.type === 'failure') {
				const message = (result.data as { message?: string } | undefined)?.message;
				toasts.error(message ?? 'That did not work. Please try again.');
			}
		};
}
