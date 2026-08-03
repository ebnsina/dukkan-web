<script lang="ts">
	/* The dashboard answers three questions in the order a shop owner asks them:
	   did we sell, is any money missing, what needs doing. */
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import {
		Alert02Icon,
		ArrowRight01Icon,
		DeliveryTruck01Icon,
		FileImportIcon,
		PackageIcon,
		PlusSignIcon,
		Wallet01Icon
	} from '@hugeicons/core-free-icons';
	import Seo from '$lib/seo/Seo.svelte';
	import { Banner, Button, Empty, Frame, Stat, Status } from '$lib/admin/ui';
	import { severityTone, stockTone } from '$lib/admin/state';
	import { formatMinor } from '$lib/utils/money';
	import { formatNumber, formatRelativeTime } from '$lib/utils/format';

	let { data } = $props();

	const stroke = 1.6;
	const f = $derived(data.figures);

	const today = new Intl.DateTimeFormat('en-GB', {
		weekday: 'long',
		day: 'numeric',
		month: 'long'
	}).format(new Date());

	// Anything critical is worth a colour; the rest of the row stays neutral so
	// that one carries.
	const issueTone = $derived(f.critical_issues > 0 ? 'danger' : 'warning');

	// Orders in flight, as a share of each other. A proportion reads faster than
	// three counts sitting side by side do.
	const pipeline = $derived([
		{ name: 'To confirm', count: f.awaiting_confirmation },
		{ name: 'To send', count: f.awaiting_dispatch },
		{ name: 'On its way', count: f.in_transit }
	]);
	const inFlight = $derived(pipeline.reduce((sum, stage) => sum + stage.count, 0));
</script>

<Seo title="Dashboard" description="Your shop today." noindex />

<div class="dk-title-row">
	<div>
		<h1 class="dk-h1">Today</h1>
		<p class="dk-date">{today}</p>
	</div>
	<div class="dk-acts">
		<Button href="/admin/products/new" icon={PlusSignIcon}>Add product</Button>
	</div>
</div>

<!-- Did we sell, and what is waiting. Four plain figures before anything with
     an opinion about them. -->
<section class="dk-stats">
	<Stat
		label="Orders today"
		value={formatNumber(f.orders_today)}
		sub="{formatNumber(f.orders_this_month)} this month"
	/>
	<Stat
		label="Sales today"
		value={formatMinor(f.sales_today_minor, f.currency)}
		sub="{formatMinor(f.sales_month_minor, f.currency)} this month"
	/>
	<Stat
		label="To confirm"
		value={formatNumber(f.awaiting_confirmation)}
		sub="waiting on you"
		tone={f.awaiting_confirmation > 0 ? 'info' : 'neutral'}
		href="/admin/orders?status=placed"
	/>
	<Stat
		label="To send"
		value={formatNumber(f.awaiting_dispatch)}
		sub="ready for a courier"
		tone={f.awaiting_dispatch > 0 ? 'warning' : 'neutral'}
		href="/admin/orders?status=confirmed"
	/>
</section>

<div class="dk-grid-2">
	<!-- The figure nothing else can tell a shop owner, given the space a hero
	     image would have had. -->
	<Frame eyebrow="Owed to you" variant="pad">
		<span class="dk-kicker">Cash with couriers</span>
		<span class="dk-big">{formatMinor(f.outstanding_cod_minor, f.currency)}</span>
		<p class="dk-note">
			Collected from customers and not yet paid over to you. Chase anything older than a week.
		</p>

		<div class="dk-acts">
			<Button href="/admin/reconciliation" icon={Wallet01Icon}>Open money owed</Button>
			<Button href="/admin/reconciliation" variant="quiet" icon={FileImportIcon}>
				Import a statement
			</Button>
		</div>

		{#snippet footer()}
			<span class="dk-metrics">
				<span>
					<HugeiconsIcon icon={DeliveryTruck01Icon} size={15} strokeWidth={stroke} />
					{formatNumber(f.outstanding_parcels)}
					{f.outstanding_parcels === 1 ? 'parcel' : 'parcels'}
				</span>
				<span>
					<HugeiconsIcon icon={Alert02Icon} size={15} strokeWidth={stroke} />
					{formatNumber(f.critical_issues)} need chasing
				</span>
			</span>
		{/snippet}
	</Frame>

	<Frame
		eyebrow="Today"
		title="Recent orders"
		action="View all"
		actionHref="/admin/orders"
		variant="rows"
	>
		{#if data.recent.length === 0}
			<Empty title="No orders yet" description="They will appear here the moment one comes in." />
		{:else}
			{#each data.recent.slice(0, 5) as order (order.id)}
				<a class="dk-row" href="/admin/orders/{order.id}">
					<span class="dk-row-main">
						<span class="dk-row-title">{order.recipient}</span>
						<span class="dk-row-meta">
							{order.number} · {order.district_name} · {formatRelativeTime(order.placed_at)}
						</span>
					</span>
					<span class="dk-row-amt">{formatMinor(order.total_minor, order.currency)}</span>
					<Status status={order.status} />
					<span class="dk-go" aria-hidden="true">
						<HugeiconsIcon icon={ArrowRight01Icon} size={15} strokeWidth={stroke} />
					</span>
				</a>
			{/each}
		{/if}
	</Frame>
</div>

<div class="dk-grid-3">
	<Frame
		eyebrow="Reconciliation"
		title="Needs a person"
		action="{formatNumber(f.open_issues)} open"
		actionHref="/admin/reconciliation"
	>
		{#if data.issues.length === 0}
			<Empty title="Nothing to chase" description="Every statement so far has added up." />
		{:else}
			<div>
				{#each data.issues.slice(0, 3) as issue (issue.id)}
					<a class="dk-mini" href="/admin/reconciliation">
						<span class="dk-sq" aria-hidden="true" data-tone={severityTone(issue.severity)}>
							<HugeiconsIcon icon={Alert02Icon} size={15} strokeWidth={stroke} />
						</span>
						<span class="dk-mini-text">{issue.detail}</span>
						<span class="dk-mini-amt">
							{formatMinor(issue.expected_minor ?? issue.actual_minor ?? 0, f.currency)}
						</span>
					</a>
				{/each}
			</div>
		{/if}
	</Frame>

	<Frame eyebrow="Stock" title="Running out" action="All items" actionHref="/admin/low-stock">
		{#if data.low.length === 0}
			<Empty title="Nothing is low" description="Items appear here as they run down." />
		{:else}
			<div>
				{#each data.low.slice(0, 3) as item (item.variant_id)}
					<a class="dk-mini" href="/admin/low-stock">
						<span
							class="dk-sq"
							aria-hidden="true"
							data-tone={stockTone(item.available, item.threshold)}
						>
							<HugeiconsIcon
								icon={item.available <= 0 ? Alert02Icon : PackageIcon}
								size={15}
								strokeWidth={stroke}
							/>
						</span>
						<span class="dk-mini-text">
							{item.title}
							{#if item.available <= 0}<span class="dk-dim">· out of stock</span>{/if}
						</span>
						<span class="dk-mini-amt">{formatNumber(item.available)}</span>
					</a>
				{/each}
			</div>
		{/if}
	</Frame>

	<Frame eyebrow="Delivery" title="Orders in flight" action="{formatNumber(inFlight)} open">
		{#if inFlight === 0}
			<Empty title="Nothing in flight" description="Every order so far has been delivered." />
		{:else}
			<div class="dk-bars">
				{#each pipeline as stage (stage.name)}
					<div class="dk-bar">
						<span class="dk-bar-name">{stage.name}</span>
						<span class="dk-bar-track">
							<span class="dk-bar-fill" style="width: {(stage.count / inFlight) * 100}%"></span>
						</span>
						<span class="dk-bar-count">{formatNumber(stage.count)}</span>
					</div>
				{/each}
			</div>
		{/if}
	</Frame>
</div>

{#if f.critical_issues > 0}
	<Banner title="Money is missing" tone={issueTone}>
		{formatNumber(f.critical_issues)}
		{f.critical_issues === 1 ? 'parcel needs' : 'parcels need'} chasing with a courier. Open money owed
		to see which.
	</Banner>
{/if}
