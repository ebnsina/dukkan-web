<script lang="ts">
	import Seo from '$lib/seo/Seo.svelte';
	import { ViewIcon } from '@hugeicons/core-free-icons';
	import { Status } from '$lib/ui';
	import DataTable from '$lib/admin/DataTable.svelte';
	import PageTop from '$lib/admin/PageTop.svelte';
	import RowActions from '$lib/admin/RowActions.svelte';
	import { formatMinor } from '$lib/utils/money';
	import { formatRelativeTime } from '$lib/utils/format';

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

	/* An empty shop and an empty search need different advice. */
	const searching = $derived(Boolean(data.filters.q || data.filters.status));
</script>

<Seo title="Orders" description="Every order in your shop." noindex />

<PageTop trail={[{ label: 'Orders' }]}>
	{#snippet filters()}
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
			<select
				id="orders-status"
				class="dk-select"
				name="status"
				onchange={(e) => e.currentTarget.form?.requestSubmit()}
				value={data.filters.status}
			>
				{#each STATUSES as status (status.value)}
					<option value={status.value}>{status.word}</option>
				{/each}
			</select>
		</form>
	{/snippet}
</PageTop>

<DataTable
	rows={data.orders}
	noun="order"
	emptyTitle={searching ? 'Nothing matches' : 'No orders yet'}
	emptyBody={searching
		? 'Try a different search, or clear it to see everything.'
		: 'Orders appear here the moment somebody buys something.'}
>
	{#snippet head()}
		<th scope="col">Order</th>
		<th scope="col">Customer</th>
		<th scope="col">Mobile</th>
		<th scope="col">District</th>
		<th scope="col">Status</th>
		<th scope="col">Payment</th>
		<th scope="col" data-numeric>Total</th>
		<th scope="col">Placed</th>
		<th scope="col"><span class="sr-only">Actions</span></th>
	{/snippet}

	{#snippet row(order)}
		<tr>
			<td><a class="dk-num" href="/admin/orders/{order.id}">{order.number}</a></td>
			<td class="dk-strong">{order.recipient}</td>
			<td class="dk-num">{order.phone}</td>
			<td>{order.district_name}</td>
			<td><Status status={order.status} /></td>
			<td><Status status={order.payment_state} kind="payment" /></td>
			<td data-numeric>{formatMinor(order.total_minor, order.currency)}</td>
			<td class="dk-quiet">{formatRelativeTime(order.placed_at)}</td>
			<td class="right">
				<RowActions
					label="order {order.number}"
					items={[
						{
							label: 'View the order',
							icon: ViewIcon,
							href: `/admin/orders/${order.id}`
						}
					]}
				/>
			</td>
		</tr>
	{/snippet}
</DataTable>

<style>
	.right {
		text-align: right;
	}
</style>
