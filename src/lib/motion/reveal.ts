import type { Attachment } from 'svelte/attachments';
import { detectTier, type MotionTier } from './capability.svelte';

type Gsap = typeof import('gsap').gsap;

let enginePromise: Promise<Gsap | null> | null = null;

/* GSAP is dynamically imported so it never lands in the entry chunk. */
export function loadEngine(): Promise<Gsap | null> {
	if (!enginePromise) {
		enginePromise = import('gsap').then((module) => module.gsap).catch(() => null);
	}
	return enginePromise;
}

function distance(tier: MotionTier): number {
	return tier === 'full' ? 22 : 10;
}

/* Content ships visible. Movement is added on top, never a `from` tween on
   something already painted, and never autoAlpha. */
export function reveal(options: { delay?: number; stagger?: number } = {}): Attachment {
	return (element) => {
		const tier = detectTier();
		if (tier === 'none') return;

		const targets = element.querySelectorAll<HTMLElement>('[data-reveal-item]');
		const nodes = targets.length > 0 ? Array.from(targets) : [element as HTMLElement];
		let cancelled = false;
		let cleanup: (() => void) | undefined;

		loadEngine().then((gsap) => {
			if (!gsap || cancelled) return;

			const observer = new IntersectionObserver(
				(entries) => {
					for (const entry of entries) {
						if (!entry.isIntersecting) continue;
						observer.unobserve(entry.target);
						gsap.fromTo(
							entry.target,
							{ opacity: 0, y: distance(tier) },
							{
								opacity: 1,
								y: 0,
								duration: tier === 'full' ? 0.8 : 0.5,
								ease: 'power3.out',
								delay: options.delay ?? 0,
								clearProps: 'transform,opacity'
							}
						);
					}
				},
				{ rootMargin: '0px 0px -12% 0px', threshold: 0.15 }
			);

			for (const node of nodes) {
				const rect = node.getBoundingClientRect();
				if (rect.top < window.innerHeight) continue;
				observer.observe(node);
			}
			cleanup = () => observer.disconnect();
		});

		return () => {
			cancelled = true;
			cleanup?.();
		};
	};
}

/* The page heading is the one thing that cannot be skipped, so its start state
   is written synchronously before paint and restored if the engine never answers. */
export function revealHeading(): Attachment {
	return (element) => {
		const tier = detectTier();
		if (tier === 'none') return;

		const node = element as HTMLElement;
		node.style.opacity = '0';
		node.style.transform = `translateY(${distance(tier)}px)`;
		node.style.willChange = 'opacity, transform';

		let settled = false;
		const restore = () => {
			if (settled) return;
			settled = true;
			node.style.opacity = '';
			node.style.transform = '';
			node.style.willChange = '';
		};

		const timeout = setTimeout(restore, 1200);

		loadEngine().then((gsap) => {
			if (settled) return;
			clearTimeout(timeout);
			if (!gsap) return restore();
			settled = true;
			gsap.to(node, {
				opacity: 1,
				y: 0,
				duration: tier === 'full' ? 0.9 : 0.5,
				ease: 'power3.out',
				clearProps: 'transform,opacity,willChange'
			});
		});

		return () => {
			clearTimeout(timeout);
			restore();
		};
	};
}
