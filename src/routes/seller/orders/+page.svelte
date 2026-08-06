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

	/* Package statuses, in the words somebody packing a parcel would use. These
	   are not the order's statuses: a seller's parcel can be on its way while
	   another seller's part of the same order is still on a table. */
	const STATUSES = [
		{ value: '', word: 'Any status' },
		{ value: 'pending', word: 'To pack' },
		{ value: 'confirmed', word: 'To send' },
		{ value: 'packed', word: 'Packed' },
		{ value: 'shipped', word: 'On its way' },
		{ value: 'delivered', word: 'Delivered' },
		{ value: 'cancelled', word: 'Cancelled' },
		{ value: 'returned', word: 'Came back' }
	];

	const searching = $derived(Boolean(data.filters.q || data.filters.status));
</script>

<Seo title="Orders" description="What you have to send." noindex />

<PageTop trail={[{ label: 'Orders' }]}>
	{#snippet filters()}
		<form method="GET" class="dk-filters">
			<label class="sr-only" for="seller-orders-q">Search orders</label>
			<input
				id="seller-orders-q"
				class="dk-input"
				type="search"
				name="q"
				value={data.filters.q}
				placeholder="Order number or name"
			/>
			<label class="sr-only" for="seller-orders-status">Status</label>
			<select
				id="seller-orders-status"
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
		: 'Orders appear here the moment somebody buys something of yours.'}
>
	{#snippet head()}
		<th scope="col">Order</th>
		<th scope="col">Customer</th>
		<th scope="col">District</th>
		<th scope="col">Status</th>
		<th scope="col">Payment</th>
		<!-- What they sold, and what is left after the shop's cut. A seller
		     scanning this list is looking for the second number. -->
		<th scope="col" data-numeric>Sold for</th>
		<th scope="col" data-numeric>You get</th>
		<th scope="col">Placed</th>
		<th scope="col"><span class="sr-only">Actions</span></th>
	{/snippet}

	{#snippet row(order)}
		<tr>
			<td><a class="dk-num" href="/seller/orders/{order.id}">{order.order_number}</a></td>
			<td class="dk-strong">{order.recipient}</td>
			<td>{order.district_name}</td>
			<td><Status status={order.status} /></td>
			<td>
				{#if order.payment_method === 'cod'}
					<span class="dk-quiet">Cash on delivery</span>
				{:else}
					<Status status={order.payment_state} kind="payment" />
				{/if}
			</td>
			<td data-numeric class="dk-quiet">
				{formatMinor(order.subtotal_minor, order.currency)}
			</td>
			<td data-numeric class="dk-strong">
				{formatMinor(order.payable_minor, order.currency)}
			</td>
			<td class="dk-quiet">{formatRelativeTime(order.placed_at)}</td>
			<td class="right">
				<RowActions
					label="order {order.order_number}"
					items={[
						{
							label: 'View the order',
							icon: ViewIcon,
							href: `/seller/orders/${order.id}`
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
