<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		label: string;
		note?: string;
		flow?: 'row' | 'stack';
		children: Snippet;
	}

	let { label, note, flow = 'row', children }: Props = $props();
</script>

<div class="block">
	<div class="head">
		<h3 class="t-label">{label}</h3>
		{#if note}<p class="note">{note}</p>{/if}
	</div>
	<div class="body" class:is-row={flow === 'row'}>{@render children()}</div>
</div>

<style>
	.block + :global(.block) {
		margin-top: 56px;
	}

	.head {
		padding-bottom: 16px;
		border-bottom: 1px solid var(--rule);
	}

	h3 {
		color: var(--faint);
	}

	.note {
		margin-top: 8px;
		font-size: 13px;
		line-height: 1.5;
		color: var(--muted);
		max-width: 62ch;
	}

	.body {
		padding-top: 28px;
	}

	.is-row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 16px;
	}
</style>
