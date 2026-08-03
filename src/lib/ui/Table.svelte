<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		caption?: string;
		children: Snippet;
	}

	let { caption, children }: Props = $props();
</script>

<div class="scroll">
	<table>
		{#if caption}<caption class="t-label">{caption}</caption>{/if}
		{@render children()}
	</table>
</div>

<style>
	.scroll {
		width: 100%;
		overflow-x: auto;
	}

	table {
		width: 100%;
		border-collapse: collapse;
	}

	caption {
		text-align: left;
		color: var(--faint);
		padding-bottom: 14px;
	}

	table :global(th) {
		padding: 10px 16px 10px 0;
		text-align: left;
		font-family: var(--font-mono);
		font-size: 10.5px;
		font-weight: 400;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--faint);
		border-bottom: 1px solid var(--rule-strong);
		white-space: nowrap;
	}

	table :global(td) {
		padding: 16px 16px 16px 0;
		font-size: 14px;
		color: var(--muted);
		border-bottom: 1px solid var(--rule);
		vertical-align: middle;
	}

	table :global(tbody tr:last-child td) {
		border-bottom: none;
	}

	/* Anything that lines up in a column gets mono and tabular figures. */
	table :global(th[data-numeric]),
	table :global(td[data-numeric]) {
		text-align: right;
		padding-right: 0;
		font-family: var(--font-mono);
		font-variant-numeric: tabular-nums;
		font-feature-settings: 'zero' 1;
		color: var(--ink);
	}
</style>
