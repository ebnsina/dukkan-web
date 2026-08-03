<script lang="ts">
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import {
		PackageIcon,
		Store01Icon,
		MoneyBag02Icon,
		Settings02Icon
	} from '@hugeicons/core-free-icons';
	import { formatCurrency, formatNumber, formatRelativeTime } from '$lib/utils/format';

	const nav = [
		{ icon: PackageIcon, label: 'Orders', current: true },
		{ icon: Store01Icon, label: 'Products', current: false },
		{ icon: MoneyBag02Icon, label: 'Payouts', current: false },
		{ icon: Settings02Icon, label: 'Settings', current: false }
	];

	const now = Date.now();
	const orders = [
		{
			ref: 'DK-10482',
			shop: 'নকশী হোম',
			district: 'Dhanmondi',
			paid: 'bKash',
			total: 4250,
			status: 'Delivered',
			at: now - 4 * 60_000
		},
		{
			ref: 'DK-10481',
			shop: 'Dhaka Threads',
			district: 'Mirpur',
			paid: 'Cash',
			total: 18900,
			status: 'Out for delivery',
			at: now - 26 * 60_000
		},
		{
			ref: 'DK-10480',
			shop: 'চট্টগ্রাম চা ঘর',
			district: 'Agrabad',
			paid: 'Nagad',
			total: 1120,
			status: 'Picked up',
			at: now - 95 * 60_000
		},
		{
			ref: 'DK-10479',
			shop: 'Sylhet Spice Co',
			district: 'Zindabazar',
			paid: 'Cash',
			total: 7640,
			status: 'Delivered',
			at: now - 3 * 3_600_000
		},
		{
			ref: 'DK-10478',
			shop: 'রংপুর ক্রাফটস',
			district: 'Rangpur Sadar',
			paid: 'bKash',
			total: 2380,
			status: 'Packed',
			at: now - 5 * 3_600_000
		}
	];

	const today = orders.reduce((sum, order) => sum + order.total, 0);
</script>

<figure class="board">
	<figcaption class="caption t-label">Vendor dashboard &mdash; sample data</figcaption>

	<div class="frame">
		<nav class="rail" aria-label="Dashboard sections (sample)">
			<span class="rail-head t-label">Marketplace</span>
			<ul>
				{#each nav as item (item.label)}
					<li>
						<span class="rail-item" class:is-current={item.current}>
							<HugeiconsIcon icon={item.icon} size={15} strokeWidth={1.6} />
							{item.label}
						</span>
					</li>
				{/each}
			</ul>
			<div class="rail-foot">
				<span class="t-label">Today</span>
				<span class="rail-total t-mono">{formatCurrency(today)}</span>
				<span class="t-label">{formatNumber(orders.length)} orders</span>
			</div>
		</nav>

		<div class="panel">
			<div class="panel-head">
				<h3 class="t-sub">Orders</h3>
				<span class="panel-meta t-label">
					{formatNumber(orders.length)} of {formatNumber(1284)}
				</span>
			</div>

			<div class="scroll">
				<table>
					<thead>
						<tr>
							<th scope="col">Order</th>
							<th scope="col">Shop</th>
							<th scope="col" class="col-pay">Paid with</th>
							<th scope="col" data-numeric>Amount</th>
							<th scope="col" class="col-status">Status</th>
							<th scope="col" class="col-time">Placed</th>
						</tr>
					</thead>
					<tbody>
						{#each orders as order (order.ref)}
							<tr>
								<td class="ref t-mono">{order.ref}</td>
								<td>
									<span class="shop">{order.shop}</span>
									<span class="district">{order.district}</span>
								</td>
								<td class="col-pay"><span class="tag t-button">{order.paid}</span></td>
								<td data-numeric>{formatCurrency(order.total)}</td>
								<td class="col-status status">{order.status}</td>
								<td class="col-time when t-mono">{formatRelativeTime(order.at)}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
</figure>

<style>
	.caption {
		display: block;
		margin-bottom: 16px;
		color: var(--faint);
	}

	/* Framed with a hairline, never lifted with a shadow. */
	.frame {
		display: grid;
		border: 1px solid var(--rule-strong);
		background: var(--paper);
	}

	.rail {
		display: flex;
		flex-direction: column;
		gap: 24px;
		padding: 20px;
		background: var(--surface);
	}

	.rail-head {
		color: var(--faint);
	}

	.rail ul {
		display: flex;
		flex-wrap: wrap;
		gap: 4px 20px;
	}

	.rail-item {
		display: inline-flex;
		align-items: center;
		gap: 9px;
		padding-block: 7px;
		font-size: 14px;
		color: var(--muted);
	}

	/* Current item marked by weight and a rule, not a fill. */
	.is-current {
		color: var(--ink);
		font-weight: 600;
		box-shadow: none;
		border-bottom: 1px solid var(--ink);
	}

	.rail-foot {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 4px 12px;
		padding-top: 20px;
		border-top: 1px solid var(--rule-strong);
		color: var(--faint);
	}

	.rail-total {
		font-size: 19px;
		font-weight: 500;
		color: var(--ink);
		font-variant-numeric: tabular-nums;
		letter-spacing: -0.02em;
	}

	.panel-head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 16px;
		padding: 18px 20px;
		border-bottom: 1px solid var(--rule-strong);
	}

	.panel-meta {
		color: var(--faint);
	}

	.scroll {
		overflow-x: auto;
	}

	table {
		width: 100%;
		border-collapse: collapse;
	}

	th {
		padding: 10px 20px;
		text-align: left;
		font-family: var(--font-mono);
		font-size: 10.5px;
		font-weight: 400;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--faint);
		border-bottom: 1px solid var(--rule);
		white-space: nowrap;
	}

	td {
		padding: 14px 20px;
		font-size: 14px;
		color: var(--muted);
		border-bottom: 1px solid var(--rule);
		vertical-align: middle;
	}

	tbody tr:last-child td {
		border-bottom: none;
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

	.ref {
		font-size: 13px;
		color: var(--faint);
		white-space: nowrap;
	}

	.shop {
		display: block;
		color: var(--ink);
		font-weight: 600;
	}

	.district {
		display: block;
		margin-top: 2px;
		font-size: 12px;
		color: var(--faint);
	}

	.tag {
		display: inline-flex;
		align-items: center;
		height: 22px;
		padding-inline: 8px;
		border: 1px solid var(--rule-strong);
		color: var(--muted);
	}

	.status {
		white-space: nowrap;
		color: var(--ink);
	}

	.when {
		font-size: 13px;
		color: var(--faint);
		white-space: nowrap;
	}

	/* Reflow by dropping columns, never by scaling into illegibility. */
	@media (max-width: 899px) {
		.col-pay,
		.col-status {
			display: none;
		}
	}

	@media (max-width: 600px) {
		.col-time {
			display: none;
		}
	}

	@media (min-width: 900px) {
		.frame {
			grid-template-columns: 208px minmax(0, 1fr);
		}

		.rail {
			border-right: 1px solid var(--rule-strong);
		}

		.rail ul {
			flex-direction: column;
			gap: 2px;
			flex: 1;
		}

		.rail-item {
			display: flex;
		}

		.rail-foot {
			flex-direction: column;
			gap: 6px;
		}
	}
</style>
