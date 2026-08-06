<script lang="ts">
	import { enhance } from '$app/forms';
	import { announce } from '$lib/admin/announce';
	import { DeliveryTruck01Icon } from '@hugeicons/core-free-icons';
	import Seo from '$lib/seo/Seo.svelte';
	import { Button, Frame, Status } from '$lib/ui';
	import PageTop from '$lib/admin/PageTop.svelte';
	import { formatMinor } from '$lib/utils/money';
	import { formatDateTime, formatNumber } from '$lib/utils/format';

	let { data } = $props();

	const order = $derived(data.order);
	const canShip = $derived(['pending', 'confirmed', 'packed'].includes(order.status));
	const cod = $derived(order.payment_method === 'cod');
</script>

<Seo title="Order {order.order_number}" description="One order to send." noindex />

<PageTop trail={[{ label: 'Orders', href: '/seller/orders' }, { label: order.order_number }]}>
	{#snippet meta()}
		{formatDateTime(order.placed_at)} · <Status status={order.status} />
	{/snippet}

	{#snippet actions()}
		{#if canShip}
			<form method="POST" action="?/ship" use:enhance={announce('The courier has been booked.')}>
				<input type="hidden" name="note" value="" />
				<Button type="submit" icon={DeliveryTruck01Icon}>Book the courier</Button>
			</form>
		{/if}
	{/snippet}
</PageTop>

<!-- A failed booking is reported once, by the toast `announce` raises. A banner
     here as well would report one refusal twice, which reads as two. -->

<div class="cols">
	<div class="dk-stack">
		<Frame eyebrow="Items" title="What to pack" variant="pad">
			{#each order.lines as line, index (index)}
				<div class="line">
					<span>
						<span class="dk-strong">{line.title}</span>
						{#if line.variant_title}<span class="dk-quiet"> · {line.variant_title}</span>{/if}
						<span class="dk-quiet"> × {formatNumber(line.quantity)}</span>
					</span>
					<span class="amount">{formatMinor(line.line_total_minor, order.currency)}</span>
				</div>
			{/each}
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
	</div>

	<aside class="dk-stack">
		<Frame eyebrow="Money" title="What you get" variant="pad">
			<div class="row">
				<span>Sold for</span>
				<span class="amount">{formatMinor(order.subtotal_minor, order.currency)}</span>
			</div>
			<div class="row">
				<span class="dk-quiet">The shop's share</span>
				<span class="amount dk-quiet">
					−{formatMinor(order.commission_minor, order.currency)}
				</span>
			</div>
			<div class="row is-total">
				<span class="dk-strong">You get</span>
				<span class="amount dk-strong">{formatMinor(order.payable_minor, order.currency)}</span>
			</div>

			<!-- In this market the courier usually collects, so who is holding the
			     money is the thing a seller most needs to know — and the honest
			     answer is that being paid is not built yet. -->
			<p class="dk-hint">
				{#if cod}
					The courier collects the money and passes it to the shop. You are paid after that.
				{:else}
					The customer has paid the shop online. You are paid after the parcel arrives.
				{/if}
			</p>
		</Frame>

		<Frame eyebrow="Customer" title="Where it goes" variant="pad">
			<p class="addr">
				<span class="dk-strong">{order.recipient}</span><br />
				{order.phone}<br />
				{order.street}{#if order.area}, {order.area}{/if}<br />
				{order.thana}, {order.district_name}{#if order.postcode}
					— {order.postcode}{/if}
			</p>
			{#if order.note}
				<p class="note-from">“{order.note}”</p>
			{/if}
		</Frame>
	</aside>
</div>

<style>
	.cols {
		display: grid;
		gap: 14px;
		align-items: start;
	}

	.line,
	.row {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 16px;
		padding-block: 11px;
	}

	.line + .line {
		border-top: 1px solid var(--d-card);
	}

	.row {
		padding-block: 7px;
	}

	.is-total {
		margin-top: 4px;
		padding-top: 11px;
		border-top: 1px solid var(--d-edge);
	}

	.amount {
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
	}

	.ship-row {
		display: flex;
		align-items: center;
		gap: 12px;
		padding-block: 8px;
	}

	.addr {
		line-height: 1.7;
	}

	.note-from {
		margin-top: 12px;
		color: var(--d-faint);
		font-style: italic;
	}

	@media (min-width: 1000px) {
		.cols {
			grid-template-columns: minmax(0, 1fr) 340px;
		}
	}
</style>
