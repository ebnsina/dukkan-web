<script lang="ts">
	import Seo from '$lib/seo/Seo.svelte';
	import ProductCard from '$lib/shop/ProductCard.svelte';
	import { Empty } from '$lib/ui';
	import { formatNumber } from '$lib/utils/format';

	let { data } = $props();
</script>

<Seo
	title={data.shop.name}
	description="Shop {data.shop.name} — pay with bKash, Nagad, card or cash on delivery."
/>

<section class="head">
	<div class="container-page">
		<h1 class="t-title">{data.shop.name}</h1>
		<p class="sub t-label">
			{formatNumber(data.page.total)}
			{data.page.total === 1 ? 'item' : 'items'} · Cash on delivery across Bangladesh
		</p>
	</div>
</section>

<section class="container-page">
	{#if data.page.products.length === 0}
		<Empty title="Nothing here yet" description="This shop has not published anything so far." />
	{:else}
		<div class="grid">
			{#each data.page.products as product (product.id)}
				<ProductCard {product} currency={data.shop.currency} />
			{/each}
		</div>
	{/if}
</section>

<style>
	.head {
		padding-block: clamp(40px, 6vw, 72px) clamp(28px, 4vw, 44px);
	}

	.sub {
		margin-top: 16px;
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
