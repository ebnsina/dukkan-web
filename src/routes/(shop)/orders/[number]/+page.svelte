<script lang="ts">
	import Seo from '$lib/seo/Seo.svelte';
	import { Banner, Button } from '$lib/ui';
	import OrderDetail from '$lib/shop/OrderDetail.svelte';

	let { data } = $props();
</script>

<Seo title="Order {data.number}" description="Your order from {data.shop.name}." noindex />

<div class="wrap container-page">
	{#if data.placed}
		<div class="placed">
			<p class="t-label">Order placed</p>
			<h1 class="t-title">Thank you. We have your order.</h1>
			<p class="lead t-lead">
				Your order number is <span class="t-mono">{data.number}</span>. Keep it — you can look the
				order up any time with that number and your mobile.
			</p>
		</div>
	{:else}
		<h1 class="t-heading">Order {data.number}</h1>
	{/if}

	{#if data.order}
		<OrderDetail order={data.order} />
	{:else}
		<Banner title="We need your mobile number">
			To show this order we need the mobile number it was placed with.
			{#snippet actions()}
				<Button href="/track" variant="ghost">Look up the order</Button>
			{/snippet}
		</Banner>
	{/if}

	<div class="on">
		<Button href="/shop" variant="ghost" arrow>Keep shopping</Button>
	</div>
</div>

<style>
	.wrap {
		padding-top: clamp(32px, 5vw, 56px);
		display: flex;
		flex-direction: column;
		gap: 36px;
	}

	.placed p:first-child {
		color: var(--faint);
		margin-bottom: 20px;
	}

	.lead {
		margin-top: 20px;
		color: var(--muted);
	}

	.on {
		padding-top: 8px;
	}
</style>
