<script lang="ts">
	import Seo from '$lib/seo/Seo.svelte';
	import ProductCard from '$lib/shop/ProductCard.svelte';
	import { Empty, Pagination } from '$lib/ui';
	import { formatNumber } from '$lib/utils/format';
	import { goto } from '$app/navigation';
	import { page as pageState } from '$app/state';

	let { data } = $props();

	const title = $derived(data.category?.name ?? 'Category');
	const pageCount = $derived(Math.max(1, Math.ceil(data.page.total / data.page.limit)));
	const current = $derived(Math.floor(data.page.offset / data.page.limit) + 1);

	function change(next: number) {
		const url = new URL(pageState.url);
		url.searchParams.set('offset', String((next - 1) * data.page.limit));
		goto(url, { noScroll: false });
	}
</script>

<Seo {title} description="{title} at {data.shop.name}." />

<section class="head">
	<div class="container-page">
		<h1 class="t-heading">{title}</h1>
		{#if data.category?.name_bn}<p class="bn">{data.category.name_bn}</p>{/if}
		<p class="count t-label">
			{formatNumber(data.page.total)}
			{data.page.total === 1 ? 'item' : 'items'}
		</p>
	</div>
</section>

<section class="container-page">
	{#if data.page.products.length === 0}
		<Empty title="Nothing in here yet" description="Try another category." />
	{:else}
		<div class="grid">
			{#each data.page.products as product (product.id)}
				<ProductCard {product} currency={data.shop.currency} />
			{/each}
		</div>

		{#if pageCount > 1}
			<div class="pager">
				<Pagination page={current} {pageCount} onchange={change} />
			</div>
		{/if}
	{/if}
</section>

<style>
	.head {
		padding-block: clamp(32px, 5vw, 56px) clamp(24px, 3vw, 36px);
	}

	.bn {
		margin-top: 10px;
		font-size: 17px;
		color: var(--muted);
	}

	.count {
		margin-top: 16px;
		color: var(--faint);
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 32px 20px;
	}

	.pager {
		display: flex;
		justify-content: center;
		margin-top: 56px;
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
