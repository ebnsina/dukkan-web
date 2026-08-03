<script lang="ts">
	import Seo from '$lib/seo/Seo.svelte';
	import { Button, Empty, Table } from '$lib/ui';
	import Figure from '$lib/admin/Figure.svelte';
	import OrderStatus from '$lib/admin/OrderStatus.svelte';
	import StateChip from '$lib/admin/StateChip.svelte';
	import { severityTone, stockTone } from '$lib/admin/state';
	import { formatMinor } from '$lib/utils/money';
	import { formatNumber, formatRelativeTime } from '$lib/utils/format';

	let { data } = $props();

	const f = $derived(data.figures);

	// Cash the courier is holding, and anything critical, are the figures worth
	// a colour. The rest of the row stays neutral so those two carry.
	const codTone = $derived(f.outstanding_cod_minor > 0 ? 'warning' : 'neutral');
	const issueTone = $derived(
		f.critical_issues > 0 ? 'danger' : f.open_issues > 0 ? 'warning' : 'neutral'
	);
</script>

<Seo title="Dashboard" description="Your shop today." noindex />

<h1 class="t-heading">Today</h1>

<div class="figures">
	<Figure
		label="Orders today"
		value={formatNumber(f.orders_today)}
		note="{formatNumber(f.orders_this_month)} this month"
	/>
	<Figure
		label="Sales today"
		value={formatMinor(f.sales_today_minor, f.currency)}
		note="{formatMinor(f.sales_month_minor, f.currency)} this month"
	/>
	<Figure
		label="Cash with the courier"
		value={formatMinor(f.outstanding_cod_minor, f.currency)}
		note="{formatNumber(f.outstanding_parcels)} delivered, not yet paid over"
		tone={codTone}
		href="/admin/reconciliation"
	/>
	<Figure
		label="Needs looking at"
		value={formatNumber(f.critical_issues)}
		note="{formatNumber(f.open_issues)} open in total"
		tone={issueTone}
		href="/admin/reconciliation"
	/>
</div>

<div class="figures second">
	<Figure
		label="To confirm"
		value={formatNumber(f.awaiting_confirmation)}
		tone={f.awaiting_confirmation > 0 ? 'info' : 'neutral'}
		href="/admin/orders"
	/>
	<Figure
		label="To send"
		value={formatNumber(f.awaiting_dispatch)}
		tone={f.awaiting_dispatch > 0 ? 'warning' : 'neutral'}
		href="/admin/orders"
	/>
	<Figure
		label="On its way"
		value={formatNumber(f.in_transit)}
		tone={f.in_transit > 0 ? 'accent' : 'neutral'}
	/>
	<Figure
		label="Out of stock"
		value={formatNumber(f.out_of_stock)}
		note="{formatNumber(f.active_products)} items live"
		tone={f.out_of_stock > 0 ? 'danger' : 'neutral'}
		href="/admin/low-stock"
	/>
</div>

{#if data.issues.length > 0}
	<section class="block">
		<div class="block-head">
			<h2 class="t-sub">Money the courier owes you</h2>
			<Button href="/admin/reconciliation" variant="ghost" arrow>Open the list</Button>
		</div>
		<ul class="issues">
			{#each data.issues as issue (issue.id)}
				<li data-tone={severityTone(issue.severity)}>
					<StateChip tone={severityTone(issue.severity)} label={issue.severity} />
					<span class="detail">{issue.detail}</span>
					{#if issue.expected_minor !== null || issue.actual_minor !== null}
						<span class="gap t-mono">
							{#if issue.expected_minor !== null && issue.actual_minor !== null}
								{formatMinor(Math.abs(issue.expected_minor - issue.actual_minor), f.currency)}
							{:else}
								{formatMinor(issue.expected_minor ?? issue.actual_minor ?? 0, f.currency)}
							{/if}
						</span>
					{/if}
				</li>
			{/each}
		</ul>
	</section>
{/if}

{#if data.low.length > 0}
	<section class="block">
		<div class="block-head">
			<h2 class="t-sub">Running out</h2>
			<Button href="/admin/low-stock" variant="ghost" arrow>All of them</Button>
		</div>
		<ul class="issues">
			{#each data.low as item (item.variant_id)}
				<li data-tone={stockTone(item.available, item.threshold)}>
					<StateChip
						tone={stockTone(item.available, item.threshold)}
						label={item.available <= 0 ? 'Out' : 'Low'}
					/>
					<a class="detail link" href="/admin/products/{item.product_id}">
						{item.title}
						{#if item.variant_title || item.sku}
							<span class="quiet">· {item.variant_title ?? item.sku}</span>
						{/if}
					</a>
					<span class="gap t-mono">{formatNumber(item.available)} left</span>
				</li>
			{/each}
		</ul>
	</section>
{/if}

<section class="block">
	<div class="block-head">
		<h2 class="t-sub">Latest orders</h2>
		<Button href="/admin/orders" variant="ghost" arrow>All orders</Button>
	</div>

	{#if data.recent.length === 0}
		<Empty title="No orders yet" description="They will appear here the moment one comes in." />
	{:else}
		<Table>
			<thead>
				<tr>
					<th scope="col">Order</th>
					<th scope="col">Customer</th>
					<th scope="col">District</th>
					<th scope="col">Status</th>
					<th scope="col">Payment</th>
					<th scope="col" data-numeric>Total</th>
					<th scope="col">Placed</th>
				</tr>
			</thead>
			<tbody>
				{#each data.recent as order (order.id)}
					<tr>
						<td><a class="num t-mono" href="/admin/orders/{order.id}">{order.number}</a></td>
						<td class="ink">{order.recipient}</td>
						<td>{order.district_name}</td>
						<td><OrderStatus status={order.status} /></td>
						<td><OrderStatus status={order.payment_state} kind="payment" /></td>
						<td data-numeric>{formatMinor(order.total_minor, order.currency)}</td>
						<td class="when t-mono">{formatRelativeTime(order.placed_at)}</td>
					</tr>
				{/each}
			</tbody>
		</Table>
	{/if}
</section>

<style>
	.figures {
		display: grid;
		gap: 1px;
		background: var(--rule);
		border: 1px solid var(--rule);
		margin-top: 32px;
	}

	.second {
		margin-top: 1px;
		border-top: none;
	}

	.block {
		margin-top: 56px;
	}

	.block-head {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		justify-content: space-between;
		gap: 16px;
		padding-bottom: 16px;
		border-bottom: 1px solid var(--rule-strong);
	}

	.issues li {
		display: flex;
		align-items: center;
		gap: 16px;
		padding: 13px 0 13px 14px;
		border-bottom: 1px solid var(--rule);
		border-left: 3px solid transparent;
		font-size: 14px;
		color: var(--muted);
	}

	.issues li[data-tone='danger'] {
		border-left-color: var(--danger);
	}
	.issues li[data-tone='warning'] {
		border-left-color: var(--warning);
	}
	.issues li[data-tone='info'] {
		border-left-color: var(--info);
	}

	.detail {
		flex: 1;
		min-width: 0;
	}

	.link {
		color: var(--ink);
		text-decoration: none;
	}

	.link:hover {
		color: var(--accent);
	}

	.quiet {
		color: var(--faint);
	}

	.gap {
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
		color: var(--ink);
	}

	.ink {
		color: var(--ink);
	}

	.num {
		color: var(--ink);
		text-decoration: none;
		border-bottom: 1px solid var(--rule-strong);
	}

	.num:hover {
		color: var(--accent);
		border-bottom-color: var(--accent);
	}

	.when {
		font-size: 12px;
		white-space: nowrap;
		color: var(--faint);
	}

	@media (min-width: 640px) {
		.figures {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (min-width: 1000px) {
		.figures {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}
	}
</style>
