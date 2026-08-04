<script lang="ts">
	import type { ProductListing, ThemeLayout } from '$lib/api/types';
	import { formatMinorRange } from '$lib/utils/money';
	import Photo from './Photo.svelte';
	import { firstImage, gridSizes } from './photo';

	interface Props {
		product: ProductListing;
		currency?: string;
		layout?: ThemeLayout;
		/* The editorial layout gives its first item the width of the page, so
		   that one asks for a bigger file than its neighbours. */
		lead?: boolean;
	}

	let { product, currency = 'BDT', layout = 'grid-dense', lead = false }: Props = $props();

	let image = $derived(firstImage(product.images));
	let sizes = $derived(lead ? gridSizes('editorial') : gridSizes(layout));
</script>

<!-- The arrangement lives in layout.css under `.shop-surface[data-layout]`, so
	 one card serves every design the shop might be wearing. -->
<a class="pc" class:is-lead={lead} href="/p/{product.slug}">
	<span class="pc-art">
		<Photo {image} {sizes} fallbackAlt={product.title} priority={lead} />
		{#if !product.in_stock}<span class="pc-gone t-label">Sold out</span>{/if}
	</span>

	<span class="pc-body">
		<span class="pc-title">{product.title}</span>
		{#if product.title_bn}<span class="pc-bn">{product.title_bn}</span>{/if}
		{#if product.summary}<span class="pc-summary">{product.summary}</span>{/if}
		{#if product.price_min_minor !== null && product.price_max_minor !== null}
			<span class="pc-price t-mono">
				{formatMinorRange(product.price_min_minor, product.price_max_minor, currency)}
			</span>
		{/if}
	</span>
</a>

<style>
	.pc {
		display: flex;
		flex-direction: column;
		min-width: 0;
		color: var(--ink);
		text-decoration: none;
	}

	.pc-art {
		position: relative;
		display: block;
		aspect-ratio: 1 / 1;
		overflow: hidden;
		border: 1px solid var(--rule);
		border-radius: var(--r-panel);
		transition: border-color var(--dur-hover) var(--ease-out);
	}

	.pc:hover .pc-art {
		border-color: var(--inverse-paper);
	}

	.pc-gone {
		position: absolute;
		bottom: 10px;
		left: 10px;
		padding: 5px 9px;
		border-radius: var(--r-chip);
		background: var(--inverse-paper);
		color: var(--inverse-ink);
	}

	.pc-body {
		display: flex;
		flex-direction: column;
		gap: 4px;
		padding-top: 12px;
		min-width: 0;
	}

	.pc-title {
		font-size: 15px;
		font-weight: 600;
		line-height: 1.35;
	}

	.pc-bn {
		font-size: 13px;
		color: var(--muted);
	}

	.pc-summary {
		display: none;
		font-size: 13px;
		line-height: 1.5;
		color: var(--faint);
	}

	.pc-price {
		margin-top: 6px;
		font-size: 14px;
		font-variant-numeric: tabular-nums;
	}
</style>
