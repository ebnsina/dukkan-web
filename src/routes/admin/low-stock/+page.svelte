<script lang="ts">
	import Seo from '$lib/seo/Seo.svelte';
	import { Empty, Table } from '$lib/ui';
	import StateChip from '$lib/admin/StateChip.svelte';
	import { stockTone } from '$lib/admin/state';
	import { formatNumber } from '$lib/utils/format';

	let { data } = $props();

	// Out is worse than low, and a shop owner wants the worst first.
	const items = $derived([...data.items].sort((a, b) => a.available - b.available));
	const out = $derived(items.filter((i) => i.available <= 0).length);
</script>

<Seo title="Running out" description="What to reorder." noindex />

<div class="head">
	<h1 class="t-heading">Running out</h1>
	{#if items.length > 0}
		<p class="lead">
			{formatNumber(items.length)}
			{items.length === 1 ? 'item needs' : 'items need'} attention{#if out > 0}, {formatNumber(out)}
				already out of stock{/if}.
		</p>
	{/if}
</div>

{#if items.length === 0}
	<Empty
		title="Nothing is running low"
		description="Items appear here as they approach the level you set for them."
	/>
{:else}
	<Table>
		<thead>
			<tr>
				<th scope="col"></th>
				<th scope="col">Item</th>
				<th scope="col" data-numeric>Left</th>
				<th scope="col" data-numeric>Reorder at</th>
			</tr>
		</thead>
		<tbody>
			{#each items as item (item.variant_id)}
				<tr>
					<td>
						<StateChip
							tone={stockTone(item.available, item.threshold)}
							label={item.available <= 0 ? 'Out' : 'Low'}
						/>
					</td>
					<td>
						<span class="title">{item.title}</span>
						{#if item.variant_title || item.sku}
							<span class="quiet">· {item.variant_title ?? item.sku}</span>
						{/if}
					</td>
					<td data-numeric class="count">{formatNumber(item.available)}</td>
					<td data-numeric class="quiet">{formatNumber(item.threshold)}</td>
				</tr>
			{/each}
		</tbody>
	</Table>
{/if}

<style>
	.head {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 16px;
	}

	.lead {
		font-size: 14px;
		color: var(--muted);
	}

	.title {
		color: var(--ink);
	}

	.quiet {
		color: var(--faint);
	}

	.count {
		font-variant-numeric: tabular-nums;
		color: var(--ink);
	}
</style>
