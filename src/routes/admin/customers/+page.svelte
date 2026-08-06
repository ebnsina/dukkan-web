<script lang="ts">
	import Seo from '$lib/seo/Seo.svelte';
	import { UserIcon } from '@hugeicons/core-free-icons';
	import { Chip } from '$lib/ui';
	import DataTable from '$lib/admin/DataTable.svelte';
	import PageTop from '$lib/admin/PageTop.svelte';
	import RowActions from '$lib/admin/RowActions.svelte';
	import { formatMinor } from '$lib/utils/money';
	import { formatNumber, formatRelativeTime } from '$lib/utils/format';

	let { data } = $props();
</script>

<Seo title="Customers" description="Who buys from you." noindex />

<PageTop trail={[{ label: 'Customers' }]}>
	{#snippet filters()}
		<form method="GET" class="dk-filters">
			<label class="sr-only" for="customers-q">Search customers</label>
			<input
				id="customers-q"
				class="dk-input"
				type="search"
				name="q"
				value={data.filters.q}
				placeholder="Name or phone number"
			/>
		</form>
	{/snippet}
</PageTop>

<DataTable
	rows={data.customers}
	noun="customer"
	emptyTitle={data.filters.q ? 'Nobody matches' : 'Nobody yet'}
	emptyBody={data.filters.q
		? 'Try a different name or number, or clear the search.'
		: 'Customers appear here after their first order.'}
>
	{#snippet head()}
		<th scope="col">Name</th>
		<th scope="col">District</th>
		<th scope="col" data-numeric>Orders</th>
		<th scope="col" data-numeric>Spent</th>
		<th scope="col">Last order</th>
		<th scope="col"><span class="sr-only">Actions</span></th>
	{/snippet}

	{#snippet row(customer)}
		<tr>
			<td>
				<a class="dk-strong" href="/admin/customers/{encodeURIComponent(customer.phone)}">
					{customer.name}
				</a>
				<span class="sub">{customer.phone}</span>
			</td>
			<td>{customer.district}</td>
			<td data-numeric>
				{formatNumber(customer.order_count)}
				{#if customer.failed_count > 0}
					<Chip tone="warning" label="{formatNumber(customer.failed_count)} did not stick" />
				{/if}
			</td>
			<td data-numeric>{formatMinor(customer.spent_minor, customer.currency)}</td>
			<td>{formatRelativeTime(customer.last_order_at)}</td>
			<td class="right">
				<RowActions
					label={customer.name}
					items={[
						{
							label: 'View the customer',
							icon: UserIcon,
							href: `/admin/customers/${encodeURIComponent(customer.phone)}`
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

	.sub {
		display: block;
		margin-top: 3px;
		font-size: 12px;
		color: var(--d-faint);
	}
</style>
