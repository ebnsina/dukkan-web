<script lang="ts">
	import type { ProductListing } from '$lib/api/types';
	import { formatMinorRange } from '$lib/utils/money';

	interface Props {
		product: ProductListing;
		currency?: string;
	}

	let { product, currency = 'BDT' }: Props = $props();
</script>

<a class="card" href="/p/{product.slug}">
	<span class="thumb" aria-hidden="true"></span>
	<span class="body">
		<span class="title">{product.title}</span>
		{#if product.title_bn}<span class="title-bn">{product.title_bn}</span>{/if}
		{#if product.summary}<span class="summary">{product.summary}</span>{/if}
		<span class="foot">
			{#if product.price_min_minor !== null && product.price_max_minor !== null}
				<span class="price t-mono">
					{formatMinorRange(product.price_min_minor, product.price_max_minor, currency)}
				</span>
			{/if}
			{#if !product.in_stock}<span class="out t-label">Sold out</span>{/if}
		</span>
	</span>
</a>

<style>
	.card {
		display: flex;
		flex-direction: column;
		color: var(--ink);
		text-decoration: none;
	}

	.thumb {
		display: block;
		aspect-ratio: 4 / 5;
		background: var(--surface);
		border: 1px solid var(--rule);
		transition: border-color var(--dur-hover) var(--ease-out);
	}

	.card:hover .thumb {
		border-color: var(--rule-strong);
	}

	.body {
		display: flex;
		flex-direction: column;
		gap: 4px;
		padding-top: 14px;
	}

	.title {
		font-size: 15px;
		font-weight: 600;
		line-height: 1.35;
	}

	.title-bn {
		font-size: 13px;
		color: var(--muted);
	}

	.summary {
		font-size: 13px;
		line-height: 1.5;
		color: var(--faint);
	}

	.foot {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 12px;
		margin-top: 8px;
	}

	.price {
		font-size: 14px;
		font-variant-numeric: tabular-nums;
	}

	.out {
		color: var(--faint);
	}
</style>
