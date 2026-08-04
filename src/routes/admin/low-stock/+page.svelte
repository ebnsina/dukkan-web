<script lang="ts">
	import Seo from '$lib/seo/Seo.svelte';
	import { Alert02Icon, PackageIcon } from '@hugeicons/core-free-icons';
	import { Chip, Empty, Frame } from '$lib/ui';
	import { stockTone } from '$lib/admin/state';
	import { formatNumber } from '$lib/utils/format';

	let { data } = $props();

	// Out is worse than low, and a shop owner wants the worst first.
	const items = $derived([...data.items].sort((a, b) => a.available - b.available));
	const out = $derived(items.filter((i) => i.available <= 0).length);
</script>

<Seo title="Running out" description="What to reorder." noindex />

<div class="dk-title-row">
	<div>
		<h1 class="dk-h1">Running out</h1>
		{#if items.length > 0}
			<p class="dk-date">
				{items.length === 1 ? 'One item needs' : 'Items needing'} attention{#if out > 0}, {formatNumber(
						out
					)} already out of stock{/if}.
			</p>
		{/if}
	</div>
</div>

<Frame eyebrow="Stock" variant="flush">
	{#if items.length === 0}
		<Empty
			title="Nothing is running low"
			description="Items appear here as they approach the level you set for them."
		/>
	{:else}
		<div class="dk-scroll">
			<table class="dk-table">
				<thead>
					<tr>
						<th scope="col">Item</th>
						<th scope="col">State</th>
						<th scope="col" data-numeric>Left</th>
						<th scope="col" data-numeric>Reorder at</th>
					</tr>
				</thead>
				<tbody>
					{#each items as item (item.variant_id)}
						<tr>
							<td>
								<span class="dk-strong">{item.title}</span>
								{#if item.variant_title || item.sku}
									<span class="dk-quiet"> · {item.variant_title ?? item.sku}</span>
								{/if}
							</td>
							<td>
								<Chip
									tone={stockTone(item.available, item.threshold)}
									label={item.available <= 0 ? 'Out of stock' : 'Running low'}
									icon={item.available <= 0 ? Alert02Icon : PackageIcon}
								/>
							</td>
							<td data-numeric>{formatNumber(item.available)}</td>
							<td data-numeric class="dk-quiet">{formatNumber(item.threshold)}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}

	{#snippet footer()}
		<span>{formatNumber(items.length)} listed, worst first</span>
	{/snippet}
</Frame>
