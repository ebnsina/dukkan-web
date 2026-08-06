<script lang="ts">
	import type { Snippet } from 'svelte';
	import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/svelte';
	import {
		Alert02Icon,
		CheckmarkCircle02Icon,
		InformationCircleIcon
	} from '@hugeicons/core-free-icons';
	import type { Tone } from '$lib/admin/state';

	interface Props {
		title?: string;
		tone?: Tone;
		children?: Snippet;
		actions?: Snippet;
		/** Shows a close control; the caller decides what dismissing means. */
		dismissible?: boolean;
		ondismiss?: () => void;
	}

	let {
		title,
		tone = 'neutral',
		children,
		actions,
		dismissible = false,
		ondismiss
	}: Props = $props();

	// Shape as well as colour, so the kind of news is legible without hue.
	const glyphs: Record<Tone, IconSvgElement> = {
		neutral: InformationCircleIcon,
		accent: InformationCircleIcon,
		info: InformationCircleIcon,
		success: CheckmarkCircle02Icon,
		warning: Alert02Icon,
		danger: Alert02Icon
	};
</script>

<!-- A failure interrupts; anything else is announced politely when the reader
     gets to it. -->
<p
	class="banner"
	data-tone={tone}
	role={tone === 'danger' ? 'alert' : 'status'}
	aria-live={tone === 'danger' ? 'assertive' : 'polite'}
>
	<span class="banner-glyph" aria-hidden="true">
		<HugeiconsIcon icon={glyphs[tone]} size={17} strokeWidth={1.8} />
	</span>
	<span class="banner-body">
		{#if title}<span class="banner-title">{title}</span>{/if}
		{#if children}{@render children()}{/if}
		{#if actions}<span class="banner-acts">{@render actions()}</span>{/if}
	</span>
	{#if dismissible}
		<button type="button" class="banner-close" onclick={ondismiss} aria-label="Dismiss"
			>&times;</button
		>
	{/if}
</p>

<style>
	.banner {
		display: flex;
		align-items: flex-start;
		gap: 11px;
		margin: 0;
		padding: 14px 16px;
		border-radius: var(--r-panel);
		background: var(--surface);
		color: var(--muted);
		font-size: 13.5px;
		line-height: 1.6;
	}

	.banner[data-tone='accent'] {
		background: var(--accent-soft);
		color: var(--accent);
	}
	.banner[data-tone='success'] {
		background: var(--success-soft);
		color: var(--success);
	}
	.banner[data-tone='warning'] {
		background: var(--warning-soft);
		color: var(--warning);
	}
	.banner[data-tone='danger'] {
		background: var(--danger-soft);
		color: var(--danger);
	}
	.banner[data-tone='info'] {
		background: var(--info-soft);
		color: var(--info);
	}

	/* Sits on the first line's optical centre rather than its top edge. */
	.banner-glyph {
		display: grid;
		place-items: center;
		flex: none;
		margin-top: 2px;
		color: inherit;
	}

	.banner-body {
		flex: 1;
		min-width: 0;
	}

	.banner-title {
		display: block;
		font-weight: 650;
		color: inherit;
	}

	.banner-acts {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		margin-top: 12px;
	}

	/* A button inside a toned banner borrows the banner's colour. Left to its
	   own outline it drew a grey box on a red ground and read as something that
	   had landed there by accident rather than as the way out of the problem. */
	.banner[data-tone] .banner-acts :global(button),
	.banner[data-tone] .banner-acts :global(a) {
		border-color: currentColor;
		color: inherit;
		background: transparent;
	}

	.banner[data-tone] .banner-acts :global(button:hover),
	.banner[data-tone] .banner-acts :global(a:hover) {
		background: currentColor;
	}

	/* The label has to flip against the filled ground on hover; `color-mix`
	   keeps it legible whichever tone the banner is. */
	.banner[data-tone] .banner-acts :global(button:hover) :global(*),
	.banner[data-tone] .banner-acts :global(a:hover) :global(*) {
		color: var(--surface);
	}

	.banner-close {
		margin-left: auto;
		padding: 0 4px;
		border: 0;
		background: none;
		color: inherit;
		font-size: 18px;
		line-height: 1;
		cursor: pointer;
		opacity: 0.6;
	}

	.banner-close:hover {
		opacity: 1;
	}
</style>
