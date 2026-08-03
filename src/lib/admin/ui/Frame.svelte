<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		/** Mono label on the tint: what kind of thing this frame holds. */
		eyebrow?: string;
		/** What this particular one is. */
		title?: string;
		/** A link on the right of the header. */
		action?: string;
		actionHref?: string;
		/** How the panel treats its content. */
		variant?: 'list' | 'rows' | 'pad' | 'flush';
		/** A closing line on the tint, the way the header opens on it. */
		footer?: Snippet;
		children: Snippet;
	}

	let { eyebrow, title, action, actionHref, variant = 'list', footer, children }: Props = $props();

	const panel = $derived(variant === 'list' ? 'dk-panel' : `dk-panel dk-panel--${variant}`);

	// A landmark with no name is worse than no landmark, so the section takes
	// its name from whichever of the two labels it actually has.
	const id = $props.id();
	const headingId = $derived(title ? `${id}-title` : undefined);
	const label = $derived(title ? undefined : eyebrow);
</script>

<!-- Shell, then panel: the heading sits on the tint and the content on paper,
     inset by a 3px rail. -->
<section class="dk-frame" aria-labelledby={headingId} aria-label={label}>
	{#if eyebrow || title || action}
		<div class="dk-head">
			{#if eyebrow}<span class="dk-eyebrow">{eyebrow}</span>{/if}
			{#if title}<h2 class="dk-h2" id={headingId}>{title}</h2>{/if}
			{#if action}
				{#if actionHref}
					<!-- “View all” on its own tells a screen reader nothing about what
					     it opens, so the accessible name carries the frame's title. -->
					<a class="dk-view" href={actionHref} aria-label="{action}: {title ?? eyebrow}">
						{action}
					</a>
				{:else}
					<span class="dk-view is-plain">{action}</span>
				{/if}
			{/if}
		</div>
	{/if}
	<div class={panel}>{@render children()}</div>
	{#if footer}
		<div class="dk-frame-foot">{@render footer()}</div>
	{/if}
</section>
