/* Where a floating thing actually fits.
 *
 * A menu opened near the bottom of the window, or a tooltip on the last column
 * of a table, has to move rather than run off the edge — so this measures the
 * anchor and the panel and picks the side with room, then shifts the panel back
 * inside the viewport. Everything is positioned `fixed`, which also means an
 * overflow-hidden ancestor cannot clip it.
 */

export type Side = 'top' | 'bottom';
export type Align = 'start' | 'center' | 'end';

interface Options {
	/** Where it would go if there were room everywhere. */
	side?: Side;
	align?: Align;
	/** The space between the anchor and the panel. */
	gap?: number;
}

/** How close a panel may come to the edge of the window. */
const EDGE = 8;

export function place(anchor: HTMLElement, floating: HTMLElement, options: Options = {}): Side {
	const { side: preferred = 'bottom', align = 'start', gap = 6 } = options;

	const a = anchor.getBoundingClientRect();
	const f = floating.getBoundingClientRect();

	// Flip only when the other side has more room; a panel taller than both
	// stays where it was asked to go and scrolls.
	const below = window.innerHeight - a.bottom - gap - EDGE;
	const above = a.top - gap - EDGE;
	let side = preferred;
	if (preferred === 'bottom' && f.height > below && above > below) side = 'top';
	if (preferred === 'top' && f.height > above && below > above) side = 'bottom';

	const top = side === 'bottom' ? a.bottom + gap : a.top - gap - f.height;

	let left = a.left;
	if (align === 'end') left = a.right - f.width;
	if (align === 'center') left = a.left + a.width / 2 - f.width / 2;
	left = Math.min(Math.max(EDGE, left), Math.max(EDGE, window.innerWidth - f.width - EDGE));

	floating.style.position = 'fixed';
	floating.style.top = `${Math.round(top)}px`;
	floating.style.left = `${Math.round(left)}px`;
	floating.style.transformOrigin = `${side === 'bottom' ? 'top' : 'bottom'} ${
		align === 'center' ? 'center' : align === 'end' ? 'right' : 'left'
	}`;

	return side;
}

/* Keeps a panel on its anchor while the page moves under it. Scroll is
   captured, because the anchor may sit in any scrolling box, not just the
   window. Returns the teardown an effect wants. */
export function track(anchor: HTMLElement, floating: HTMLElement, options: Options = {}) {
	const update = () => place(anchor, floating, options);
	update();
	window.addEventListener('scroll', update, true);
	window.addEventListener('resize', update);
	return () => {
		window.removeEventListener('scroll', update, true);
		window.removeEventListener('resize', update);
	};
}
