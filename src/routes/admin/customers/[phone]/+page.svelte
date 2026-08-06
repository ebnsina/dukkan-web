<script lang="ts">
	import { ViewIcon } from '@hugeicons/core-free-icons';
	import Seo from '$lib/seo/Seo.svelte';
	import { Banner, Stat, Status } from '$lib/ui';
	import DataTable from '$lib/admin/DataTable.svelte';
	import PageTop from '$lib/admin/PageTop.svelte';
	import RowActions from '$lib/admin/RowActions.svelte';
	import { formatMinor } from '$lib/utils/money';
	import { formatDate, formatNumber, formatRelativeTime } from '$lib/utils/format';

	let { data } = $props();

	/* Cash on delivery means the shop pays the courier whether or not the parcel
	   is taken. A history of refusals is the one thing worth warning about. */
	const risky = $derived(data.customer.failed_count >= 2);
</script>

<Seo title={data.customer.name} description="One customer's history." noindex />

<!-- The name is shown exactly as the customer gave it, Bangla included. -->
<PageTop trail={[{ label: 'Customers', href: '/admin/customers' }, { label: data.customer.name }]}>
	{#snippet meta()}
		<a href="tel:{data.customer.phone}">{data.customer.phone}</a>
		· {data.customer.district}
		{#if data.customer.email}· {data.customer.email}{/if}
	{/snippet}
</PageTop>

{#if risky}
	<div class="msg">
		<Banner title="Take care with cash on delivery" tone="warning">
			{formatNumber(data.customer.failed_count)} of this customer's orders were cancelled or came back.
			Consider asking for payment up front.
		</Banner>
	</div>
{/if}

<div class="figures">
	<Stat label="Orders" value={formatNumber(data.customer.order_count)} />
	<Stat
		label="Spent"
		value={formatMinor(data.customer.spent_minor, data.customer.currency)}
		sub="Cancelled orders excluded"
	/>
	<Stat
		label="Did not stick"
		value={formatNumber(data.customer.failed_count)}
		sub="Cancelled or returned"
		tone={risky ? 'warning' : 'neutral'}
	/>
	<Stat
		label="First ordered"
		value={formatDate(data.customer.first_order_at)}
		sub={formatRelativeTime(data.customer.last_order_at) + ' most recently'}
	/>
</div>

<DataTable
	title="Every order"
	rows={data.orders}
	noun="order"
	emptyTitle="No orders"
	emptyBody="Nothing has been placed from this number."
>
	{#snippet head()}
		<th scope="col">Order</th>
		<th scope="col">Status</th>
		<th scope="col">Payment</th>
		<th scope="col" data-numeric>Total</th>
		<th scope="col">Placed</th>
		<th scope="col"><span class="sr-only">Actions</span></th>
	{/snippet}

	{#snippet row(order)}
		<tr>
			<td>
				<a class="dk-strong" href="/admin/orders/{order.id}">{order.number}</a>
			</td>
			<td><Status kind="order" status={order.status} /></td>
			<td><Status kind="payment" status={order.payment_state} /></td>
			<td data-numeric>{formatMinor(order.total_minor, order.currency)}</td>
			<td>{formatRelativeTime(order.placed_at)}</td>
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
	.msg {
		margin-bottom: 14px;
	}

	.right {
		text-align: right;
	}

	.figures {
		display: grid;
		gap: 12px;
		margin-bottom: 14px;
		grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
	}
</style>
