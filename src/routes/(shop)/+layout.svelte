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
	<!-- The one line a shop most wants to change: free delivery this week,
	     closed for Eid, a new arrival. Above the bar because it is news. -->
	{#if data.front?.notice_enabled && data.front.notice}
		<div class="notice"><p class="container-page">{data.front.notice}</p></div>
	{/if}

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
			<div class="foot-col">
				<span class="foot-name">{data.shop.name}</span>
				{#if data.front?.contact_address}
					<span class="foot-line">{data.front.contact_address}</span>
				{/if}
				<!-- A shop with no way to reach it reads as a shop nobody is
				     behind, which in this market loses the sale. -->
				{#if data.front?.contact_phone}
					<a class="foot-line" href="tel:{data.front.contact_phone}">
						{data.front.contact_phone}
					</a>
				{/if}
				{#if data.front?.contact_email}
					<a class="foot-line" href="mailto:{data.front.contact_email}">
						{data.front.contact_email}
					</a>
				{/if}
			</div>

			<div class="foot-col foot-links">
				<a class="t-label" href="/track">Track an order</a>
				<a class="t-label" href="/help">Ask us</a>
				{#each data.pages as page (page.id)}
					<a class="foot-line" href="/pages/{page.slug}">{page.title}</a>
				{/each}
				{#if data.front?.whatsapp_number}
					<a
						class="t-label"
						href="https://wa.me/{data.front.whatsapp_number.replace(/[^0-9]/g, '')}"
						rel="noreferrer"
					>
						WhatsApp
					</a>
				{/if}
				{#if data.front?.facebook_url}
					<a class="t-label" href={data.front.facebook_url} rel="noreferrer">Facebook</a>
				{/if}
			</div>
		</div>
	</footer>
</div>

<style>
	.shop-surface {
		min-height: 100dvh;
	}

	.notice {
		background: var(--shop-accent);
		color: var(--shop-accent-ink);
		font-size: 13px;
		text-align: center;
		padding-block: 8px;
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
		border-radius: var(--r-round);
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
		flex-wrap: wrap;
		gap: 28px;
		padding-block: 32px;
		color: var(--faint);
	}

	.foot-col {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	/* The links wrap rather than squeezing: a shop with four written pages plus
	   two social links has more here than fits one line on a phone. */
	.foot-links {
		flex-direction: row;
		flex-wrap: wrap;
		gap: 8px 20px;
		align-items: flex-start;
	}

	/* A reading face, not `t-label`. Everything here that a shop wrote — its
	   name, its address, the titles of its own pages — is as likely to be
	   Bangla as English, and mono uppercase with 0.16em of letter-spacing
	   pulls Bangla conjuncts apart. Our own words keep the label style. */
	.foot-line,
	.foot-name {
		font-size: 13px;
		line-height: 1.6;
	}

	.foot-name {
		color: var(--ink);
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
