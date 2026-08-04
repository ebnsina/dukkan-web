<script lang="ts">
	/* Shell, then panel: the heading sits on a tint and the content on paper,
	   inset by a 3px rail. The admin and the marketing site had this twice under
	   the same name; it is one component now, and a surface adjusts it with
	   `class` and `bodyClass` rather than by forking it. */
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';

	interface Props {
		/** Mono label on the tint: what kind of thing this frame holds. */
		eyebrow?: string;
		/** What this particular one is. */
		title?: string;
		/** A link or a value on the right of the header. */
		action?: string;
		actionHref?: string;
		/** Replaces the eyebrow/title group when the header is its own thing. */
		head?: Snippet;
		/** Sits on the tint below the panel — meta, totals, a caption. */
		footer?: Snippet;
		/** How the panel treats its content. */
		variant?: 'list' | 'rows' | 'pad' | 'flush';
		/** Dark shell, for a frame sitting on ink. */
		tone?: 'paper' | 'dark';
		/** Panel aspect ratio, e.g. '4/3', so it keeps its shape at any width. */
		ratio?: string;
		class?: string;
		bodyClass?: string;
		children: Snippet;
	}

	let {
		eyebrow,
		title,
		action,
		actionHref,
		head,
		footer,
		variant = 'list',
		tone = 'paper',
		ratio,
		class: className,
		bodyClass,
		children
	}: Props = $props();

	// A landmark with no name is worse than no landmark, so the section takes
	// its name from whichever label it actually has.
	const id = $props.id();
	const headingId = $derived(title ? `${id}-title` : undefined);
	const label = $derived(title ? undefined : eyebrow);
</script>

<section
	class={cn('frame', tone === 'dark' && 'is-dark', className)}
	aria-labelledby={headingId}
	aria-label={label}
>
	{#if head || eyebrow || title || action}
		<div class="head">
			{#if head}
				{@render head()}
			{:else}
				{#if eyebrow}<span class="eyebrow">{eyebrow}</span>{/if}
				{#if title}<h2 class="title" id={headingId}>{title}</h2>{/if}
			{/if}
			{#if action}
				{#if actionHref}
					<!-- "View all" alone tells a screen reader nothing about what it
					     opens, so the accessible name carries the frame's title. -->
					<a class="action" href={actionHref} aria-label="{action}: {title ?? eyebrow}">
						{action}
					</a>
				{:else}
					<span class="action is-plain">{action}</span>
				{/if}
			{/if}
		</div>
	{/if}

	<div
		class={cn('panel', `panel-${variant}`, bodyClass)}
		style={ratio ? `aspect-ratio:${ratio}` : undefined}
	>
		{@render children()}
	</div>

	{#if footer}
		<div class="foot">{@render footer()}</div>
	{/if}
</section>

<style>
	.frame {
		display: flex;
		flex-direction: column;
		padding: 3px;
		background: var(--surface);
		border-radius: var(--r-card);
	}

	.is-dark {
		background: var(--inverse-paper);
	}

	.head {
		display: flex;
		align-items: baseline;
		gap: 12px;
		padding: 11px 14px 12px;
	}

	.eyebrow {
		font-family: var(--font-mono);
		font-size: 11px;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--faint);
	}

	.title {
		margin: 0;
		font-size: 15px;
		font-weight: 650;
	}

	.action {
		margin-left: auto;
		font-size: 13px;
		color: var(--muted);
		text-decoration: none;
	}

	a.action:hover {
		color: var(--accent);
	}

	.is-plain {
		color: var(--faint);
	}

	/* The panel fills its frame and its children share the height, so a frame
	   never shows a band of bare paper under a short list. */
	.panel {
		display: flex;
		flex: 1;
		flex-direction: column;
		min-height: 0;
		padding: 10px;
		background: var(--paper);
		border-radius: var(--r-panel);
	}

	.panel > :global(*) {
		flex: 1;
	}

	/* Prose and stacks of their own keep their natural height. */
	.panel-pad > :global(*),
	.panel-flush > :global(*) {
		flex: none;
	}

	.panel-pad {
		justify-content: center;
		padding: 20px;
	}

	.panel-rows {
		padding: 6px;
	}

	.panel-flush {
		padding: 6px;
	}

	.foot {
		display: flex;
		align-items: baseline;
		gap: 12px;
		padding: 10px 14px 9px;
		font-size: 13px;
		color: var(--faint);
	}
</style>
