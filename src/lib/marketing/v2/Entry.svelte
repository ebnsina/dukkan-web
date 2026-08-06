<script lang="ts">
	/* One entry in the book, and the only structural device on the page.
	 *
	 * The folio number is not decoration: this page is read top to bottom as a
	 * single day, each entry depending on the one above it, so the entries are
	 * genuinely numbered and the number is worth printing.
	 */
	import type { Snippet } from 'svelte';
	import { book } from './book.svelte';

	interface Props {
		folio: string;
		heading: string;
		/** The sentence under the heading. One, and it explains the heading. */
		sub?: string;
		id?: string;
		/** The stage this entry moves the tally to, if it moves it at all. */
		stage?: number;
		children: Snippet;
	}

	let { folio, heading, sub, id, stage, children }: Props = $props();

	/* Fires when the entry is properly on screen rather than at its first
	   pixel — the rail changing before the reason for it has been read is a
	   figure moving on its own. */
	function tally(node: HTMLElement) {
		if (stage === undefined) return;

		const io = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) if (entry.isIntersecting) book.reach(stage);
			},
			{ rootMargin: '-45% 0px -25% 0px' }
		);
		io.observe(node);
		return { destroy: () => io.disconnect() };
	}
</script>

<section {id} use:tally class="scroll-mt-24 border-t border-lg-rule py-lg-entry first:border-t-0">
	<div class="grid grid-cols-[clamp(38px,5vw,72px)_1fr]">
		<p class="lg-num pt-1 text-[13px] text-lg-faint">{folio}</p>

		<div class="min-w-0">
			<h2 class="max-w-[20ch] text-lg-head">{heading}</h2>
			{#if sub}
				<p class="mt-5 max-w-[54ch] text-lg-muted">{sub}</p>
			{/if}

			<div class="mt-10">
				{@render children()}
			</div>
		</div>
	</div>
</section>
