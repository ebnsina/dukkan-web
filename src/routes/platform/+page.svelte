<script lang="ts">
	import Seo from '$lib/seo/Seo.svelte';
	import { Store01Icon } from '@hugeicons/core-free-icons';
	import { Chip, Stat } from '$lib/ui';
	import DataTable from '$lib/admin/DataTable.svelte';
	import PageTop from '$lib/admin/PageTop.svelte';
	import RowActions from '$lib/admin/RowActions.svelte';
	import { formatMinor } from '$lib/utils/money';
	import { formatNumber, formatRelativeTime } from '$lib/utils/format';
	import { SHOP_STATE } from '$lib/platform/state';

	let { data } = $props();

	/* A shop with no order in a fortnight is the one worth a phone call, and it
	   is invisible in a list sorted by when it signed up. */
	const QUIET_DAYS = 14;
	const quiet = $derived(
		data.shops.filter((s) => {
			if (s.status !== 'active' && s.status !== 'trialing') return false;
			if (!s.last_order_at) return true;
			return Date.now() - new Date(s.last_order_at).getTime() > QUIET_DAYS * 86_400_000;
		})
	);
	const behind = $derived(data.shops.filter((s) => s.status === 'past_due'));
	const revenue = $derived(data.shops.reduce((sum, s) => sum + s.revenue_minor, 0));

	const STATUSES = [
		{ value: '', word: 'Any status' },
		{ value: 'trialing', word: 'Trialing' },
		{ value: 'active', word: 'Active' },
		{ value: 'past_due', word: 'Behind on payment' },
		{ value: 'suspended', word: 'Suspended' },
		{ value: 'cancelled', word: 'Cancelled' }
	];
</script>

<Seo title="Shops" description="Internal." noindex />

<PageTop trail={[{ label: 'Shops' }]}>
	{#snippet filters()}
		<form method="GET" class="dk-filters">
			<label class="sr-only" for="shops-q">Search shops</label>
			<input
				id="shops-q"
				class="dk-input"
				type="search"
				name="q"
				value={data.filters.q}
				placeholder="Address or name"
			/>
			<label class="sr-only" for="shops-status">Status</label>
			<select
				id="shops-status"
				class="dk-select"
				name="status"
				onchange={(e) => e.currentTarget.form?.requestSubmit()}
				value={data.filters.status}
			>
				{#each STATUSES as s (s.value)}
					<option value={s.value}>{s.word}</option>
				{/each}
			</select>
		</form>
	{/snippet}
</PageTop>

<section class="dk-stats">
	<Stat label="Shops" value={formatNumber(data.shops.length)} sub="on this box" />
	<Stat
		label="Behind on payment"
		value={formatNumber(behind.length)}
		sub="still open, still selling"
		tone={behind.length > 0 ? 'warning' : 'neutral'}
	/>
	<Stat
		label="Gone quiet"
		value={formatNumber(quiet.length)}
		sub="no order in {QUIET_DAYS} days"
		tone={quiet.length > 0 ? 'warning' : 'neutral'}
	/>
	<Stat label="Sold through us" value={formatMinor(revenue)} sub="all shops, all time" />
</section>

<DataTable
	rows={data.shops}
	noun="shop"
	emptyTitle="Nothing matches"
	emptyBody="Try a different search, or clear it."
>
	{#snippet head()}
		<th scope="col">Shop</th>
		<th scope="col">Status</th>
		<th scope="col">Plan</th>
		<th scope="col" data-numeric>Items</th>
		<th scope="col" data-numeric>Orders</th>
		<th scope="col" data-numeric>Sold</th>
		<th scope="col">Last order</th>
		<th scope="col"><span class="sr-only">Actions</span></th>
	{/snippet}

	{#snippet row(shop)}
		{@const state = SHOP_STATE[shop.status]}
		<tr>
			<td>
				<a class="dk-strong" href="/platform/shops/{shop.id}">{shop.name}</a>
				<span class="sub">
					{shop.slug}{#if shop.shop_mode === 'marketplace'}
						· marketplace{/if}
				</span>
			</td>
			<td><Chip tone={state.tone} label={state.word} /></td>
			<td>{shop.plan_name}</td>
			<td data-numeric>{formatNumber(shop.products)}</td>
			<td data-numeric>
				{formatNumber(shop.orders_total)}
				{#if shop.orders_this_month > 0}
					<span class="sub">{formatNumber(shop.orders_this_month)} this month</span>
				{/if}
			</td>
			<td data-numeric>{formatMinor(shop.revenue_minor)}</td>
			<td>
				{shop.last_order_at ? formatRelativeTime(shop.last_order_at) : 'never'}
			</td>
			<td class="right">
				<RowActions
					label={shop.name}
					items={[
						{
							label: 'Open the shop',
							icon: Store01Icon,
							href: `/platform/shops/${shop.id}`
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
