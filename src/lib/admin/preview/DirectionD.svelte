<script lang="ts">
	/* D — Soft cards. White cards floating on warm grey, generous radius, a
	   grouped sidebar and a round arrow on every row you can open. Friendly
	   enough for a shop owner who has never used an admin before. */
	import Icon from './Icon.svelte';
	import { figures as f, recent, issues, low, shopName } from './data';
	import { formatMinor } from '$lib/utils/money';
	import { formatNumber } from '$lib/utils/format';
	import { orderState, severityTone } from '$lib/admin/state';

	const main = [
		{ icon: 'home', label: 'Dashboard', active: true },
		{ icon: 'orders', label: 'Orders', badge: f.awaiting_dispatch },
		{ icon: 'products', label: 'Products' },
		{ icon: 'customers', label: 'Customers' }
	];

	const others = [
		{ icon: 'money', label: 'Money owed', badge: f.critical_issues, tone: 'danger' },
		{ icon: 'settings', label: 'Settings' },
		{ icon: 'box', label: 'View shop' }
	];

	const topDistricts = [
		{ name: 'Dhaka', orders: 412 },
		{ name: 'Chattogram', orders: 168 }
	];

	const bestSellers = [
		{ name: 'ঢাকাই জামদানি শাড়ি', sold: 84 },
		{ name: 'নকশি কাঁথা', sold: 61 }
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
			<span class="nav" class:on={item.active}>
				<Icon name={item.icon} size={16} />
				<span class="n-txt">{item.label}</span>
				{#if item.badge}<span class="n-badge">{item.badge}</span>{/if}
			</span>
		{/each}

		<span class="group">Others</span>
		{#each others as item (item.label)}
			<span class="nav">
				<Icon name={item.icon} size={16} />
				<span class="n-txt">{item.label}</span>
				{#if item.badge}<span class="n-badge" data-tone={item.tone}>{item.badge}</span>{/if}
			</span>
		{/each}
	</aside>

	<main class="body">
		<header class="top">
			<span class="search"><Icon name="search" size={15} /> Search anything…</span>
			<span class="top-right">
				<span class="round"><Icon name="bell" size={16} /></span>
				<span class="face">রহ</span>
			</span>
		</header>

		<div class="title-row">
			<h1>Today</h1>
			<span class="cta">＋ Add product</span>
		</div>

		<div class="grid">
			<!-- The feature card carries the one number nothing else can tell a
			     shop owner, so it gets the space a hero image would have. -->
			<section class="feature">
				<span class="kicker">Cash with couriers</span>
				<span class="f-value">{formatMinor(f.outstanding_cod_minor, f.currency)}</span>
				<p class="f-note">
					Collected from customers and not yet paid over to you. Chase anything older than a week.
				</p>

				<div class="metrics">
					<span><Icon name="truck" size={15} /> {formatNumber(f.outstanding_parcels)} parcels</span>
					<span><Icon name="alert" size={15} /> {f.critical_issues} need chasing</span>
					<span><Icon name="money" size={15} /> {f.open_issues} open</span>
				</div>

				<div class="f-acts">
					<span class="btn dark">Open money owed</span>
					<span class="btn light">Import a statement</span>
				</div>
			</section>

			<section class="card list">
				<div class="c-head">
					<h2>Recent orders</h2>
					<span class="view">View all</span>
				</div>
				{#each recent.slice(0, 4) as o (o.id)}
					{@const os = orderState(o.status)}
					<div class="row">
						<span class="r-main">
							<span class="r-title">{o.recipient}</span>
							<span class="r-meta">
								{o.number} · {o.district_name} · {o.ago} ago
							</span>
						</span>
						<span class="r-amt">{formatMinor(o.total_minor, o.currency)}</span>
						<span class="chip" data-tone={os.tone}>{os.word}</span>
						<span class="go"><Icon name="chevron" size={14} /></span>
					</div>
				{/each}
			</section>
		</div>

		<div class="three">
			<section class="card">
				<div class="c-head"><h2>Needs a person</h2></div>
				{#each issues.slice(0, 3) as i (i.id)}
					<div class="mini">
						<span class="badge-sq" data-tone={severityTone(i.severity)}>
							<Icon name="alert" size={13} />
						</span>
						<span class="m-text">{i.detail}</span>
						<span class="m-amt">
							{formatMinor(i.expected_minor ?? i.actual_minor ?? 0, f.currency)}
						</span>
					</div>
				{/each}
			</section>

			<section class="card">
				<div class="c-head"><h2>Selling best</h2></div>
				{#each bestSellers as b (b.name)}
					<div class="mini">
						<span class="badge-sq soft"><Icon name="box" size={13} /></span>
						<span class="m-text">{b.name}</span>
						<span class="m-amt">{b.sold} sold</span>
					</div>
				{/each}
				{#each low.slice(0, 1) as l (l.variant_id)}
					<div class="mini">
						<span class="badge-sq" data-tone="danger"><Icon name="alert" size={13} /></span>
						<span class="m-text">{l.title} <span class="dim">is out of stock</span></span>
						<span class="m-amt">{l.available}</span>
					</div>
				{/each}
			</section>

			<section class="card">
				<div class="c-head"><h2>Where orders come from</h2></div>
				{#each topDistricts as d (d.name)}
					<div class="mini">
						<span class="faces">
							<span class="tiny"></span><span class="tiny"></span><span class="tiny more">8+</span>
						</span>
						<span class="m-text">{d.name}</span>
						<span class="m-amt">{d.orders}</span>
					</div>
				{/each}
				<div class="mini">
					<span class="badge-sq soft"><Icon name="orders" size={13} /></span>
					<span class="m-text">Today so far</span>
					<span class="m-amt">{formatMinor(f.sales_today_minor, f.currency)}</span>
				</div>
			</section>
		</div>
	</main>
</div>

<style>
	.app {
		display: grid;
		grid-template-columns: 236px minmax(0, 1fr);
		min-height: 760px;
		background: var(--d-bg);
		color: var(--d-ink);
		font-size: 13.5px;
		line-height: 1.5;

		--d-bg: #f4f4f2;
		--d-card: #ffffff;
		--d-line: #ececea;
		--d-ink: #17181a;
		--d-muted: #6b6d72;
		--d-faint: #9a9ca2;
		--d-r: 16px;
		--d-r-sm: 11px;
	}

	:global([data-theme='dark']) .app {
		--d-bg: #0e0f10;
		--d-card: #17181a;
		--d-line: #232528;
		--d-ink: #ededee;
		--d-muted: #9a9ca2;
		--d-faint: #6b6d72;
	}

	.rail {
		display: flex;
		flex-direction: column;
		gap: 3px;
		padding: 20px 14px;
		background: var(--d-card);
	}

	.brand {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 0 6px 22px;
	}

	.logo {
		display: grid;
		place-items: center;
		width: 30px;
		height: 30px;
		border-radius: 9px;
		background: var(--d-ink);
		color: var(--d-card);
		font-weight: 600;
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
		font-size: 11.5px;
		color: var(--d-faint);
	}

	.nav {
		display: flex;
		align-items: center;
		gap: 11px;
		padding: 9px 10px;
		border-radius: var(--d-r-sm);
		color: var(--d-muted);
	}

	.nav.on {
		background: var(--d-bg);
		color: var(--d-ink);
		font-weight: 600;
	}

	.n-txt {
		flex: 1;
	}

	.n-badge {
		min-width: 20px;
		padding: 1px 6px;
		border-radius: 20px;
		background: var(--d-bg);
		font-size: 11.5px;
		text-align: center;
		font-variant-numeric: tabular-nums;
	}

	.nav.on .n-badge {
		background: var(--d-card);
	}

	.n-badge[data-tone='danger'] {
		background: var(--danger);
		color: #fff;
	}

	.body {
		padding: 18px 22px 34px;
		min-width: 0;
	}

	.top {
		display: flex;
		align-items: center;
		gap: 14px;
		margin-bottom: 22px;
	}

	.search {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		flex: 1;
		max-width: 380px;
		height: 40px;
		padding: 0 16px;
		border-radius: 999px;
		background: var(--d-card);
		color: var(--d-faint);
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
		width: 36px;
		height: 36px;
		border-radius: 50%;
		background: var(--d-card);
		color: var(--d-muted);
	}

	.face {
		display: grid;
		place-items: center;
		width: 36px;
		height: 36px;
		border-radius: 50%;
		background: var(--d-ink);
		color: var(--d-card);
		font-size: 12px;
		font-weight: 600;
	}

	.title-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		margin-bottom: 16px;
	}

	h1 {
		margin: 0;
		font-size: 26px;
		font-weight: 650;
		letter-spacing: -0.025em;
	}

	.cta {
		padding: 11px 18px;
		border-radius: 999px;
		background: var(--d-ink);
		color: var(--d-card);
		font-size: 13px;
		font-weight: 600;
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
		padding: 22px;
	}

	.kicker {
		font-size: 12px;
		color: var(--d-faint);
	}

	.f-value {
		display: block;
		margin: 8px 0 6px;
		font-size: 40px;
		font-weight: 650;
		letter-spacing: -0.035em;
		line-height: 1;
		font-variant-numeric: tabular-nums;
	}

	.f-note {
		margin: 0 0 18px;
		color: var(--d-muted);
		font-size: 13px;
		max-width: 40ch;
	}

	.metrics {
		display: flex;
		flex-wrap: wrap;
		gap: 18px;
		padding-bottom: 20px;
		color: var(--d-muted);
		font-size: 13px;
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

	.btn {
		padding: 11px 20px;
		border-radius: 999px;
		font-size: 13px;
		font-weight: 600;
	}

	.dark {
		background: var(--d-ink);
		color: var(--d-card);
	}

	.light {
		border: 1px solid var(--d-line);
		color: var(--d-ink);
	}

	.card {
		padding: 18px;
	}

	.c-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 4px 12px;
	}

	h2 {
		margin: 0;
		font-size: 15px;
		font-weight: 650;
	}

	.view {
		font-size: 12.5px;
		color: var(--d-faint);
	}

	.row {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 12px;
		border-radius: var(--d-r-sm);
	}

	.row:hover {
		background: var(--d-bg);
	}

	.r-main {
		flex: 1;
		min-width: 0;
	}

	.r-title {
		display: block;
		font-weight: 600;
		font-size: 13.5px;
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
		background: var(--d-bg);
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

	/* The round arrow is the affordance: every row carrying one can be opened. */
	.go {
		display: grid;
		place-items: center;
		width: 32px;
		height: 32px;
		border-radius: 50%;
		border: 1px solid var(--d-line);
		color: var(--d-muted);
		flex: none;
	}

	.row:hover .go {
		background: var(--d-ink);
		border-color: var(--d-ink);
		color: var(--d-card);
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
		padding: 11px 12px;
		border-radius: var(--d-r-sm);
		background: var(--d-bg);
		margin-bottom: 8px;
	}

	.badge-sq {
		display: grid;
		place-items: center;
		width: 28px;
		height: 28px;
		border-radius: 9px;
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

	/* Overlapping faces read as "several people" faster than a number does. */
	.faces {
		display: inline-flex;
		flex: none;
	}

	.tiny {
		width: 26px;
		height: 26px;
		border-radius: 50%;
		background: var(--d-line);
		border: 2px solid var(--d-bg);
		margin-right: -9px;
	}

	.more {
		display: grid;
		place-items: center;
		background: var(--d-ink);
		color: var(--d-card);
		font-size: 9.5px;
		font-weight: 600;
		margin-right: 0;
	}
</style>
