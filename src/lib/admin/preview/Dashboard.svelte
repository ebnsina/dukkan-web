<script lang="ts">
	/* The admin dashboard: a grey shell holding one white sheet, tinted cards
	   inside it, and lime on anything you can press.

	   It answers three questions in order — did we sell, is any money missing,
	   what needs doing — because that is the order a shop owner asks them in. */
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import {
		Alert02Icon,
		ArrowRight01Icon,
		DashboardSquare01Icon,
		DeliveryTruck01Icon,
		Invoice01Icon,
		Notification01Icon,
		PackageIcon,
		Search01Icon,
		Settings01Icon,
		Store01Icon,
		UserMultipleIcon,
		Wallet01Icon
	} from '@hugeicons/core-free-icons';
	import { figures as f, recent, issues, low, shopName } from './data';
	import { formatMinor } from '$lib/utils/money';
	import { formatNumber } from '$lib/utils/format';
	import { orderState, severityTone } from '$lib/admin/state';

	const main = [
		{ icon: DashboardSquare01Icon, label: 'Dashboard', active: true },
		{ icon: Invoice01Icon, label: 'Orders', badge: f.awaiting_dispatch },
		{ icon: PackageIcon, label: 'Products' },
		{ icon: UserMultipleIcon, label: 'Customers' }
	];

	const others = [
		{ icon: Wallet01Icon, label: 'Money owed', badge: f.critical_issues, tone: 'danger' },
		{ icon: Settings01Icon, label: 'Settings' }
	];

	// One stroke weight everywhere, so the icons read as one set.
	const stroke = 1.6;

	const stats = [
		{
			label: 'Orders today',
			value: formatNumber(f.orders_today),
			sub: `${formatNumber(f.orders_this_month)} this month`
		},
		{
			label: 'Sales today',
			value: formatMinor(f.sales_today_minor, f.currency),
			sub: `${formatMinor(f.sales_month_minor, f.currency)} this month`
		},
		{
			label: 'To confirm',
			value: formatNumber(f.awaiting_confirmation),
			sub: 'waiting on you',
			tone: 'info'
		},
		{
			label: 'To send',
			value: formatNumber(f.awaiting_dispatch),
			sub: 'ready for a courier',
			tone: 'warning'
		}
	];

	const bestSellers = [
		{ name: 'ঢাকাই জামদানি শাড়ি', sold: 84 },
		{ name: 'নকশি কাঁথা', sold: 61 }
	];

	// Share of orders by district, drawn as a bar: a proportion reads faster
	// than the count beside it does.
	const districts = [
		{ name: 'Dhaka', orders: 412, pct: 49 },
		{ name: 'Chattogram', orders: 168, pct: 20 },
		{ name: 'Sylhet', orders: 121, pct: 14 },
		{ name: 'Elsewhere', orders: 141, pct: 17 }
	];
</script>

<div class="app">
	<aside class="rail">
		<div class="brand">
			<span class="logo">র</span>
			<span class="bname">{shopName}</span>
		</div>

		<span class="group">Main</span>
		{#each main as item (item.label)}
			<a class="nav" class:on={item.active} href="#{item.label}">
				<HugeiconsIcon icon={item.icon} size={17} strokeWidth={stroke} />
				<span class="n-txt">{item.label}</span>
				{#if item.badge}<span class="n-badge">{item.badge}</span>{/if}
			</a>
		{/each}

		<span class="group">Others</span>
		{#each others as item (item.label)}
			<a class="nav" href="#{item.label}">
				<HugeiconsIcon icon={item.icon} size={17} strokeWidth={stroke} />
				<span class="n-txt">{item.label}</span>
				{#if item.badge}<span class="n-badge" data-tone={item.tone}>{item.badge}</span>{/if}
			</a>
		{/each}

		<a class="nav foot" href="#shop">
			<HugeiconsIcon icon={Store01Icon} size={17} strokeWidth={stroke} />
			<span class="n-txt">View shop</span>
		</a>
	</aside>

	<main class="body">
		<header class="top">
			<span class="search"
				><HugeiconsIcon icon={Search01Icon} size={16} strokeWidth={stroke} /> Search orders, products,
				customers…</span
			>
			<span class="top-right">
				<span class="round"
					><HugeiconsIcon icon={Notification01Icon} size={17} strokeWidth={stroke} /></span
				>
				<span class="face">রহ</span>
			</span>
		</header>

		<div class="title-row">
			<div>
				<h1>Today</h1>
				<p class="date">Sunday, 3 August</p>
			</div>
			<a class="cta" href="#add">Add product</a>
		</div>

		<!-- Did we sell, and what is waiting. Four plain figures before anything
		     with an opinion about them. -->
		<section class="stats">
			{#each stats as s (s.label)}
				<div class="stat">
					<span class="s-label">{s.label}</span>
					<span class="s-value" data-tone={s.tone ?? 'plain'}>{s.value}</span>
					<span class="s-sub">{s.sub}</span>
				</div>
			{/each}
		</section>

		<div class="grid">
			<!-- The figure nothing else can tell a shop owner, given the space a
			     hero image would have had. -->
			<section class="feature">
				<span class="kicker">Cash with couriers</span>
				<span class="f-value">{formatMinor(f.outstanding_cod_minor, f.currency)}</span>
				<p class="f-note">
					Collected from customers and not yet paid over to you. Chase anything older than a week.
				</p>

				<div class="metrics">
					<span
						><HugeiconsIcon icon={DeliveryTruck01Icon} size={16} strokeWidth={stroke} />
						{formatNumber(f.outstanding_parcels)} parcels</span
					>
					<span
						><HugeiconsIcon icon={Alert02Icon} size={16} strokeWidth={stroke} />
						{f.critical_issues} need chasing</span
					>
				</div>

				<div class="f-acts">
					<a class="btn dark" href="#money">Open money owed</a>
					<a class="btn light" href="#import">Import a statement</a>
				</div>
			</section>

			<section class="card">
				<div class="c-head">
					<h2>Recent orders</h2>
					<a class="view" href="#orders">View all</a>
				</div>
				{#each recent.slice(0, 5) as o (o.id)}
					{@const os = orderState(o.status)}
					<a class="row" href="#{o.id}">
						<span class="r-main">
							<span class="r-title">{o.recipient}</span>
							<span class="r-meta">{o.number} · {o.district_name} · {o.ago} ago</span>
						</span>
						<span class="r-amt">{formatMinor(o.total_minor, o.currency)}</span>
						<span class="chip" data-tone={os.tone}>{os.word}</span>
						<span class="go"
							><HugeiconsIcon icon={ArrowRight01Icon} size={15} strokeWidth={stroke} /></span
						>
					</a>
				{/each}
			</section>
		</div>

		<div class="three">
			<section class="card">
				<div class="c-head">
					<h2>Needs a person</h2>
					<a class="view" href="#money">{f.open_issues} open</a>
				</div>
				{#each issues.slice(0, 3) as i (i.id)}
					<a class="mini" href="#{i.id}">
						<span class="badge-sq" data-tone={severityTone(i.severity)}>
							<HugeiconsIcon icon={Alert02Icon} size={15} strokeWidth={stroke} />
						</span>
						<span class="m-text">{i.detail}</span>
						<span class="m-amt">
							{formatMinor(i.expected_minor ?? i.actual_minor ?? 0, f.currency)}
						</span>
					</a>
				{/each}
			</section>

			<section class="card">
				<div class="c-head">
					<h2>Moving</h2>
					<a class="view" href="#products">Products</a>
				</div>
				{#each bestSellers as b (b.name)}
					<a class="mini" href="#{b.name}">
						<span class="badge-sq"
							><HugeiconsIcon icon={PackageIcon} size={15} strokeWidth={stroke} /></span
						>
						<span class="m-text">{b.name}</span>
						<span class="m-amt">{b.sold} sold</span>
					</a>
				{/each}
				{#each low.slice(0, 1) as l (l.variant_id)}
					<a class="mini" href="#{l.variant_id}">
						<span class="badge-sq" data-tone="danger"
							><HugeiconsIcon icon={Alert02Icon} size={15} strokeWidth={stroke} /></span
						>
						<span class="m-text">{l.title} <span class="dim">out of stock</span></span>
						<span class="m-amt">{l.available}</span>
					</a>
				{/each}
			</section>

			<section class="card">
				<div class="c-head">
					<h2>Where orders go</h2>
					<span class="view plain">This month</span>
				</div>
				<div class="bars">
					{#each districts as d (d.name)}
						<div class="bar-row">
							<span class="b-name">{d.name}</span>
							<span class="b-track"><span class="b-fill" style="width: {d.pct}%"></span></span>
							<span class="b-count">{formatNumber(d.orders)}</span>
						</div>
					{/each}
				</div>
			</section>
		</div>
	</main>
</div>

<style>
	.app {
		display: grid;
		grid-template-columns: 228px minmax(0, 1fr);
		height: 100dvh;
		overflow: hidden;
		background: var(--d-shell);
		color: var(--d-ink);
		font-size: 13.5px;
		line-height: 1.5;

		/* The shell is grey and the content floats on it as one white sheet.
		   Cards inside the sheet tint rather than stacking another white on white. */
		--d-shell: #f4f5f6;
		--d-sheet: #ffffff;
		--d-card: #fafafb;
		--d-ink: #17181a;
		--d-muted: #71737a;
		--d-faint: #a4a6ad;
		--d-lime: #b7ec2f;
		--d-lime-deep: #9ed214;
		--d-lime-ink: #101410;
		--d-r: 20px;
		--d-r-sm: 14px;
		--d-soft: 0 1px 2px -1px rgba(20, 20, 24, 0.04), 0 8px 24px -20px rgba(20, 20, 24, 0.12);
		--d-softer: 0 1px 2px -1px rgba(20, 20, 24, 0.05);
		--d-quick: 140ms cubic-bezier(0.2, 0, 0.2, 1);
	}

	:global([data-theme='dark']) .app {
		--d-shell: #0c0d0f;
		--d-sheet: #141517;
		--d-card: #191a1d;
		--d-ink: #ededee;
		--d-muted: #9a9ca2;
		--d-faint: #6b6d72;
		--d-soft: 0 1px 2px -1px rgba(0, 0, 0, 0.4);
		--d-softer: 0 1px 2px -1px rgba(0, 0, 0, 0.3);
	}

	a {
		color: inherit;
		text-decoration: none;
	}

	a:focus-visible {
		outline: 2px solid var(--d-lime-deep);
		outline-offset: 2px;
	}

	/* ── Rail ─────────────────────────────────────────────────────────── */

	.rail {
		display: flex;
		flex-direction: column;
		gap: 2px;
		padding: 22px 12px;
		height: 100dvh;
		overflow-y: auto;
		overscroll-behavior: contain;
	}

	.brand {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 0 6px 20px;
	}

	.logo {
		display: grid;
		place-items: center;
		width: 30px;
		height: 30px;
		border-radius: 10px;
		background: var(--d-lime);
		color: var(--d-lime-ink);
		font-weight: 600;
		flex: none;
	}

	.bname {
		font-weight: 650;
		font-size: 14px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.group {
		padding: 14px 8px 6px;
		font-family: var(--font-mono);
		font-size: 10px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--d-faint);
	}

	.nav {
		display: flex;
		align-items: center;
		gap: 11px;
		padding: 9px 10px;
		border-radius: var(--d-r-sm);
		color: var(--d-muted);
		transition:
			background-color var(--d-quick),
			color var(--d-quick);
	}

	.nav:hover {
		color: var(--d-ink);
		background: rgba(120, 124, 136, 0.07);
	}

	.nav.on {
		background: var(--d-sheet);
		color: var(--d-ink);
		font-weight: 600;
		box-shadow: var(--d-softer);
	}

	.foot {
		margin-top: auto;
	}

	.n-txt {
		flex: 1;
	}

	.n-badge {
		min-width: 20px;
		padding: 1px 6px;
		border-radius: 20px;
		background: rgba(120, 124, 136, 0.1);
		font-size: 11.5px;
		text-align: center;
		font-variant-numeric: tabular-nums;
	}

	.n-badge[data-tone='danger'] {
		background: var(--danger);
		color: #fff;
	}

	/* ── Sheet ────────────────────────────────────────────────────────── */

	.body {
		margin: 6px 6px 6px 0;
		padding: 18px 22px 24px;
		min-width: 0;
		background: var(--d-sheet);
		border-radius: var(--d-r);
		box-shadow: var(--d-soft);
		overflow-y: auto;
		overscroll-behavior: contain;
	}

	/* A thin, quiet scrollbar: on a screen this pale a default one is a bar of
	   furniture down the side. */
	.body::-webkit-scrollbar,
	.rail::-webkit-scrollbar {
		width: 10px;
	}

	.body::-webkit-scrollbar-thumb,
	.rail::-webkit-scrollbar-thumb {
		border: 3px solid transparent;
		border-radius: 10px;
		background-clip: content-box;
		background-color: rgba(120, 124, 136, 0.28);
	}

	.body::-webkit-scrollbar-track,
	.rail::-webkit-scrollbar-track {
		background: transparent;
	}

	.top {
		position: sticky;
		top: -18px;
		z-index: 2;
		display: flex;
		align-items: center;
		gap: 14px;
		margin: -18px -22px 24px;
		padding: 18px 22px 12px;
		background: var(--d-sheet);
	}

	.search {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		flex: 1;
		max-width: 400px;
		height: 40px;
		padding: 0 16px;
		border-radius: 999px;
		background: var(--d-card);
		color: var(--d-faint);
		overflow: hidden;
		white-space: nowrap;
	}

	.top-right {
		display: inline-flex;
		align-items: center;
		gap: 9px;
		margin-left: auto;
	}

	.round {
		display: grid;
		place-items: center;
		width: 38px;
		height: 38px;
		border-radius: 50%;
		background: var(--d-card);
		color: var(--d-muted);
	}

	.face {
		display: grid;
		place-items: center;
		width: 38px;
		height: 38px;
		border-radius: 50%;
		background: var(--d-ink);
		color: var(--d-sheet);
		font-size: 12px;
		font-weight: 600;
	}

	.title-row {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 16px;
		margin-bottom: 18px;
	}

	h1 {
		margin: 0;
		font-size: 26px;
		font-weight: 650;
		letter-spacing: -0.025em;
		line-height: 1.1;
	}

	.date {
		margin: 4px 0 0;
		font-size: 13px;
		color: var(--d-faint);
	}

	/* ── Buttons ──────────────────────────────────────────────────────── */

	.cta,
	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-family: var(--font-mono);
		font-size: 11px;
		font-weight: 500;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		padding: 14px 20px;
		border-radius: 16px;
		white-space: nowrap;
		transition: background-color var(--d-quick);
	}

	.cta,
	.dark {
		background: var(--d-lime);
		color: var(--d-lime-ink);
	}

	.cta:hover,
	.dark:hover {
		background: var(--d-lime-deep);
	}

	.light {
		background: var(--d-sheet);
		color: var(--d-ink);
		box-shadow: var(--d-softer);
	}

	/* ── Figures ──────────────────────────────────────────────────────── */

	.stats {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		gap: 1px;
		margin-bottom: 14px;
		background: rgba(120, 124, 136, 0.1);
		border-radius: var(--d-r-sm);
		overflow: hidden;
	}

	.stat {
		padding: 14px 16px;
		background: var(--d-sheet);
	}

	.s-label {
		display: block;
		font-size: 12.5px;
		color: var(--d-muted);
	}

	.s-value {
		display: block;
		margin: 6px 0 2px;
		font-size: 23px;
		font-weight: 650;
		letter-spacing: -0.02em;
		font-variant-numeric: tabular-nums;
	}

	.s-value[data-tone='warning'] {
		color: var(--warning);
	}
	.s-value[data-tone='info'] {
		color: var(--info);
	}

	.s-sub {
		font-size: 12px;
		color: var(--d-faint);
	}

	.grid {
		display: grid;
		gap: 14px;
		margin-bottom: 14px;
	}

	@media (min-width: 1000px) {
		.grid {
			grid-template-columns: minmax(0, 1fr) minmax(0, 1.25fr);
		}
	}

	.feature,
	.card {
		background: var(--d-card);
		border-radius: var(--d-r);
		padding: 20px;
	}

	.kicker {
		font-size: 12.5px;
		color: var(--d-muted);
	}

	.f-value {
		display: block;
		margin: 8px 0 6px;
		font-size: 38px;
		font-weight: 650;
		letter-spacing: -0.035em;
		line-height: 1;
		font-variant-numeric: tabular-nums;
	}

	.f-note {
		margin: 0 0 18px;
		color: var(--d-muted);
		font-size: 13px;
		max-width: 38ch;
	}

	.metrics {
		display: flex;
		flex-wrap: wrap;
		gap: 18px;
		padding-bottom: 18px;
		color: var(--d-muted);
		font-size: 12.5px;
	}

	.metrics span {
		display: inline-flex;
		align-items: center;
		gap: 7px;
	}

	.f-acts {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}

	/* ── Cards ────────────────────────────────────────────────────────── */

	.c-head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 12px;
		padding: 0 4px 12px;
	}

	h2 {
		margin: 0;
		font-size: 14.5px;
		font-weight: 650;
	}

	.view {
		font-size: 12px;
		color: var(--d-muted);
	}

	.view:not(.plain):hover {
		color: var(--d-lime-deep);
	}

	.plain {
		color: var(--d-faint);
	}

	.row {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 11px 12px;
		border-radius: var(--d-r-sm);
		transition:
			background-color var(--d-quick),
			box-shadow var(--d-quick);
	}

	.row:hover {
		background: var(--d-sheet);
		box-shadow: var(--d-softer);
	}

	.r-main {
		flex: 1;
		min-width: 0;
	}

	.r-title {
		display: block;
		font-weight: 600;
		font-size: 13.5px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.r-meta {
		display: block;
		font-size: 12px;
		color: var(--d-faint);
	}

	.r-amt {
		font-weight: 650;
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
	}

	.chip {
		padding: 4px 10px;
		border-radius: 999px;
		font-size: 11.5px;
		font-weight: 600;
		background: rgba(120, 124, 136, 0.1);
		color: var(--d-muted);
		white-space: nowrap;
	}

	.chip[data-tone='success'] {
		background: var(--success-soft);
		color: var(--success);
	}
	.chip[data-tone='warning'] {
		background: var(--warning-soft);
		color: var(--warning);
	}
	.chip[data-tone='danger'] {
		background: var(--danger-soft);
		color: var(--danger);
	}
	.chip[data-tone='info'] {
		background: var(--info-soft);
		color: var(--info);
	}
	.chip[data-tone='accent'] {
		background: var(--accent-soft);
		color: var(--accent);
	}

	/* The round arrow is the affordance: a row carrying one can be opened. */
	.go {
		display: grid;
		place-items: center;
		width: 32px;
		height: 32px;
		border-radius: 50%;
		background: var(--d-sheet);
		color: var(--d-muted);
		flex: none;
		box-shadow: var(--d-softer);
		transition:
			background-color var(--d-quick),
			color var(--d-quick);
	}

	.row:hover .go {
		background: var(--d-lime);
		color: var(--d-lime-ink);
	}

	.three {
		display: grid;
		gap: 14px;
	}

	@media (min-width: 900px) {
		.three {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}

	.mini {
		display: flex;
		align-items: center;
		gap: 11px;
		padding: 10px 12px;
		border-radius: var(--d-r-sm);
		background: var(--d-sheet);
		margin-bottom: 8px;
		box-shadow: var(--d-softer);
		transition: transform var(--d-quick);
	}

	.mini:last-child {
		margin-bottom: 0;
	}

	.mini:hover {
		transform: translateX(2px);
	}

	.badge-sq {
		display: grid;
		place-items: center;
		width: 30px;
		height: 30px;
		border-radius: 11px;
		background: var(--d-card);
		color: var(--d-muted);
		flex: none;
	}

	.badge-sq[data-tone='danger'] {
		background: var(--danger-soft);
		color: var(--danger);
	}
	.badge-sq[data-tone='warning'] {
		background: var(--warning-soft);
		color: var(--warning);
	}
	.badge-sq[data-tone='info'] {
		background: var(--info-soft);
		color: var(--info);
	}

	.m-text {
		flex: 1;
		min-width: 0;
		font-size: 12.5px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.dim {
		color: var(--d-faint);
	}

	.m-amt {
		font-size: 12.5px;
		font-weight: 600;
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
	}

	/* ── Share bars ───────────────────────────────────────────────────── */

	.bars {
		display: flex;
		flex-direction: column;
		gap: 13px;
		padding: 4px;
	}

	.bar-row {
		display: flex;
		align-items: center;
		gap: 12px;
		font-size: 12.5px;
	}

	.b-name {
		width: 84px;
		flex: none;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		color: var(--d-muted);
	}

	.b-track {
		flex: 1;
		height: 6px;
		border-radius: 4px;
		background: var(--d-sheet);
		overflow: hidden;
	}

	.b-fill {
		display: block;
		height: 100%;
		border-radius: 4px;
		background: var(--d-lime-deep);
	}

	.b-count {
		width: 34px;
		text-align: right;
		font-variant-numeric: tabular-nums;
		font-weight: 600;
	}
</style>
