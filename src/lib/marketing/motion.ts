/* Each action toggles a `data-mk-*` attribute that layout.css styles, so only
   the trigger lives here. All land finished under reduced motion. */

import type { Action } from 'svelte/action';

export function prefersReduced(): boolean {
	return (
		typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
	);
}

function onceVisible(node: Element, run: () => void, threshold = 0.15) {
	const io = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (!entry.isIntersecting) continue;
				io.disconnect();
				run();
			}
		},
		{ threshold, rootMargin: '0px 0px -6% 0px' }
	);
	io.observe(node);
	return io;
}

/** Fade + rise into place the first time the element scrolls into view. */
export const reveal: Action<HTMLElement, number | undefined> = (node, delay = 0) => {
	if (prefersReduced()) return;

	node.dataset.mkReveal = 'out';
	if (delay) node.style.transitionDelay = `${delay}ms`;

	const io = onceVisible(node, () => (node.dataset.mkReveal = 'in'));
	return { destroy: () => io.disconnect() };
};

/** The hero's line mask, triggered on scroll instead of on load. */
export const maskReveal: Action<HTMLElement, number | undefined> = (node, delay = 0) => {
	if (prefersReduced()) return;

	node.dataset.mkLine = 'out';
	if (delay) node.style.transitionDelay = `${delay}ms`;

	const io = onceVisible(node, () => (node.dataset.mkLine = 'in'), 0.35);
	return { destroy: () => io.disconnect() };
};

/** Play the hero's three line masks, staggered, once the font has settled. */
export const lineMask: Action<HTMLElement, number | undefined> = (node, delay = 0) => {
	if (prefersReduced()) return;

	node.dataset.mkLine = 'out';
	const timer = setTimeout(() => (node.dataset.mkLine = 'in'), 90 + delay);
	return { destroy: () => clearTimeout(timer) };
};

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789·—';
const noise = () => GLYPHS[(Math.random() * GLYPHS.length) | 0];

/** Decode a kicker out of noise once it scrolls into view. */
export const scramble: Action<HTMLElement> = (node) => {
	const final = node.textContent ?? '';
	if (prefersReduced() || !final) return;

	let frame = 0;
	let raf = 0;
	node.textContent = final.replace(/\S/g, noise);

	const io = onceVisible(node, () => {
		const tick = () => {
			frame += 1;
			const settled = frame / 2;
			node.textContent = final
				.split('')
				.map((char, i) => (i < settled || char === ' ' ? char : noise()))
				.join('');
			if (settled < final.length) raf = requestAnimationFrame(tick);
			else node.textContent = final;
		};
		raf = requestAnimationFrame(tick);
	});

	return {
		destroy() {
			io.disconnect();
			cancelAnimationFrame(raf);
			node.textContent = final;
		}
	};
};

export interface CountUpOptions {
	to: number;
	decimals?: number;
	prefix?: string;
	suffix?: string;
	duration?: number;
}

const group = (value: number, decimals: number) =>
	value.toLocaleString('en-IN', {
		minimumFractionDigits: decimals,
		maximumFractionDigits: decimals
	});

/** Run a stat from zero to its real value when the band scrolls into view. */
export const countUp: Action<HTMLElement, CountUpOptions> = (node, options) => {
	const { to, decimals = 0, prefix = '', suffix = '', duration = 1600 } = options;
	const render = (value: number) => {
		node.textContent = `${prefix}${group(value, decimals)}${suffix}`;
	};

	if (prefersReduced()) {
		render(to);
		return;
	}

	let raf = 0;
	render(0);

	const io = onceVisible(node, () => {
		let start = 0;
		const step = (now: number) => {
			if (!start) start = now;
			const t = Math.min(1, (now - start) / duration);
			render(to * (1 - Math.pow(1 - t, 3)));
			if (t < 1) raf = requestAnimationFrame(step);
			else render(to);
		};
		raf = requestAnimationFrame(step);
	});

	return {
		destroy() {
			io.disconnect();
			cancelAnimationFrame(raf);
		}
	};
};
