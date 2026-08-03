<script lang="ts">
	import Seo from '$lib/seo/Seo.svelte';
	import ProductCard from '$lib/shop/ProductCard.svelte';
	import { Empty } from '$lib/ui';
	import { formatNumber } from '$lib/utils/format';

	let { data } = $props();
</script>

<Seo title="Search" description="Find something in {data.shop.name}." noindex />

<div class="wrap container-page">
	<h1 class="t-heading">Search</h1>

	<form method="GET" class="bar">
		<label class="sr-only" for="q">What are you looking for?</label>
		<input id="q" type="search" name="q" value={data.q} placeholder="What are you looking for?" />
		<button class="go t-button" type="submit">Search</button>
	</form>

	{#if data.page}
		<p class="count t-label">
			{formatNumber(data.page.total)}
			{data.page.total === 1 ? 'match' : 'matches'}
		</p>
		{#if data.page.products.length === 0}
			<Empty title="Nothing matches" description="Try a different word, in English or Bangla." />
		{:else}
			<div class="grid">
				{#each data.page.products as product (product.id)}
					<ProductCard {product} currency={data.shop.currency} />
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

	input {
		flex: 1;
		min-width: 220px;
		height: 46px;
		padding-inline: 14px;
		background: var(--paper);
		color: var(--ink);
		border: 1px solid var(--rule-strong);
		font-family: var(--font-display);
		font-size: 15px;
	}

	input:focus {
		outline: none;
		border-color: var(--ink);
	}

	.go {
		height: 46px;
		padding-inline: 22px;
		background: var(--inverse-paper);
		color: var(--inverse-ink);
		border: none;
		cursor: pointer;
	}

	.count {
		color: var(--faint);
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 32px 20px;
	}

	@media (min-width: 780px) {
		.grid {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}

	@media (min-width: 1080px) {
		.grid {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}
	}
</style>
