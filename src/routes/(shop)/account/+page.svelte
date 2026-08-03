<script lang="ts">
	import { enhance } from '$app/forms';
	import Seo from '$lib/seo/Seo.svelte';
	import { Button, Empty } from '$lib/ui';
	import { formatMinor } from '$lib/utils/money';
	import { formatDate } from '$lib/utils/format';

	let { data } = $props();
</script>

<Seo title="Your orders" description="Everything you have ordered." noindex />

<div class="wrap container-page">
	<div class="head">
		<h1 class="t-heading">Your orders</h1>
		<form method="POST" action="?/signOut" use:enhance>
			<Button type="submit" variant="ghost">Sign out</Button>
		</form>
	</div>

	{#if data.orders.length === 0}
		<Empty title="Nothing yet" description="Once you order something it will be listed here.">
			{#snippet actions()}
				<Button href="/" arrow>Start shopping</Button>
			{/snippet}
		</Empty>
	{:else}
		<ul class="orders">
			{#each data.orders as order (order.id)}
				<li>
					<a href="/orders/{order.number}?phone={encodeURIComponent(order.phone)}">
						<span class="num t-mono">{order.number}</span>
						<span class="when">{formatDate(order.placed_at)}</span>
						<span class="status">{order.status}</span>
						<span class="total t-mono">{formatMinor(order.total_minor, order.currency)}</span>
					</a>
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style>
	.wrap {
		padding-top: clamp(32px, 5vw, 56px);
		display: flex;
		flex-direction: column;
		gap: 28px;
	}

	.head {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
	}

	.orders {
		border-top: 1px solid var(--rule-strong);
	}

	.orders a {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr) auto;
		align-items: baseline;
		gap: 8px 20px;
		padding-block: 18px;
		border-bottom: 1px solid var(--rule);
		color: var(--muted);
		text-decoration: none;
		font-size: 14px;
	}

	.orders a:hover .num {
		border-bottom-color: var(--ink);
	}

	.num {
		color: var(--ink);
		border-bottom: 1px solid var(--rule-strong);
	}

	.when {
		color: var(--faint);
		font-size: 13px;
	}

	.status {
		text-transform: capitalize;
	}

	.total {
		font-variant-numeric: tabular-nums;
		color: var(--ink);
		white-space: nowrap;
		text-align: right;
	}

	@media (min-width: 640px) {
		.orders a {
			grid-template-columns: 110px 130px minmax(0, 1fr) auto;
		}
	}
</style>
