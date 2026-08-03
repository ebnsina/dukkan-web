<script lang="ts">
	import Seo from '$lib/seo/Seo.svelte';
	import { Button, Empty } from '$lib/ui';
	import OrderStatus from '$lib/admin/OrderStatus.svelte';
	import { formatMinor } from '$lib/utils/money';
	import { formatNumber, formatRelativeTime } from '$lib/utils/format';

	let { data } = $props();
</script>

<Seo title="Dashboard" description="Your shop today." noindex />

<h1 class="t-heading">Today</h1>

<dl class="figures">
	<div>
		<dt class="t-label">Orders</dt>
		<dd class="t-mono">{formatNumber(data.counts.total)}</dd>
	</div>
	<div>
		<dt class="t-label">Still open</dt>
		<dd class="t-mono">{formatNumber(data.counts.open)}</dd>
	</div>
	<div>
		<dt class="t-label">Cash to collect</dt>
		<dd class="t-mono">{formatMinor(data.owed)}</dd>
	</div>
	<div class:is-alarm={data.counts.critical > 0}>
		<dt class="t-label">Needs looking at</dt>
		<dd class="t-mono">{formatNumber(data.counts.critical)}</dd>
	</div>
</dl>

{#if data.issues.length > 0}
	<section class="block">
		<div class="block-head">
			<h2 class="t-sub">Money the courier owes you</h2>
			<Button href="/admin/reconciliation" variant="ghost" arrow>Open the list</Button>
		</div>
		<ul class="issues">
			{#each data.issues as issue (issue.id)}
				<li class:is-critical={issue.severity === 'critical'}>
					<span class="detail">{issue.detail}</span>
					{#if issue.expected_minor !== null || issue.actual_minor !== null}
						<span class="gap t-mono">
							{#if issue.expected_minor !== null && issue.actual_minor !== null}
								{formatMinor(Math.abs(issue.expected_minor - issue.actual_minor))}
							{:else}
								{formatMinor(issue.expected_minor ?? issue.actual_minor ?? 0)}
							{/if}
						</span>
					{/if}
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
		<div class="scroll">
			<table>
				<thead>
					<tr>
						<th scope="col">Order</th>
						<th scope="col">Customer</th>
						<th scope="col">District</th>
						<th scope="col">Status</th>
						<th scope="col" data-numeric>Total</th>
						<th scope="col">Placed</th>
					</tr>
				</thead>
				<tbody>
					{#each data.recent as order (order.id)}
						<tr>
							<td><a class="num t-mono" href="/admin/orders/{order.id}">{order.number}</a></td>
							<td>{order.recipient}</td>
							<td class="quiet">{order.district_name}</td>
							<td><OrderStatus status={order.status} emphasis /></td>
							<td data-numeric>{formatMinor(order.total_minor, order.currency)}</td>
							<td class="quiet when t-mono">{formatRelativeTime(order.placed_at)}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
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

	.figures > div {
		background: var(--paper);
		padding: 22px 24px;
	}

	.figures dt {
		color: var(--faint);
	}

	.figures dd {
		margin-top: 12px;
		font-size: 30px;
		font-weight: 500;
		letter-spacing: -0.03em;
		font-variant-numeric: tabular-nums;
	}

	/* No red available, so an alarming number gets an ink block instead. */
	.is-alarm {
		background: var(--inverse-paper) !important;
		color: var(--inverse-ink);
	}

	.is-alarm dt {
		color: var(--inverse-ink);
		opacity: 0.7;
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
		align-items: baseline;
		justify-content: space-between;
		gap: 20px;
		padding: 14px 0 14px 14px;
		border-bottom: 1px solid var(--rule);
		border-left: 1px solid transparent;
		font-size: 14px;
		color: var(--muted);
	}

	.is-critical {
		border-left: 3px solid var(--ink);
		padding-left: 12px;
		color: var(--ink);
		font-weight: 600;
	}

	.gap {
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
		color: var(--ink);
	}

	.scroll {
		overflow-x: auto;
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
		border-bottom: 1px solid var(--rule);
		white-space: nowrap;
	}

	td {
		padding: 14px 16px 14px 0;
		font-size: 14px;
		border-bottom: 1px solid var(--rule);
	}

	th[data-numeric],
	td[data-numeric] {
		text-align: right;
		font-family: var(--font-mono);
		font-variant-numeric: tabular-nums;
		font-feature-settings: 'zero' 1;
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
