<script lang="ts">
	import type { Snippet } from 'svelte';
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
</script>

<!-- A failure interrupts; anything else is announced politely when the reader
     gets to it. -->
<p
	class="banner"
	data-tone={tone}
	role={tone === 'danger' ? 'alert' : 'status'}
	aria-live={tone === 'danger' ? 'assertive' : 'polite'}
>
	<span>
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
		gap: 12px;
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
