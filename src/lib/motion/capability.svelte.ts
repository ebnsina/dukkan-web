import { browser } from '$app/environment';

export type MotionTier = 'none' | 'reduced' | 'full';

interface NetworkInformation {
	saveData?: boolean;
	effectiveType?: string;
}

/* Tiers: none (reduced-motion, data-saver, 2G), reduced (weak device or 3G), full. */
export function detectTier(): MotionTier {
	if (!browser) return 'none';

	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'none';

	const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
	if (connection?.saveData) return 'none';

	const effectiveType = connection?.effectiveType ?? '';
	if (effectiveType === 'slow-2g' || effectiveType === '2g') return 'none';

	const cores = navigator.hardwareConcurrency ?? 8;
	const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
	if (cores <= 4 || memory <= 4 || effectiveType === '3g') return 'reduced';

	return 'full';
}

export function isFinePointer(): boolean {
	return browser && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
}

class MotionState {
	tier = $state<MotionTier>('none');

	init() {
		this.tier = detectTier();
	}

	get animates() {
		return this.tier !== 'none';
	}

	get full() {
		return this.tier === 'full';
	}
}

export const motion = new MotionState();
