<script lang="ts">
	import Seo from '$lib/seo/Seo.svelte';
	import { Alert02Icon, PackageIcon } from '@hugeicons/core-free-icons';
	import { Chip } from '$lib/ui';
	import DataTable from '$lib/admin/DataTable.svelte';
	import PageTop from '$lib/admin/PageTop.svelte';
	import RowActions from '$lib/admin/RowActions.svelte';
	import { stockTone } from '$lib/admin/state';
	import { formatNumber } from '$lib/utils/format';

	let { data } = $props();

	// Out is worse than low, and a shop owner wants the worst first.
	const items = $derived([...data.items].sort((a, b) => a.available - b.available));
</script>

<Seo title="Running out" description="What to reorder." noindex />

<PageTop trail={[{ label: 'Running out' }]} />

<DataTable
	rows={items}
	noun="item"
	emptyTitle="Nothing is running low"
	emptyBody="Items appear here as they approach the level you set for them."
>
	{#snippet head()}
		<th scope="col">Item</th>
		<th scope="col">State</th>
		<th scope="col" data-numeric>Left</th>
		<th scope="col" data-numeric>Reorder at</th>
		<th scope="col"><span class="sr-only">Actions</span></th>
	{/snippet}

	{#snippet row(item)}
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
			<td class="right">
				<RowActions
					label={item.title}
					items={[
						{
							label: 'Open the product',
							icon: PackageIcon,
							href: `/seller/products/${item.product_id}`
						}
					]}
				/>
			</td>
		</tr>
	{/snippet}
</DataTable>

<style>
	.right {
		text-align: right;
	}
</style>
