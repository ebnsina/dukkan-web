<script lang="ts">
	import { enhance } from '$app/forms';
	import Seo from '$lib/seo/Seo.svelte';
	import { Button, Dialog, Note } from '$lib/ui';
	import OrderStatus from '$lib/admin/OrderStatus.svelte';
	import { formatMinor } from '$lib/utils/money';
	import { formatDateTime, formatNumber } from '$lib/utils/format';

	let { data, form } = $props();

	const order = $derived(data.order);
	const canCancel = $derived(!['shipped', 'delivered', 'cancelled'].includes(order.status));

	let confirming = $state(false);
</script>

<Seo title="Order {order.number}" description="Order detail." noindex />

<a class="back t-button" href="/admin/orders">← All orders</a>

<div class="head">
	<div>
		<h1 class="t-heading">{order.number}</h1>
		<p class="placed t-mono">{formatDateTime(order.placed_at)}</p>
	</div>
	<div class="actions">
		{#if canCancel}
			<Button variant="ghost" onclick={() => (confirming = true)}>Cancel order</Button>
		{/if}
	</div>
</div>

{#if form?.message}
	<Note title="That did not work" tone="firm">{form.message}</Note>
{:else if form?.done}
	<Note title="Done">{form.done}</Note>
{/if}

<div class="cols">
	<div class="stack">
		<section>
			<h2 class="legend t-label">Items</h2>
			{#each order.packages as pack (pack.id)}
				<div class="pack">
					<div class="pack-head">
						<OrderStatus status={pack.status} emphasis />
						<form method="POST" action="?/ship" use:enhance>
							<input type="hidden" name="package_id" value={pack.id} />
							<input type="hidden" name="note" value="" />
							{#if ['pending', 'confirmed', 'packed'].includes(pack.status)}
								<button class="ship t-button" type="submit">Book the courier</button>
							{/if}
						</form>
					</div>
					{#each pack.lines as line, index (index)}
						<div class="line">
							<span>
								<span class="line-title">{line.title}</span>
								{#if line.variant_title}<span class="quiet"> · {line.variant_title}</span>{/if}
								<span class="quiet t-mono"> × {formatNumber(line.quantity)}</span>
							</span>
							<span class="amount t-mono">{formatMinor(line.line_total_minor, order.currency)}</span
							>
						</div>
					{/each}
				</div>
			{/each}
		</section>

		{#if order.events.length > 0}
			<section>
				<h2 class="legend t-label">History</h2>
				<ol class="events">
					{#each order.events as event, index (index)}
						<li>
							<span class="when t-mono">{formatDateTime(event.created_at)}</span>
							<span>{event.message ?? event.kind}</span>
							<span class="who t-label">{event.actor_type}</span>
						</li>
					{/each}
				</ol>
			</section>
		{/if}
	</div>

	<aside class="stack">
		<section class="panel">
			<h2 class="legend t-label">Money</h2>
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
			<p class="pay t-label">
				{order.payment_method === 'cod' ? 'Cash on delivery' : 'Paid online'} ·
				<OrderStatus status={order.payment_state} />
			</p>
		</section>

		<section class="panel">
			<h2 class="legend t-label">Customer</h2>
			<p class="addr">
				{order.recipient}<br />
				<span class="t-mono">{order.phone}</span><br />
				{#if order.email}{order.email}<br />{/if}
				{order.street}{#if order.area}, {order.area}{/if}<br />
				{order.thana}, {order.district_name}{#if order.postcode}
					— {order.postcode}{/if}
			</p>
			{#if order.note}
				<p class="note-from">“{order.note}”</p>
			{/if}
		</section>

		{#if order.shipments.length > 0}
			<section class="panel">
				<h2 class="legend t-label">Delivery</h2>
				{#each order.shipments as shipment, index (index)}
					<div class="ship-row">
						<span>{shipment.provider}</span>
						<OrderStatus status={shipment.status} emphasis />
						{#if shipment.tracking_code}
							<span class="quiet t-mono">{shipment.tracking_code}</span>
						{/if}
					</div>
				{/each}
			</section>
		{/if}
	</aside>
</div>

<Dialog bind:open={confirming} title="Cancel {order.number}?">
	<p>The customer will be told. Anything reserved goes back into stock.</p>
	{#snippet footer()}
		<Button variant="ghost" onclick={() => (confirming = false)}>Keep it</Button>
		<form
			method="POST"
			action="?/cancel"
			use:enhance={() =>
				async ({ update }) => {
					confirming = false;
					await update();
				}}
		>
			<input type="hidden" name="reason" value="Cancelled by the shop" />
			<Button type="submit">Cancel the order</Button>
		</form>
	{/snippet}
</Dialog>

<style>
	.back {
		display: inline-block;
		color: var(--faint);
		text-decoration: none;
		margin-bottom: 24px;
	}

	.back:hover {
		color: var(--ink);
	}

	.head {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-start;
		justify-content: space-between;
		gap: 16px;
		padding-bottom: 24px;
		border-bottom: 1px solid var(--rule-strong);
	}

	.placed {
		margin-top: 10px;
		font-size: 12px;
		color: var(--faint);
	}

	.cols {
		display: grid;
		gap: 40px;
		margin-top: 32px;
		align-items: start;
	}

	.stack {
		display: flex;
		flex-direction: column;
		gap: 36px;
	}

	.legend {
		color: var(--faint);
		padding-bottom: 12px;
		border-bottom: 1px solid var(--rule);
		margin-bottom: 4px;
	}

	.pack-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		padding-block: 14px;
		border-bottom: 1px solid var(--rule);
	}

	.ship {
		background: var(--inverse-paper);
		color: var(--inverse-ink);
		border: none;
		height: 32px;
		padding-inline: 14px;
		cursor: pointer;
	}

	.line {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 16px;
		padding-block: 12px;
		border-bottom: 1px solid var(--rule);
		font-size: 14px;
		color: var(--muted);
	}

	.line-title {
		color: var(--ink);
	}

	.amount {
		font-variant-numeric: tabular-nums;
		color: var(--ink);
		white-space: nowrap;
	}

	.quiet {
		color: var(--faint);
	}

	.events li {
		display: flex;
		flex-wrap: wrap;
		gap: 6px 18px;
		padding-block: 11px;
		border-bottom: 1px solid var(--rule);
		font-size: 14px;
		color: var(--muted);
	}

	.when {
		font-size: 12px;
		color: var(--faint);
		min-width: 160px;
	}

	.who {
		margin-left: auto;
		color: var(--faint);
	}

	.panel {
		background: var(--surface);
		padding: 20px;
	}

	.totals {
		display: flex;
		flex-direction: column;
		gap: 9px;
		margin-top: 14px;
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
		padding-top: 10px;
		border-top: 1px solid var(--rule-strong);
		font-weight: 600;
	}

	.grand dd {
		font-size: 18px;
	}

	.pay {
		margin-top: 16px;
		color: var(--faint);
	}

	.addr {
		margin-top: 14px;
		font-size: 14px;
		line-height: 1.7;
		color: var(--muted);
	}

	.note-from {
		margin-top: 14px;
		padding-left: 12px;
		border-left: 2px solid var(--rule-strong);
		font-size: 14px;
		line-height: 1.6;
		color: var(--muted);
	}

	.ship-row {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		align-items: baseline;
		margin-top: 14px;
		font-size: 14px;
		color: var(--muted);
	}

	@media (min-width: 1000px) {
		.cols {
			grid-template-columns: minmax(0, 1fr) 340px;
			gap: 56px;
		}
	}
</style>
