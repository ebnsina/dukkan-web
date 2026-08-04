<script lang="ts">
	import type { Snippet } from 'svelte';
	import { maskReveal, reveal, scramble } from '../motion';

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

<!-- Heading left, sub-copy right, one baseline: stacked, half the width sits
	empty and it reads like an article. -->
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
		<h2 class="text-mk-h2 {centered ? '' : 'lg:max-w-[26ch] lg:flex-[1.35]'}">
			<span use:maskReveal class="block overflow-hidden"><span>{heading}</span></span>
		</h2>

		{#if sub || aside}
			<div
				class="flex flex-col gap-6 {centered
					? 'items-center'
					: 'lg:max-w-[36ch] lg:flex-1 lg:items-end lg:pb-2'}"
			>
				{#if sub}
					<p
						use:reveal={80}
						class="text-[17px] {tone === 'dark' ? 'text-mk-cream/60' : 'text-mk-muted'}"
					>
						{sub}
					</p>
				{/if}
				{#if aside}
					<div use:reveal class="lg:self-end">{@render aside()}</div>
				{/if}
			</div>
		{/if}
	</div>

	{#if children}
		<div class={centered ? 'flex justify-center' : ''}>{@render children()}</div>
	{/if}
</div>
