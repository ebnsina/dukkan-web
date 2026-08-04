<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		/** Small mono line above the title — what kind of thing this is. */
		eyebrow?: string;
		title?: string;
		/** Lime chip beside the title, for a status or a claim. */
		tag?: string;
		/** Sits on the header row, far right — a control or a value. */
		action?: Snippet;
		/** Replaces the eyebrow/title/tag group when the header is its own thing
		 * — browser chrome, for instance. Keeps the row's padding and `action`. */
		head?: Snippet;
		/** Sits on the shell below the panel — meta, totals, a caption. */
		footer?: Snippet;
		/** Dark surface instead of paper, for bands that sit on ink. */
		tone?: 'paper' | 'dark';
		/** Clip the panel so its contents can bleed past the edge. */
		clip?: boolean;
		/** Panel aspect ratio, e.g. '4/3'. Sizes the panel from its own width
		 * instead of a fixed height, so the screen keeps its shape at any width. */
		ratio?: string;
		/** Classes for the outer shell — sizing, margins. */
		class?: string;
		/** Classes for the inner panel — padding usually belongs here. */
		bodyClass?: string;
		children: Snippet;
	}

	let {
		eyebrow,
		title,
		tag,
		action,
		head,
		footer,
		tone = 'paper',
		clip = false,
		ratio,
		class: className = '',
		bodyClass = '',
		children
	}: Props = $props();

	let dark = $derived(tone === 'dark');
</script>

<!--
	Two layers: a grey shell carries the header and footer, and the paper panel
	sits inset by a 3px rail — so its radius is the shell's less the rail.
	Flat, no shadow.
-->
<div
	class="group/frame flex flex-col rounded-4xl p-[3px] {dark
		? 'bg-mk-dark-2'
		: 'bg-mk-shell'} {className}"
>
	{#if head || eyebrow || title || action}
		<div class="flex items-center justify-between gap-4 px-5 py-3.5">
			<div class="flex min-w-0 flex-1 items-center gap-3">
				{#if head}
					{@render head()}
				{:else}
					{#if eyebrow}
						<span
							class="font-mk-mono text-[10px] tracking-[0.16em] uppercase {dark
								? 'text-mk-cream/45'
								: 'text-mk-faint'}">{eyebrow}</span
						>
					{/if}
					{#if title}
						<span class="truncate mk-display text-[15px] {dark ? 'text-mk-cream' : 'text-mk-ink'}"
							>{title}</span
						>
					{/if}
					{#if tag}
						<span
							class="rounded-md bg-mk-brand px-2 py-[3px] font-mk-mono text-[9px] tracking-[0.14em] text-mk-on-brand uppercase"
							>{tag}</span
						>
					{/if}
				{/if}
			</div>
			{#if action}
				<div class="shrink-0">{@render action()}</div>
			{/if}
		</div>
	{/if}

	<div
		style={ratio ? `aspect-ratio:${ratio}` : undefined}
		class="min-h-0 rounded-[29px] border border-mk-ink/10 bg-mk-paper text-mk-ink {ratio
			? ''
			: 'flex-1'} {clip ? 'relative overflow-hidden' : ''} {bodyClass}"
	>
		{@render children()}
	</div>

	{#if footer}
		<div class="px-5 py-3.5">{@render footer()}</div>
	{/if}
</div>
