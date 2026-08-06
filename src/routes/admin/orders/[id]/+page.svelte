<script lang="ts">
	import { enhance } from '$app/forms';
	import { announce } from '$lib/admin/announce';
	import {
		ArrowTurnBackwardIcon,
		Cancel01Icon,
		DeliveryTruck01Icon,
		PrinterIcon
	} from '@hugeicons/core-free-icons';
	import Seo from '$lib/seo/Seo.svelte';
	import { Button, Confirm, Field, Frame, Status } from '$lib/ui';
	import DataTable from '$lib/admin/DataTable.svelte';
	import PageTop from '$lib/admin/PageTop.svelte';
	import PageActions from '$lib/admin/PageActions.svelte';
	import FormSheet from '$lib/admin/FormSheet.svelte';
	import OrderTotals from '$lib/shop/OrderTotals.svelte';
	import { formatMinor } from '$lib/utils/money';
	import { formatDateTime, formatNumber } from '$lib/utils/format';

	let { data } = $props();

	const order = $derived(data.order);
	const canCancel = $derived(!['shipped', 'delivered', 'cancelled'].includes(order.status));

	/* Nothing came in on a pending or failed order, so there is nothing to give
	   back; once the whole total is returned there is nothing left either. */
	const canRefund = $derived(
		['paid', 'partially_refunded'].includes(order.payment_state) &&
			order.refunded_minor < order.total_minor
	);

	const METHOD: Record<string, string> = {
		cash: 'Cash',
		bkash: 'bKash',
		nagad: 'Nagad',
		bank: 'Bank transfer',
		gateway: 'Through the gateway',
		manual: 'Some other way'
	};

	let confirming = $state(false);
	let refunding = $state(false);
</script>

<Seo title="Order {order.number}" description="Order detail." noindex />

<PageTop trail={[{ label: 'Orders', href: '/admin/orders' }, { label: order.number }]}>
	<!-- The status is what the order *is*, not something you can do to it, so it
	     stays here rather than joining the menu. -->
	{#snippet meta()}
		{formatDateTime(order.placed_at)} · <Status status={order.status} />
	{/snippet}

	{#snippet actions()}
		<PageActions
			label="order {order.number}"
			items={[
				{
					label: 'Invoice',
					description: 'Open a printable copy to put in the parcel.',
					icon: PrinterIcon,
					href: `/admin/orders/${order.id}/invoice`
				},
				...(canCancel
					? [
							{
								label: 'Cancel order',
								description: 'The customer is told and anything reserved goes back into stock.',
								icon: Cancel01Icon,
								danger: true,
								onselect: () => (confirming = true)
							}
						]
					: [])
			]}
		/>
	{/snippet}
</PageTop>

<div class="cols">
	<div class="dk-stack">
		<Frame eyebrow="Items" title="What was ordered" variant="pad">
			{#each order.packages as pack (pack.id)}
				<div class="pack">
					<div class="pack-head">
						<Status status={pack.status} />
						{#if ['pending', 'confirmed', 'packed'].includes(pack.status)}
							<form
								method="POST"
								action="?/ship"
								use:enhance={announce('The courier has been booked.')}
							>
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

		{#if canRefund || data.refunds.length > 0}
			{#if canRefund}
				<div class="dk-acts">
					<Button
						size="sm"
						variant="quiet"
						icon={ArrowTurnBackwardIcon}
						onclick={() => (refunding = true)}
					>
						Record a refund
					</Button>
				</div>
			{/if}

			<DataTable
				title="Money given back"
				rows={data.refunds}
				noun="refund"
				paged={false}
				emptyTitle="Nothing given back"
				emptyBody="Give the money back in your gateway or in cash first, then write it down here so the order stops reading as fully paid."
			>
				{#snippet head()}
					<th scope="col" data-numeric>Amount</th>
					<th scope="col">How</th>
					<th scope="col">Why</th>
					<th scope="col">Their reference</th>
					<th scope="col">When</th>
				{/snippet}

				{#snippet row(refund)}
					<tr>
						<td data-numeric>{formatMinor(refund.amount_minor, refund.currency)}</td>
						<td>{METHOD[refund.method] ?? refund.method}</td>
						<td>{refund.reason}</td>
						<td class="dk-num">{refund.reference || '—'}</td>
						<td class="dk-quiet">{formatDateTime(refund.created_at)}</td>
					</tr>
				{/snippet}
			</DataTable>

			{#if data.refunds.length > 0}
				<p class="dk-hint">
					{formatMinor(order.refunded_minor, order.currency)} of
					{formatMinor(order.total_minor, order.currency)} returned.
				</p>
			{/if}
		{/if}

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
			<OrderTotals {order} />
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

{#if canRefund}
	<FormSheet
		bind:open={refunding}
		title="Record a refund"
		description="Give the money back in your gateway or in cash first, then write it down here so the order stops reading as fully paid."
		action="?/refund"
		saved="The refund is recorded."
	>
		<Field label="How much, in taka" required>
			{#snippet control(props)}
				<input {...props} class="dk-input" name="amount" inputmode="decimal" required />
			{/snippet}
		</Field>
		<Field label="How you returned it" required>
			{#snippet control(props)}
				<select {...props} class="dk-select" name="method" required>
					<option value="cash">Cash</option>
					<option value="bkash">bKash</option>
					<option value="nagad">Nagad</option>
					<option value="bank">Bank transfer</option>
					<option value="gateway">Through the payment gateway</option>
					<option value="manual">Some other way</option>
				</select>
			{/snippet}
		</Field>
		<Field label="Their reference" hint="Optional — the transaction number.">
			{#snippet control(props)}
				<input {...props} class="dk-input" name="reference" />
			{/snippet}
		</Field>
		<Field label="Why" required>
			{#snippet control(props)}
				<input {...props} class="dk-input" name="reason" required />
			{/snippet}
		</Field>
	</FormSheet>
{/if}

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
