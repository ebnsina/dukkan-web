<script lang="ts">
	import { onMount } from 'svelte';
	import { prefersReduced } from '$lib/marketing/motion';

	interface Props {
		/** Rendered behind the band as a watermark, so it never carries meaning. */
		class?: string;
	}

	let { class: className = '' }: Props = $props();

	// The same word in the three scripts the shop is named for.
	const words = ['Dukkàn', 'দোকান', 'دُكّان'];

	let index = $state(0);
	let display = $state(words[0]);

	/* The rhythm: a slow settle, then a long rest.
	 *
	 * This sits behind the last thing on the page, at 4% opacity, and it has to
	 * read as the word breathing between its three scripts. At 70ms a frame and
	 * a character every third, a word resolved in about a second and the noise
	 * flickered the whole time — closer to a loading glitch than to a breath.
	 * Slower steps and fewer of them per character make the same effect calm. */
	const STEP = 110;
	const FRAMES_PER_CHAR = 4;
	const HOLD = 5200;

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
			const settled = frame / FRAMES_PER_CHAR;
			display = chars.map((char, i) => (i < settled ? char : noise())).join('');
			if (settled < chars.length) timer = window.setTimeout(tick, STEP);
			else {
				display = word;
				onDone();
			}
		};

		timer = window.setTimeout(tick, STEP);
		return () => clearTimeout(timer);
	}

	onMount(() => {
		if (prefersReduced()) return;

		let cancelDecode: (() => void) | undefined;
		let hold = 0;

		const cycle = () => {
			index = (index + 1) % words.length;
			cancelDecode = decode(words[index], () => {
				hold = window.setTimeout(cycle, HOLD);
			});
		};

		hold = window.setTimeout(cycle, HOLD);

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
	<!--
		Sized so the widest of the three fits between the edges. The Arabic and
		the Bangla set much wider than the Latin at the same size, so a value
		picked against "Dukkàn" clipped the other two — and a watermark cut off
		at both ends reads as a layout fault rather than as a device.
	-->
	<span class="mk-display text-[clamp(96px,17vw,250px)] leading-none whitespace-nowrap"
		>{display}</span
	>
</span>
