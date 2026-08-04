<script lang="ts">
	import { enhance } from '$app/forms';
	import Seo from '$lib/seo/Seo.svelte';
	import Photo from '$lib/shop/Photo.svelte';
	import { SIZES } from '$lib/shop/photo';
	import { Banner, Button } from '$lib/ui';
	import { formatMinor } from '$lib/utils/money';
	import { formatNumber } from '$lib/utils/format';

	let { data, form } = $props();

	const product = $derived(data.product);
	const sellable = $derived(
		product.variants.filter((v) => v.stock.on_hand > 0 || v.stock.allow_backorder)
	);

	let picked = $state('');
	let quantity = $state(1);
	let shown = $state(0);

	const images = $derived(product.images ?? []);
	const hero = $derived(images[shown] ?? images[0] ?? null);

	const fallbackId = $derived(
		product.variants.find((v) => v.stock.on_hand > 0)?.id ??
			product.variants.find((v) => v.is_default)?.id ??
			product.variants[0]?.id ??
			''
	);
	const selectedId = $derived(picked || fallbackId);
	const selected = $derived(product.variants.find((v) => v.id === selectedId));
	const available = $derived(selected ? selected.stock.on_hand - selected.stock.reserved : 0);
	const canBuy = $derived(Boolean(selected) && (available > 0 || selected!.stock.allow_backorder));
</script>

<Seo
	title={product.title}
	description={product.summary ?? `${product.title} from ${data.shop.name}.`}
/>

<article class="wrap container-page">
	<div class="media">
		<div class="hero">
			<Photo image={hero} sizes={SIZES.detail} priority fallbackAlt={product.title} />
		</div>

		{#if images.length > 1}
			<!-- Thumbnails ask for the thumb rendition: a 158 KB file in a 64px
				 slot is somebody's mobile data, spent on nothing. -->
			<div class="thumbs">
				{#each images as image, index (image.id)}
					<button
						type="button"
						class="thumb"
						class:is-shown={index === shown}
						aria-label="Photo {index + 1} of {images.length}"
						aria-pressed={index === shown}
						onclick={() => (shown = index)}
					>
						<img src={image.urls.thumb} alt="" loading="lazy" decoding="async" />
					</button>
				{/each}
			</div>
		{/if}
	</div>

	<div class="detail">
		{#if product.category}
			<a class="crumb t-label" href="/c/{product.category.slug}">{product.category.name}</a>
		{/if}

		<h1 class="t-heading">{product.title}</h1>
		{#if product.title_bn}<p class="title-bn">{product.title_bn}</p>{/if}

		{#if selected}
			<p class="price t-mono">
				{formatMinor(selected.price_minor, data.shop.currency)}
				{#if selected.compare_at_minor && selected.compare_at_minor > selected.price_minor}
					<span class="was">{formatMinor(selected.compare_at_minor, data.shop.currency)}</span>
				{/if}
			</p>
		{/if}

		{#if product.summary}<p class="summary">{product.summary}</p>{/if}
		{#if product.description}<p class="description">{product.description}</p>{/if}

		{#if form?.message}
			<Banner title="We could not add that" tone="danger">{form.message}</Banner>
		{/if}

		<form method="POST" action="?/add" use:enhance class="buy">
			{#if product.variants.length > 1}
				<fieldset>
					<legend class="t-label">Choose one</legend>
					<div class="options">
						{#each product.variants as variant (variant.id)}
							{@const gone =
								variant.stock.on_hand - variant.stock.reserved <= 0 &&
								!variant.stock.allow_backorder}
							<label
								class="option"
								class:is-picked={selectedId === variant.id}
								class:is-gone={gone}
							>
								<input
									type="radio"
									name="variant_id"
									value={variant.id}
									checked={selectedId === variant.id}
									onchange={() => (picked = variant.id)}
								/>
								<span class="option-name">
									{variant.options
										? Object.values(variant.options).join(' · ')
										: (variant.title ?? variant.sku ?? 'Standard')}
								</span>
								<span class="option-price t-mono">
									{formatMinor(variant.price_minor, data.shop.currency)}
								</span>
								{#if gone}<span class="option-gone t-label">Sold out</span>{/if}
							</label>
						{/each}
					</div>
				</fieldset>
			{:else if selected}
				<input type="hidden" name="variant_id" value={selected.id} />
			{/if}

			<div class="row">
				<label class="qty">
					<span class="t-label">Quantity</span>
					<input
						class="qty-input t-mono"
						type="number"
						name="quantity"
						min="1"
						max="100"
						bind:value={quantity}
					/>
				</label>

				<Button type="submit" arrow disabled={!canBuy}>
					{canBuy ? 'Add to basket' : 'Sold out'}
				</Button>
			</div>

			{#if canBuy && available > 0 && available <= 5}
				<p class="low t-label">Only {formatNumber(available)} left</p>
			{:else if !canBuy && sellable.length > 0}
				<p class="low t-label">That one is gone. Another choice above is still available.</p>
			{/if}
		</form>

		{#if selected?.sku}
			<p class="sku t-mono">SKU {selected.sku}</p>
		{/if}
	</div>
</article>

<style>
	.wrap {
		display: grid;
		gap: 40px;
		padding-top: clamp(32px, 5vw, 56px);
	}

	.media {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.hero {
		aspect-ratio: 4 / 5;
		overflow: hidden;
		border: 1px solid var(--rule);
		border-radius: var(--r-panel);
	}

	.thumbs {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.thumb {
		width: 64px;
		height: 64px;
		padding: 0;
		overflow: hidden;
		background: var(--surface);
		border: 1px solid var(--rule);
		border-radius: var(--r-tile);
		cursor: pointer;
	}

	.thumb img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.is-shown {
		border-color: var(--inverse-paper);
	}

	.crumb {
		display: inline-block;
		margin-bottom: 20px;
		color: var(--faint);
		text-decoration: none;
	}

	.crumb:hover {
		color: var(--ink);
	}

	.title-bn {
		margin-top: 10px;
		font-size: 17px;
		color: var(--muted);
	}

	.price {
		margin-top: 24px;
		font-size: 28px;
		font-weight: 500;
		letter-spacing: -0.03em;
		font-variant-numeric: tabular-nums;
	}

	.was {
		margin-left: 10px;
		font-size: 17px;
		color: var(--faint);
		text-decoration: line-through;
	}

	.summary,
	.description {
		margin-top: 20px;
		font-size: var(--size-body);
		line-height: 1.6;
		color: var(--muted);
		max-width: var(--measure);
	}

	.buy {
		margin-top: 36px;
		padding-top: 28px;
		border-top: 1px solid var(--rule);
	}

	legend {
		color: var(--faint);
		margin-bottom: 14px;
	}

	.options {
		display: flex;
		flex-direction: column;
		border-top: 1px solid var(--rule);
	}

	.option {
		display: flex;
		align-items: baseline;
		gap: 14px;
		padding-block: 14px;
		border-bottom: 1px solid var(--rule);
		cursor: pointer;
	}

	.option input {
		width: 15px;
		height: 15px;
		appearance: none;
		border: 1px solid var(--rule-strong);
		border-radius: var(--r-round);
		background: var(--paper);
		flex-shrink: 0;
		align-self: center;
	}

	.option input:checked {
		border-color: var(--ink);
		border-width: 5px;
	}

	.option-name {
		font-size: 15px;
		flex: 1;
	}

	.is-picked .option-name {
		font-weight: 600;
	}

	.option-price {
		font-size: 14px;
		font-variant-numeric: tabular-nums;
		color: var(--muted);
	}

	.is-gone {
		opacity: 0.45;
	}

	.option-gone {
		color: var(--faint);
	}

	.row {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-end;
		gap: 16px;
		margin-top: 28px;
	}

	.qty {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.qty span {
		color: var(--faint);
	}

	.qty-input {
		width: 84px;
		height: 46px;
		padding-inline: 12px;
		background: var(--paper);
		color: var(--ink);
		border: 1px solid var(--rule-strong);
		border-radius: var(--r-control);
		font-size: 15px;
		font-variant-numeric: tabular-nums;
	}

	.qty-input:focus {
		outline: none;
		border-color: var(--ink);
	}

	.low {
		margin-top: 18px;
		color: var(--faint);
	}

	.sku {
		margin-top: 28px;
		font-size: 11px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--faint);
	}

	@media (min-width: 880px) {
		.wrap {
			grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
			gap: 64px;
			align-items: start;
		}
	}
</style>
