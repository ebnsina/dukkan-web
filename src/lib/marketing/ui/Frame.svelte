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
		class: className = '',
		bodyClass = '',
		children
	}: Props = $props();

	let dark = $derived(tone === 'dark');
</script>

<!--
	Two layers, not one box: a tinted shell carries the header and footer, and
	the content sits in its own panel inset by a 3px rail of that shell — a
	single pixel reads as a rendering artefact rather than a deliberate inset.
	The panel is always paper, whatever the shell's tone, so the inset is legible
	on both. The shell grey is a solid warm neutral rather than ink at low alpha:
	ink is a green-black, and tinting it lands on a cold grey that fights the
	lime. No radius, no shadow.
-->
<div class="group/frame flex flex-col p-[3px] {dark ? 'bg-mk-dark-2' : 'bg-mk-shell'} {className}">
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
							class="bg-mk-lime px-2 py-[3px] font-mk-mono text-[9px] tracking-[0.14em] text-mk-ink uppercase"
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
		class="min-h-0 flex-1 border border-mk-ink/10 bg-mk-paper text-mk-ink {clip
			? 'relative overflow-hidden'
			: ''} {bodyClass}"
	>
		{@render children()}
	</div>

	{#if footer}
		<div class="px-5 py-3.5">{@render footer()}</div>
	{/if}
</div>
