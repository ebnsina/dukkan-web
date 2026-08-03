<script lang="ts">
	import type { OrderDetail } from '$lib/api/types';
	import { formatMinor } from '$lib/utils/money';
	import { formatDateTime, formatNumber } from '$lib/utils/format';

	interface Props {
		order: OrderDetail;
	}

	let { order }: Props = $props();

	const PAYMENT: Record<string, string> = {
		cod: 'Cash on delivery',
		sslcommerz: 'Paid online'
	};
</script>

<div class="detail">
	<dl class="facts">
		<div>
			<dt class="t-label">Order</dt>
			<dd class="t-mono">{order.number}</dd>
		</div>
		<div>
			<dt class="t-label">Placed</dt>
			<dd class="t-mono">{formatDateTime(order.placed_at)}</dd>
		</div>
		<div>
			<dt class="t-label">Status</dt>
			<dd class="strong">{order.status}</dd>
		</div>
		<div>
			<dt class="t-label">Payment</dt>
			<dd>{PAYMENT[order.payment_method] ?? order.payment_method} · {order.payment_state}</dd>
		</div>
	</dl>

	{#each order.packages as pack (pack.id)}
		<div class="pack">
			{#each pack.lines as line, index (index)}
				<div class="line">
					<span class="line-title">
						{line.title}
						{#if line.variant_title}<span class="variant">{line.variant_title}</span>{/if}
						<span class="qty t-mono">× {formatNumber(line.quantity)}</span>
					</span>
					<span class="line-total t-mono">
						{formatMinor(line.line_total_minor, order.currency)}
					</span>
				</div>
			{/each}
		</div>
	{/each}

	<dl class="totals">
		<div>
			<dt>Subtotal</dt>
			<dd class="t-mono">{formatMinor(order.subtotal_minor, order.currency)}</dd>
		</div>
		<div>
			<dt>Delivery</dt>
			<dd class="t-mono">{formatMinor(order.shipping_minor, order.currency)}</dd>
		</div>
		{#if order.discount_minor > 0}
			<div>
				<dt>Discount</dt>
				<dd class="t-mono">−{formatMinor(order.discount_minor, order.currency)}</dd>
			</div>
		{/if}
		<div class="grand">
			<dt>Total</dt>
			<dd class="t-mono">{formatMinor(order.total_minor, order.currency)}</dd>
		</div>
	</dl>

	<div class="address">
		<h2 class="t-label">Delivering to</h2>
		<p>
			{order.recipient}<br />
			{order.street}{#if order.area}, {order.area}{/if}<br />
			{order.thana}, {order.district_name}{#if order.postcode}
				— {order.postcode}{/if}<br />
			<span class="t-mono">{order.phone}</span>
		</p>
	</div>

	{#if order.shipments.length > 0}
		<div class="shipments">
			<h2 class="t-label">Delivery</h2>
			{#each order.shipments as shipment, index (index)}
				<div class="line">
					<span>{shipment.provider} · {shipment.status}</span>
					{#if shipment.tracking_code}
						<span class="t-mono">{shipment.tracking_code}</span>
					{/if}
				</div>
			{/each}
		</div>
	{/if}

	{#if order.events.length > 0}
		<div class="events">
			<h2 class="t-label">History</h2>
			<ol>
				{#each order.events as event, index (index)}
					<li>
						<span class="when t-mono">{formatDateTime(event.created_at)}</span>
						<span class="what">{event.message ?? event.kind}</span>
					</li>
				{/each}
			</ol>
		</div>
	{/if}
</div>

<style>
	.detail {
		display: flex;
		flex-direction: column;
		gap: 36px;
	}

	.facts {
		display: grid;
		gap: 20px 32px;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		padding-bottom: 28px;
		border-bottom: 1px solid var(--rule-strong);
	}

	.facts dt {
		color: var(--faint);
		margin-bottom: 7px;
	}

	.facts dd {
		font-size: 14px;
	}

	.strong {
		font-weight: 600;
		text-transform: capitalize;
	}

	.line {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 16px;
		padding-block: 14px;
		border-bottom: 1px solid var(--rule);
		font-size: 14px;
	}

	.line-title {
		color: var(--ink);
	}

	.variant,
	.qty {
		color: var(--faint);
		font-size: 12px;
		margin-left: 8px;
	}

	.line-total {
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
	}

	.totals {
		display: flex;
		flex-direction: column;
		gap: 10px;
		max-width: 340px;
		margin-left: auto;
		width: 100%;
	}

	.totals > div {
		display: flex;
		justify-content: space-between;
		gap: 20px;
		font-size: 14px;
		color: var(--muted);
	}

	.totals dd {
		font-variant-numeric: tabular-nums;
		color: var(--ink);
	}

	.grand {
		padding-top: 12px;
		border-top: 1px solid var(--rule-strong);
		font-weight: 600;
	}

	.grand dd {
		font-size: 20px;
	}

	h2 {
		color: var(--faint);
		margin-bottom: 14px;
	}

	.address p {
		font-size: 14px;
		line-height: 1.7;
		color: var(--muted);
	}

	.events ol {
		border-top: 1px solid var(--rule);
	}

	.events li {
		display: flex;
		flex-wrap: wrap;
		gap: 6px 20px;
		padding-block: 12px;
		border-bottom: 1px solid var(--rule);
		font-size: 14px;
	}

	.when {
		color: var(--faint);
		font-size: 12px;
		min-width: 160px;
	}

	.what {
		color: var(--muted);
	}
</style>
