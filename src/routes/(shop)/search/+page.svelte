<script lang="ts">
	import Seo from '$lib/seo/Seo.svelte';
	import ProductCard from '$lib/shop/ProductCard.svelte';
	import { Button, Empty, Input } from '$lib/ui';
	import { Search01Icon } from '@hugeicons/core-free-icons';
	import { formatNumber } from '$lib/utils/format';

	let { data } = $props();
</script>

<Seo title="Search" description="Find something in {data.shop.name}." noindex />

<div class="wrap container-page">
	<h1 class="t-heading">Search</h1>

	<form method="GET" class="bar">
		<label class="sr-only" for="q">What are you looking for?</label>
		<!-- Input is width:100%, so the field grows rather than the control. -->
		<div class="field">
			<Input id="q" type="search" name="q" value={data.q} placeholder="What are you looking for?" />
		</div>
		<Button type="submit" icon={Search01Icon}>Search</Button>
	</form>

	{#if data.page}
		<p class="count t-label">
			{formatNumber(data.page.total)}
			{data.page.total === 1 ? 'match' : 'matches'}
		</p>
		{#if data.page.products.length === 0}
			<Empty title="Nothing matches" description="Try a different word, in English or Bangla." />
		{:else}
			<div class="shop-grid">
				{#each data.page.products as product (product.id)}
					<ProductCard {product} currency={data.shop.currency} layout={data.theme.layout} />
				{/each}
			</div>
		{/if}
	{/if}
</div>

<style>
	.wrap {
		padding-top: clamp(32px, 5vw, 56px);
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	.bar {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}

	.field {
		flex: 1;
		min-width: 220px;
	}

	.count {
		color: var(--faint);
	}
</style>
