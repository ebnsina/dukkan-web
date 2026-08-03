<script lang="ts">
	import Seo from '$lib/seo/Seo.svelte';
	import { Empty } from '$lib/ui';
	import OrderStatus from '$lib/admin/OrderStatus.svelte';
	import { formatMinor } from '$lib/utils/money';
	import { formatNumber, formatRelativeTime } from '$lib/utils/format';

	let { data } = $props();

	const STATUSES = [
		'',
		'placed',
		'confirmed',
		'processing',
		'shipped',
		'delivered',
		'cancelled',
		'returned'
	];
</script>

<Seo title="Orders" description="Every order in your shop." noindex />

<div class="head">
	<h1 class="t-heading">Orders</h1>
	<p class="count t-label">{formatNumber(data.orders.length)} shown</p>
</div>

<form method="GET" class="filters">
	<label class="search">
		<span class="sr-only">Search orders</span>
		<input
			type="search"
			name="q"
			value={data.filters.q}
			placeholder="Order number, name or mobile"
		/>
	</label>
	<label class="pick">
		<span class="sr-only">Status</span>
		<select name="status" value={data.filters.status}>
			{#each STATUSES as status (status)}
				<option value={status}>{status === '' ? 'Any status' : status}</option>
			{/each}
		</select>
	</label>
	<button class="go t-button" type="submit">Search</button>
</form>

{#if data.orders.length === 0}
	<Empty
		title="Nothing matches"
		description="Try a different search, or clear it to see everything."
	/>
{:else}
	<div class="scroll">
		<table>
			<thead>
				<tr>
					<th scope="col">Order</th>
					<th scope="col">Customer</th>
					<th scope="col">Mobile</th>
					<th scope="col">District</th>
					<th scope="col">Status</th>
					<th scope="col">Payment</th>
					<th scope="col" data-numeric>Total</th>
					<th scope="col">Placed</th>
				</tr>
			</thead>
			<tbody>
				{#each data.orders as order (order.id)}
					<tr>
						<td><a class="num t-mono" href="/admin/orders/{order.id}">{order.number}</a></td>
						<td class="strong">{order.recipient}</td>
						<td class="quiet t-mono">{order.phone}</td>
						<td class="quiet">{order.district_name}</td>
						<td><OrderStatus status={order.status} emphasis /></td>
						<td><OrderStatus status={order.payment_state} /></td>
						<td data-numeric>{formatMinor(order.total_minor, order.currency)}</td>
						<td class="quiet when t-mono">{formatRelativeTime(order.placed_at)}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/if}

<style>
	.head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 16px;
	}

	.count {
		color: var(--faint);
	}

	.filters {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		margin: 28px 0 8px;
	}

	input,
	select {
		height: 40px;
		padding-inline: 12px;
		background: var(--paper);
		color: var(--ink);
		border: 1px solid var(--rule-strong);
		font-family: var(--font-display);
		font-size: 14px;
	}

	input:focus,
	select:focus {
		outline: none;
		border-color: var(--ink);
	}

	.search input {
		width: min(320px, 70vw);
	}

	.go {
		height: 40px;
		padding-inline: 20px;
		background: var(--inverse-paper);
		color: var(--inverse-ink);
		border: none;
		cursor: pointer;
	}

	.scroll {
		overflow-x: auto;
		margin-top: 20px;
	}

	table {
		width: 100%;
		border-collapse: collapse;
	}

	th {
		padding: 12px 16px 12px 0;
		text-align: left;
		font-family: var(--font-mono);
		font-size: 10.5px;
		font-weight: 400;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--faint);
		border-bottom: 1px solid var(--rule-strong);
		white-space: nowrap;
	}

	td {
		padding: 14px 16px 14px 0;
		font-size: 14px;
		border-bottom: 1px solid var(--rule);
		color: var(--muted);
	}

	th[data-numeric],
	td[data-numeric] {
		text-align: right;
		font-family: var(--font-mono);
		font-variant-numeric: tabular-nums;
		font-feature-settings: 'zero' 1;
		color: var(--ink);
		white-space: nowrap;
	}

	.num {
		color: var(--ink);
		text-decoration: none;
		border-bottom: 1px solid var(--rule-strong);
	}

	.num:hover {
		border-bottom-color: var(--ink);
	}

	.strong {
		color: var(--ink);
	}

	.quiet {
		color: var(--faint);
	}

	th:last-child,
	td:last-child {
		padding-right: 0;
		text-align: right;
	}

	.when {
		font-size: 12px;
		white-space: nowrap;
	}
</style>
