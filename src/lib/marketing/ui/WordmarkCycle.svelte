<script lang="ts">
	import { onMount } from 'svelte';
	import { prefersReduced } from '../motion';

	interface Props {
		/** Rendered behind the band as a watermark, so it never carries meaning. */
		class?: string;
	}

	let { class: className = '' }: Props = $props();

	// The same word in the three scripts the shop is named for.
	const words = ['Dukkàn', 'দোকান', 'دُكّان'];

	let index = $state(0);
	let display = $state(words[0]);

	/* Scrambled from its own glyphs: Latin noise in front of Bangla reads as a
	   rendering bug rather than an effect. */
	function decode(word: string, onDone: () => void) {
		const glyphs = [...new Set([...word.replace(/\s/g, '')])];
		const noise = () => glyphs[(Math.random() * glyphs.length) | 0];
		const chars = [...word];
		let frame = 0;
		let timer = 0;

		// Stepped on a timer rather than rAF: a background tab freezes rAF, and a
		// half-decoded watermark that never resolves is worse than a slow one.
		const tick = () => {
			frame += 1;
			const settled = frame / 3;
			display = chars.map((char, i) => (i < settled ? char : noise())).join('');
			if (settled < chars.length) timer = window.setTimeout(tick, 70);
			else {
				display = word;
				onDone();
			}
		};

		timer = window.setTimeout(tick, 70);
		return () => clearTimeout(timer);
	}

	onMount(() => {
		if (prefersReduced()) return;

		let cancelDecode: (() => void) | undefined;
		let hold = 0;

		const cycle = () => {
			index = (index + 1) % words.length;
			cancelDecode = decode(words[index], () => {
				hold = window.setTimeout(cycle, 3600);
			});
		};

		hold = window.setTimeout(cycle, 3600);

		return () => {
			clearTimeout(hold);
			cancelDecode?.();
		};
	});
</script>

<span
	aria-hidden="true"
	class="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden select-none {className}"
>
	<span class="mk-display text-[clamp(160px,26vw,380px)] leading-none whitespace-nowrap"
		>{display}</span
	>
</span>
