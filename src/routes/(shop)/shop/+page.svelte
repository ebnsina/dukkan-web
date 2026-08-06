<script lang="ts">
	import Seo from '$lib/seo/Seo.svelte';
	import ProductCard from '$lib/shop/ProductCard.svelte';
	import { Empty } from '$lib/ui';
	import { formatNumber } from '$lib/utils/format';

	let { data } = $props();

	const front = $derived(data.front);
</script>

<Seo
	title={data.shop.name}
	description="Shop {data.shop.name} — pay with bKash, Nagad, card or cash on delivery."
/>

<!-- The shop's own words where ours used to be. Every storefront read the
     same before this — its name, a count of items, and a line about cash on
     delivery that we wrote — so two shops selling different things in
     different towns were indistinguishable below the logo.

     A shop that has said nothing still gets a usable page: its name, and the
     one line about cash on delivery that is true of all of them. -->
<section class="head" class:has-art={Boolean(front?.hero_image)}>
	<div class="head-inner container-page">
		<div class="words">
			<h1 class="t-title">{front?.headline || data.shop.name}</h1>
			<!-- Not `t-label`. That is mono, uppercase and letter-spaced by 0.16em,
			     which was fine while this line was our own English sentence and is
			     wrong the moment a shop writes its own: Bangla has no uppercase and
			     letter-spacing pulls its conjuncts apart. -->
			<p class="sub">
				{#if front?.tagline}
					{front.tagline}
				{:else}
					{formatNumber(data.page.total)}
					{data.page.total === 1 ? 'item' : 'items'} · Cash on delivery across Bangladesh
				{/if}
			</p>
			{#if front?.hero_link_label && front.hero_link_href}
				<a class="cta" href={front.hero_link_href}>{front.hero_link_label}</a>
			{/if}
		</div>

		{#if front?.hero_image}
			<img
				class="art"
				src={front.hero_image.urls.large}
				alt={front.hero_image.alt_text ?? ''}
				width={front.hero_image.width}
				height={front.hero_image.height}
			/>
		{/if}
	</div>
</section>

{#if front?.about}
	<section class="about container-page">
		<p>{front.about}</p>
	</section>
{/if}

<section class="container-page">
	{#if data.page.products.length === 0}
		<Empty title="Nothing here yet" description="This shop has not published anything so far." />
	{:else}
		<div class="shop-grid">
			{#each data.page.products as product, index (product.id)}
				<ProductCard
					{product}
					currency={data.shop.currency}
					layout={data.theme.layout}
					lead={data.theme.layout === 'editorial' && index === 0}
				/>
			{/each}
		</div>
	{/if}
</section>

{#if front?.about}
	<section class="about container-page">
		<p>{front.about}</p>
	</section>
{/if}

<style>
	.head {
		padding-block: clamp(40px, 6vw, 72px) clamp(28px, 4vw, 44px);
	}

	.sub {
		margin-top: 16px;
		font-size: var(--size-body);
		line-height: 1.7;
		color: var(--faint);
		max-width: 46ch;
	}

	.head-inner {
		display: grid;
		gap: 28px;
		align-items: center;
	}

	/* The picture only earns a column when there is one. Without it the words
	   keep the full width rather than sitting in half a page next to nothing. */
	.has-art .head-inner {
		grid-template-columns: 1fr;
	}

	@media (min-width: 800px) {
		.has-art .head-inner {
			grid-template-columns: 1fr 1fr;
		}
	}

	.art {
		width: 100%;
		height: auto;
		border-radius: 14px;
		object-fit: cover;
	}

	.cta {
		display: inline-block;
		margin-top: 24px;
		padding: 12px 22px;
		border-radius: 999px;
		background: var(--shop-accent);
		color: var(--shop-accent-ink);
		font-size: 14px;
		text-decoration: none;
	}

	/* Between the shop introducing itself and the goods, which is the order
	   somebody reads a shop in. */
	.about p {
		max-width: 68ch;
		padding-bottom: clamp(28px, 4vw, 44px);
		font-size: var(--size-body);
		line-height: 1.75;
		color: var(--faint);
		white-space: pre-wrap;
	}
</style>
