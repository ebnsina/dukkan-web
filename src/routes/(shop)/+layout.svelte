<script lang="ts">
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { ShoppingBag01Icon, UserIcon, Search01Icon } from '@hugeicons/core-free-icons';
	import { formatNumber } from '$lib/utils/format';

	let { data, children } = $props();

	// The shop's four tokens, handed to CSS. Everything downstream reads the
	// ordinary names, so no component knows a theme exists.
	let paint = $derived(
		[
			`--shop-accent: ${data.theme.tokens.accent}`,
			`--shop-accent-ink: ${data.theme.tokens['accent-ink']}`,
			`--shop-surface: ${data.theme.tokens.surface}`
		].join('; ')
	);
</script>

<div
	class="shop-surface"
	style={paint}
	data-density={data.theme.tokens.density}
	data-layout={data.theme.layout}
>
	<header class="bar">
		<div class="inner container-page">
			<a class="shop-name" href="/shop">{data.shop.name}</a>

			<nav aria-label="Categories" class="cats">
				{#each data.categories.slice(0, 5) as category (category.id)}
					<a href="/c/{category.slug}">
						{category.name}
						{#if category.name_bn}<span class="bn">{category.name_bn}</span>{/if}
					</a>
				{/each}
			</nav>

			<div class="tools">
				<a class="icon-box" href="/search" aria-label="Search">
					<HugeiconsIcon icon={Search01Icon} size={16} strokeWidth={1.6} />
				</a>
				<a class="icon-box" href="/account" aria-label="Your account">
					<HugeiconsIcon icon={UserIcon} size={16} strokeWidth={1.6} />
				</a>
				<a
					class="icon-box cart"
					href="/cart"
					aria-label="Basket, {formatNumber(data.itemCount)} items"
				>
					<HugeiconsIcon icon={ShoppingBag01Icon} size={16} strokeWidth={1.6} />
					{#if data.itemCount > 0}
						<span class="count t-mono">{formatNumber(data.itemCount)}</span>
					{/if}
				</a>
			</div>
		</div>
	</header>

	<main>{@render children()}</main>

	<footer class="foot">
		<div class="foot-inner container-page">
			<span class="t-label">{data.shop.name}</span>
			<a class="t-label" href="/track">Track an order</a>
		</div>
	</footer>
</div>

<style>
	.shop-surface {
		min-height: 100dvh;
	}

	.bar {
		position: sticky;
		top: 0;
		z-index: 100;
		background: color-mix(in srgb, var(--paper) 82%, transparent);
		-webkit-backdrop-filter: blur(14px);
		backdrop-filter: blur(14px);
		border-bottom: 1px solid var(--rule);
	}

	.inner {
		display: flex;
		align-items: center;
		gap: 28px;
		height: 68px;
	}

	.shop-name {
		font-weight: 700;
		font-size: 17px;
		letter-spacing: -0.03em;
		font-variation-settings: 'wdth' 92;
		color: var(--ink);
		text-decoration: none;
		white-space: nowrap;
	}

	.cats {
		display: none;
		gap: 22px;
		overflow-x: auto;
	}

	.cats a {
		display: flex;
		align-items: baseline;
		gap: 7px;
		font-size: 14px;
		color: var(--muted);
		text-decoration: none;
		white-space: nowrap;
		transition: color var(--dur-hover) var(--ease-out);
	}

	.cats a:hover {
		color: var(--ink);
	}

	.bn {
		font-size: 12px;
		color: var(--faint);
	}

	.tools {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-left: auto;
	}

	.icon-box {
		display: grid;
		place-items: center;
		width: 34px;
		height: 34px;
		border: 1px solid var(--rule-strong);
		border-radius: var(--r-control);
		color: var(--muted);
		text-decoration: none;
		transition:
			color var(--dur-hover) var(--ease-out),
			border-color var(--dur-hover) var(--ease-out);
	}

	.icon-box:hover {
		color: var(--ink);
		border-color: var(--ink);
	}

	.cart {
		position: relative;
	}

	.count {
		position: absolute;
		top: -7px;
		right: -7px;
		min-width: 17px;
		height: 17px;
		display: grid;
		place-items: center;
		padding-inline: 4px;
		background: var(--inverse-paper);
		color: var(--inverse-ink);
		font-size: 10px;
		font-variant-numeric: tabular-nums;
	}

	.foot {
		border-top: 1px solid var(--rule);
		margin-top: clamp(64px, 9vw, 112px);
	}

	.foot-inner {
		display: flex;
		justify-content: space-between;
		gap: 16px;
		padding-block: 32px;
		color: var(--faint);
	}

	.foot-inner a {
		color: var(--faint);
		text-decoration: none;
	}

	.foot-inner a:hover {
		color: var(--ink);
	}

	@media (min-width: 900px) {
		.cats {
			display: flex;
		}
	}
</style>
