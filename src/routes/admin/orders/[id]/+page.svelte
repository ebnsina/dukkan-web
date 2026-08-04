<script lang="ts">
	import { enhance } from '$app/forms';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { ArrowLeft01Icon, Cancel01Icon, DeliveryTruck01Icon } from '@hugeicons/core-free-icons';
	import Seo from '$lib/seo/Seo.svelte';
	import { Banner, Button, Confirm, Frame, Status } from '$lib/ui';
	import { formatMinor } from '$lib/utils/money';
	import { formatDateTime, formatNumber } from '$lib/utils/format';

	let { data, form } = $props();

	const order = $derived(data.order);
	const canCancel = $derived(!['shipped', 'delivered', 'cancelled'].includes(order.status));

	let confirming = $state(false);
</script>

<Seo title="Order {order.number}" description="Order detail." noindex />

<a class="back" href="/admin/orders">
	<span aria-hidden="true"
		><HugeiconsIcon icon={ArrowLeft01Icon} size={15} strokeWidth={1.6} /></span
	>
	All orders
</a>

<div class="dk-title-row">
	<div>
		<h1 class="dk-h1">{order.number}</h1>
		<p class="dk-date">{formatDateTime(order.placed_at)}</p>
	</div>
	<div class="dk-acts">
		<Status status={order.status} />
		{#if canCancel}
			<Button variant="danger" icon={Cancel01Icon} onclick={() => (confirming = true)}>
				Cancel order
			</Button>
		{/if}
	</div>
</div>

{#if form?.message}
	<div class="msg"><Banner title="That did not work" tone="danger">{form.message}</Banner></div>
{:else if form?.done}
	<div class="msg"><Banner title="Done" tone="success">{form.done}</Banner></div>
{/if}

<div class="cols">
	<div class="dk-stack">
		<Frame eyebrow="Items" title="What was ordered" variant="pad">
			{#each order.packages as pack (pack.id)}
				<div class="pack">
					<div class="pack-head">
						<Status status={pack.status} />
						{#if ['pending', 'confirmed', 'packed'].includes(pack.status)}
							<form method="POST" action="?/ship" use:enhance>
								<input type="hidden" name="package_id" value={pack.id} />
								<input type="hidden" name="note" value="" />
								<Button type="submit" size="sm" icon={DeliveryTruck01Icon}>Book the courier</Button>
							</form>
						{/if}
					</div>
					{#each pack.lines as line, index (index)}
						<div class="line">
							<span>
								<span class="dk-strong">{line.title}</span>
								{#if line.variant_title}<span class="dk-quiet"> · {line.variant_title}</span>{/if}
								<span class="dk-quiet"> × {formatNumber(line.quantity)}</span>
							</span>
							<span class="amount">{formatMinor(line.line_total_minor, order.currency)}</span>
						</div>
					{/each}
				</div>
			{/each}
		</Frame>

		{#if order.events.length > 0}
			<Frame eyebrow="History" title="What has happened" variant="pad">
				<ol class="events">
					{#each order.events as event, index (index)}
						<li>
							<span class="when">{formatDateTime(event.created_at)}</span>
							<span>{event.message ?? event.kind}</span>
							<span class="who">{event.actor_type}</span>
						</li>
					{/each}
				</ol>
			</Frame>
		{/if}
	</div>

	<aside class="dk-stack">
		<Frame eyebrow="Money" title="What it comes to" variant="pad">
			<dl class="totals">
				<div>
					<dt>Subtotal</dt>
					<dd>{formatMinor(order.subtotal_minor, order.currency)}</dd>
				</div>
				<div>
					<dt>Delivery</dt>
					<dd>{formatMinor(order.shipping_minor, order.currency)}</dd>
				</div>
				{#if order.discount_minor > 0}
					<div>
						<dt>Discount</dt>
						<dd>−{formatMinor(order.discount_minor, order.currency)}</dd>
					</div>
				{/if}
				<div class="grand">
					<dt>Total</dt>
					<dd>{formatMinor(order.total_minor, order.currency)}</dd>
				</div>
			</dl>
			<p class="pay">
				<span class="dk-hint">
					{order.payment_method === 'cod' ? 'Cash on delivery' : 'Paid online'}
				</span>
				<Status status={order.payment_state} kind="payment" />
			</p>
		</Frame>

		<Frame eyebrow="Customer" title="Where it goes" variant="pad">
			<p class="addr">
				<span class="dk-strong">{order.recipient}</span><br />
				{order.phone}<br />
				{#if order.email}{order.email}<br />{/if}
				{order.street}{#if order.area}, {order.area}{/if}<br />
				{order.thana}, {order.district_name}{#if order.postcode}
					— {order.postcode}{/if}
			</p>
			{#if order.note}
				<p class="note-from">“{order.note}”</p>
			{/if}
		</Frame>

		{#if order.shipments.length > 0}
			<Frame eyebrow="Delivery" title="The parcel" variant="pad">
				{#each order.shipments as shipment, index (index)}
					<div class="ship-row">
						<span class="dk-strong">{shipment.provider}</span>
						<Status status={shipment.status} />
						{#if shipment.tracking_code}
							<span class="dk-num">{shipment.tracking_code}</span>
						{/if}
					</div>
				{/each}
			</Frame>
		{/if}
	</aside>
</div>

<Confirm bind:open={confirming} title="Cancel {order.number}?">
	The customer will be told. Anything reserved goes back into stock.
	{#snippet actions()}
		<Button variant="quiet" size="sm" onclick={() => (confirming = false)}>Keep it</Button>
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
			<Button type="submit" variant="danger" size="sm">Cancel the order</Button>
		</form>
	{/snippet}
</Confirm>

<style>
	.back {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		margin-bottom: 16px;
		font-size: 12.5px;
		color: var(--d-faint);
	}

	.back:hover {
		color: var(--d-ink);
	}

	.msg {
		margin-bottom: 14px;
	}

	.cols {
		display: grid;
		gap: 14px;
		align-items: start;
	}

	.pack + .pack {
		margin-top: 20px;
	}

	.pack-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		padding-bottom: 14px;
	}

	.line {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 16px;
		padding-block: 11px;
		border-top: 1px solid var(--d-card);
		color: var(--d-muted);
	}

	.amount {
		font-weight: 600;
		font-variant-numeric: tabular-nums;
		color: var(--d-ink);
		white-space: nowrap;
	}

	.events {
		display: flex;
		flex-direction: column;
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.events li {
		display: flex;
		flex-wrap: wrap;
		gap: 6px 18px;
		padding-block: 10px;
		color: var(--d-muted);
	}

	.events li + li {
		border-top: 1px solid var(--d-card);
	}

	.when {
		min-width: 150px;
		font-size: 12px;
		color: var(--d-faint);
		font-variant-numeric: tabular-nums;
	}

	.who {
		margin-left: auto;
		font-size: 12px;
		color: var(--d-faint);
	}

	.totals {
		display: flex;
		flex-direction: column;
		gap: 9px;
		margin: 0;
	}

	.totals > div {
		display: flex;
		justify-content: space-between;
		gap: 20px;
		color: var(--d-muted);
	}

	.totals dd {
		margin: 0;
		font-variant-numeric: tabular-nums;
		color: var(--d-ink);
	}

	.grand {
		padding-top: 10px;
		border-top: 1px solid var(--d-card);
		font-weight: 650;
	}

	.grand dd {
		font-size: 18px;
	}

	.pay {
		display: flex;
		align-items: center;
		gap: 10px;
		margin: 16px 0 0;
	}

	.addr {
		margin: 0;
		line-height: 1.7;
		color: var(--d-muted);
	}

	.note-from {
		margin: 14px 0 0;
		padding-left: 12px;
		border-left: 2px solid var(--d-edge);
		line-height: 1.6;
		color: var(--d-muted);
	}

	.ship-row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 12px;
		color: var(--d-muted);
	}

	.ship-row + .ship-row {
		margin-top: 12px;
	}

	@media (min-width: 1000px) {
		.cols {
			grid-template-columns: minmax(0, 1fr) 340px;
		}
	}
</style>
