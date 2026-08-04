/* One lock for every overlay on the page.
 *
 * Two can overlap — a Confirm raised from inside a Drawer — and if each
 * restored scrolling on its own way out, the first to close would hand the
 * page back while the second was still covering it.
 *
 * It holds a set of open overlays rather than a count: a counter that is
 * decremented twice, or incremented without a matching release, drifts and
 * either leaves the page locked forever or unlocks it under a live modal.
 * Membership cannot drift — releasing twice is the same as releasing once.
 */
const open = new Set<symbol>();

function apply() {
	document.documentElement.style.overflow = open.size > 0 ? 'hidden' : '';
}

export function lockScroll(): () => void {
	const token = Symbol('overlay');
	open.add(token);
	apply();
	return () => {
		open.delete(token);
		apply();
	};
}
