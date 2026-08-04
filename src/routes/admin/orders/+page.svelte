<script lang="ts">
	import Seo from '$lib/seo/Seo.svelte';
	import { Search01Icon } from '@hugeicons/core-free-icons';
	import { Button, Empty, Frame, Status } from '$lib/ui';
	import { formatMinor } from '$lib/utils/money';
	import { formatNumber, formatRelativeTime } from '$lib/utils/format';

	let { data } = $props();

	/* The API's words, and the words a shop owner would use for them. */
	const STATUSES = [
		{ value: '', word: 'Any status' },
		{ value: 'placed', word: 'To confirm' },
		{ value: 'confirmed', word: 'To send' },
		{ value: 'processing', word: 'Being packed' },
		{ value: 'shipped', word: 'On its way' },
		{ value: 'delivered', word: 'Delivered' },
		{ value: 'cancelled', word: 'Cancelled' },
		{ value: 'returned', word: 'Came back' }
	];
</script>

<Seo title="Orders" description="Every order in your shop." noindex />

<div class="dk-title-row">
	<div>
		<h1 class="dk-h1">Orders</h1>
		<p class="dk-date">Everything a customer has asked you for.</p>
	</div>
</div>

<form method="GET" class="dk-filters">
	<label class="sr-only" for="orders-q">Search orders</label>
	<input
		id="orders-q"
		class="dk-input"
		type="search"
		name="q"
		value={data.filters.q}
		placeholder="Order number, name or mobile"
	/>
	<label class="sr-only" for="orders-status">Status</label>
	<select id="orders-status" class="dk-select" name="status" value={data.filters.status}>
		{#each STATUSES as status (status.value)}
			<option value={status.value}>{status.word}</option>
		{/each}
	</select>
	<Button type="submit" size="sm" icon={Search01Icon}>Search</Button>
</form>

<Frame eyebrow="All orders" variant="flush">
	{#if data.orders.length === 0}
		<Empty
			title="Nothing matches"
			description="Try a different search, or clear it to see everything."
		/>
	{:else}
		<div class="dk-scroll">
			<table class="dk-table">
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
							<td><a class="dk-num" href="/admin/orders/{order.id}">{order.number}</a></td>
							<td class="dk-strong">{order.recipient}</td>
							<td class="dk-num">{order.phone}</td>
							<td>{order.district_name}</td>
							<td><Status status={order.status} /></td>
							<td><Status status={order.payment_state} kind="payment" /></td>
							<td data-numeric>{formatMinor(order.total_minor, order.currency)}</td>
							<td class="dk-quiet">{formatRelativeTime(order.placed_at)}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}

	{#snippet footer()}
		<span>{formatNumber(data.orders.length)} shown</span>
	{/snippet}
</Frame>
