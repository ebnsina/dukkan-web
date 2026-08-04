<script lang="ts">
	import type { Tone } from '$lib/admin/state';

	interface Props {
		label: string;
		value: string;
		sub?: string;
		/** A figure only takes a colour when it means something. */
		tone?: Tone;
		href?: string;
	}

	let { label, value, sub, tone = 'neutral', href }: Props = $props();

	// Read aloud, the three parts are one sentence rather than three orphans.
	const spoken = $derived([label, value, sub].filter(Boolean).join(', '));
</script>

{#snippet inner()}
	<div class="stat-head"><span class="stat-label" aria-hidden="true">{label}</span></div>
	<div class="stat-panel">
		<span class="stat-value" data-tone={tone} aria-hidden="true">{value}</span>
	</div>
	<!-- The line under the figure belongs to the tint, the way the label does. -->
	{#if sub}<div class="stat-foot" aria-hidden="true">{sub}</div>{/if}
{/snippet}

{#if href}
	<a class="stat" {href} aria-label={spoken}>{@render inner()}</a>
{:else}
	<div class="stat" role="group" aria-label={spoken}>{@render inner()}</div>
{/if}

<style>
	.stat {
		display: flex;
		flex-direction: column;
		padding: 3px;
		background: var(--surface);
		border-radius: var(--r-card);
		color: inherit;
		text-decoration: none;
	}

	.stat-head {
		padding: 11px 14px 12px;
	}

	.stat-label {
		font-family: var(--font-mono);
		font-size: 11px;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--faint);
	}

	/* The figure sits centred, so a card stretched to match a taller neighbour
	   still reads as one block. */
	.stat-panel {
		display: flex;
		flex: 1;
		flex-direction: column;
		justify-content: center;
		padding: 16px;
		background: var(--paper);
		border-radius: var(--r-panel);
	}

	.stat-value {
		display: block;
		font-size: 25px;
		font-weight: 650;
		letter-spacing: -0.02em;
		font-variant-numeric: tabular-nums;
	}

	.stat-value[data-tone='accent'] {
		color: var(--accent);
	}
	.stat-value[data-tone='success'] {
		color: var(--success);
	}
	.stat-value[data-tone='warning'] {
		color: var(--warning);
	}
	.stat-value[data-tone='danger'] {
		color: var(--danger);
	}
	.stat-value[data-tone='info'] {
		color: var(--info);
	}

	/* The line under the figure belongs to the tint, the way the label does. */
	.stat-foot {
		padding: 10px 14px 9px;
		font-size: 13px;
		color: var(--faint);
	}
</style>
