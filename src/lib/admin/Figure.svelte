<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Tone } from './state';

	interface Props {
		label: string;
		value: string;
		note?: string;
		tone?: Tone;
		href?: string;
		children?: Snippet;
	}

	let { label, value, note, tone = 'neutral', href, children }: Props = $props();
</script>

{#snippet body()}
	<span class="label t-label">{label}</span>
	<span class="value t-mono">{value}</span>
	{#if note}<span class="note">{note}</span>{/if}
	{#if children}{@render children()}{/if}
{/snippet}

<!-- A tile is neutral until its figure means something; then the left edge
     carries the state and the number takes the colour. -->
{#if href}
	<a class="tile" data-tone={tone} {href}>{@render body()}</a>
{:else}
	<div class="tile" data-tone={tone}>{@render body()}</div>
{/if}

<style>
	.tile {
		display: flex;
		flex-direction: column;
		gap: 12px;
		background: var(--paper);
		padding: 20px 22px;
		border-left: 3px solid transparent;
		color: var(--ink);
		text-decoration: none;
	}

	a.tile:hover {
		background: var(--surface);
	}

	.label {
		color: var(--faint);
	}

	.value {
		font-size: 30px;
		font-weight: 500;
		letter-spacing: -0.03em;
		font-variant-numeric: tabular-nums;
		line-height: 1;
	}

	.note {
		font-size: 12px;
		color: var(--muted);
	}

	.tile[data-tone='accent'] {
		border-left-color: var(--accent);
	}
	.tile[data-tone='accent'] .value {
		color: var(--accent);
	}

	.tile[data-tone='success'] {
		border-left-color: var(--success);
	}
	.tile[data-tone='success'] .value {
		color: var(--success);
	}

	.tile[data-tone='warning'] {
		border-left-color: var(--warning);
	}
	.tile[data-tone='warning'] .value {
		color: var(--warning);
	}

	.tile[data-tone='danger'] {
		border-left-color: var(--danger);
	}
	.tile[data-tone='danger'] .value {
		color: var(--danger);
	}

	.tile[data-tone='info'] {
		border-left-color: var(--info);
	}
	.tile[data-tone='info'] .value {
		color: var(--info);
	}
</style>
