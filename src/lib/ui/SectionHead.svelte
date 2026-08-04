<script lang="ts">
	import type { Snippet } from 'svelte';
	import { maskReveal, reveal, scramble } from '$lib/marketing/motion';

	interface Props {
		kicker: string;
		heading: string;
		sub?: string;
		tone?: 'light' | 'dark';
		/** Centres the block — used where the section itself is a centred column. */
		centered?: boolean;
		/** Sits on the baseline of the heading, right-aligned — e.g. carousel arrows. */
		aside?: Snippet;
		/** Sits under the sub-copy — e.g. filter chips, billing toggle. */
		children?: Snippet;
	}

	let { kicker, heading, sub, tone = 'light', centered = false, aside, children }: Props = $props();
</script>

<!-- Kicker, heading, then the sub-copy under it. Set beside the heading the
	sub-copy read as a second, competing column; under it, it is what it is —
	the sentence that explains the line above. -->
<div class="mb-14 {centered ? 'text-center' : ''}">
	<p
		use:reveal
		use:scramble
		class="mb-5 block mk-kicker {tone === 'dark' ? 'text-mk-brand-lift' : 'text-mk-brand-type'}"
	>
		{kicker}
	</p>

	<div
		class="flex flex-col gap-6 {centered
			? 'items-center'
			: 'lg:flex-row lg:items-end lg:justify-between lg:gap-16'}"
	>
		<h2 class="text-mk-h2 {centered ? '' : 'lg:max-w-[24ch]'}">
			<span use:maskReveal class="block overflow-hidden"><span>{heading}</span></span>
		</h2>

		{#if aside}
			<div use:reveal class="lg:shrink-0 lg:self-end">{@render aside()}</div>
		{/if}
	</div>

	{#if sub}
		<p
			use:reveal={80}
			class="mt-6 max-w-[58ch] text-[17px] {centered ? 'mx-auto' : ''} {tone === 'dark'
				? 'text-mk-cream/60'
				: 'text-mk-muted'}"
		>
			{sub}
		</p>
	{/if}

	{#if children}
		<div class={centered ? 'flex justify-center' : ''}>{@render children()}</div>
	{/if}
</div>
