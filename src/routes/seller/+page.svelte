<script lang="ts">
	/* An overview and nothing else — the same rule the shop owner's landing page
	   follows. Two questions: what is waiting on me, and what am I owed. Every
	   figure is a door to the page that owns the detail behind it. */
	import Seo from '$lib/seo/Seo.svelte';
	import { Banner, Button, Frame, Stat, Status } from '$lib/ui';
	import PageTop from '$lib/admin/PageTop.svelte';
	import { formatMinor } from '$lib/utils/money';
	import { formatDate, formatNumber, formatRelativeTime } from '$lib/utils/format';

	const METHOD: Record<string, string> = {
		bkash: 'bKash',
		nagad: 'Nagad',
		bank: 'Bank transfer',
		cash: 'Cash',
		other: 'Some other way'
	};

	let { data } = $props();

	const owed = $derived(data.owed);
	const waiting = $derived(data.waiting);
</script>

<Seo title="Overview" description="Your shop today." noindex />

<PageTop trail={[{ label: 'Overview' }]}>
	{#snippet meta()}{data.seller?.name}{/snippet}

	{#snippet actions()}
		<Button href="/seller/orders">See all orders</Button>
	{/snippet}
</PageTop>

<section class="dk-stats">
	<Stat
		label="To send"
		value={formatNumber(owed.open_packages)}
		sub={owed.open_packages === 1 ? 'parcel waiting' : 'parcels waiting'}
		tone={owed.open_packages > 0 ? 'warning' : 'neutral'}
		href="/seller/orders?status=pending"
	/>
	<Stat
		label="Still on its way"
		value={formatMinor(owed.open_minor, owed.currency)}
		sub="not delivered yet"
	/>
	<Stat
		label="Delivered"
		value={formatMinor(owed.delivered_minor, owed.currency)}
		sub="arrived with the customer"
	/>
</section>

<!-- The balance is the shop's own ledger: everything delivered and remitted,
     less everything they have already sent you. The shop pays by bKash, Nagad
     or bank — Dukkàn never moves the money — so this says what is outstanding
     rather than pretending a transfer is on its way. -->
<div class="msg">
	{#if data.balanceMinor > 0}
		<Banner title="{formatMinor(data.balanceMinor, owed.currency)} is owed to you" tone="info">
			The shop sends this themselves. Anything they have already sent is listed below.
		</Banner>
	{:else if data.payouts.length > 0}
		<Banner title="You are settled up" tone="success">
			Everything delivered so far has been paid.
		</Banner>
	{/if}
</div>

{#if data.payouts.length > 0}
	<Frame eyebrow="Payments" title="What the shop has sent you" variant="pad">
		{#each data.payouts.slice(0, 6) as payment (payment.id)}
			<div class="row">
				<span class="what">
					<span class="dk-strong">{formatMinor(payment.amount_minor, owed.currency)}</span>
					<span class="dk-quiet">
						{METHOD[payment.method] ?? payment.method}{#if payment.reference}
							· {payment.reference}{/if}
					</span>
				</span>
				<span class="when dk-quiet">{formatDate(payment.paid_on)}</span>
			</div>
		{/each}
	</Frame>
{/if}

<Frame eyebrow="Orders" title="Waiting on you" variant="pad">
	{#if waiting.length === 0}
		<p class="dk-note">Nothing to pack. Anything new will show up here.</p>
	{:else}
		{#each waiting as order (order.id)}
			<a class="row" href="/seller/orders/{order.id}">
				<span class="what">
					<span class="dk-num">{order.order_number}</span>
					<span class="dk-quiet">
						{order.recipient} · {order.district_name} ·
						{formatNumber(order.item_count)}
						{order.item_count === 1 ? 'item' : 'items'}
					</span>
				</span>
				<Status status={order.status} />
				<span class="amount dk-strong">
					{formatMinor(order.payable_minor, order.currency)}
				</span>
				<span class="when dk-quiet">{formatRelativeTime(order.placed_at)}</span>
			</a>
		{/each}
	{/if}
</Frame>

<style>
	.msg {
		margin-block: 14px;
	}

	.row {
		display: flex;
		align-items: center;
		gap: 16px;
		padding-block: 12px;
	}

	.row + .row {
		border-top: 1px solid var(--d-card);
	}

	.what {
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-width: 0;
		flex: 1;
	}

	.amount {
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
	}

	.when {
		min-width: 90px;
		text-align: right;
	}
</style>
