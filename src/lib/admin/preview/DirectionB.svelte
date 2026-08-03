<script lang="ts">
	/* B — Workspace. Roomier, softer, with a chart. For a shop owner who opens
	   this a few times a day and wants to feel how the week is going, not to
	   process a queue. */
	import Icon from './Icon.svelte';
	import { figures as f, recent, issues, low, shopName } from './data';
	import { formatMinor } from '$lib/utils/money';
	import { formatNumber } from '$lib/utils/format';
	import { orderState, paymentState, severityTone } from '$lib/admin/state';

	const nav = [
		{ icon: 'home', label: 'Dashboard', active: true },
		{ icon: 'orders', label: 'Orders', badge: f.awaiting_dispatch },
		{ icon: 'products', label: 'Products' },
		{ icon: 'money', label: 'Money owed', badge: f.critical_issues, tone: 'danger' },
		{ icon: 'customers', label: 'Customers' },
		{ icon: 'settings', label: 'Settings' }
	];

	// Seven days of sales, drawn as a path. Illustrative shape, real units.
	const week = [2680000, 3120000, 2940000, 4010000, 3760000, 5220000, 4732000];
	const peak = Math.max(...week);
	const points = week
		.map((v, i) => `${(i / (week.length - 1)) * 100},${34 - (v / peak) * 30}`)
		.join(' ');
</script>

<div class="app">
	<aside class="rail">
		<div class="shop">
			<span class="mark">র</span>
			<span>
				<span class="name">{shopName}</span>
				<span class="plan">Growth plan</span>
			</span>
		</div>

		<nav>
			{#each nav as item (item.label)}
				<span class="item" class:on={item.active}>
					<Icon name={item.icon} size={17} />
					<span class="txt">{item.label}</span>
					{#if item.badge}
						<span class="badge" data-tone={item.tone ?? 'plain'}>{item.badge}</span>
					{/if}
				</span>
			{/each}
		</nav>
	</aside>

	<div class="main">
		<header class="bar">
			<div class="crumbs">Dukkàn <Icon name="chevron" size={12} /> <b>Dashboard</b></div>
			<div class="bar-right">
				<span class="search"><Icon name="search" size={14} /> Search</span>
				<span class="icon-btn"><Icon name="bell" size={16} /></span>
				<span class="avatar">রহ</span>
			</div>
		</header>

		<div class="body">
			<div class="hello">
				<h1>Good afternoon</h1>
				<p>Here is how {shopName} is doing today.</p>
			</div>

			<section class="hero">
				<div class="hero-main">
					<span class="h-label">Cash with couriers</span>
					<span class="h-value">{formatMinor(f.outstanding_cod_minor, f.currency)}</span>
					<span class="h-sub">
						Across {formatNumber(f.outstanding_parcels)} delivered parcels. {f.critical_issues} of them
						need chasing.
					</span>
					<span class="h-cta">Open money owed <Icon name="chevron" size={13} /></span>
				</div>
				<div class="hero-chart">
					<span class="c-label">Sales, last 7 days</span>
					<span class="c-value"
						>{formatMinor(f.sales_today_minor, f.currency)}<span class="c-day"> today</span></span
					>
					<svg viewBox="0 0 100 36" preserveAspectRatio="none" aria-hidden="true">
						<polyline {points} />
						<circle cx="100" cy={34 - (week[6] / peak) * 30} r="2" />
					</svg>
				</div>
			</section>

			<section class="tiles">
				<div class="tile">
					<span class="t-top"><Icon name="orders" size={15} /> Orders today</span>
					<span class="t-value">{formatNumber(f.orders_today)}</span>
					<span class="t-sub">{formatNumber(f.orders_this_month)} this month</span>
				</div>
				<div class="tile" data-tone="info">
					<span class="t-top"><Icon name="box" size={15} /> To confirm</span>
					<span class="t-value">{formatNumber(f.awaiting_confirmation)}</span>
					<span class="t-sub">waiting on you</span>
				</div>
				<div class="tile" data-tone="warning">
					<span class="t-top"><Icon name="box" size={15} /> To send</span>
					<span class="t-value">{formatNumber(f.awaiting_dispatch)}</span>
					<span class="t-sub">ready for a courier</span>
				</div>
				<div class="tile">
					<span class="t-top"><Icon name="truck" size={15} /> On its way</span>
					<span class="t-value">{formatNumber(f.in_transit)}</span>
					<span class="t-sub">out for delivery</span>
				</div>
			</section>

			<div class="cols">
				<section class="panel">
					<div class="p-head">
						<h2>Recent orders</h2>
						<span class="ghost">View all</span>
					</div>
					<ul class="orders">
						{#each recent.slice(0, 6) as o (o.id)}
							{@const os = orderState(o.status)}
							{@const ps = paymentState(o.payment_state)}
							<li>
								<span class="o-av">{o.recipient.slice(0, 1)}</span>
								<span class="o-who">
									<span class="o-name">{o.recipient}</span>
									<span class="o-meta">{o.number} · {o.district_name} · {o.items} items</span>
								</span>
								<span class="chip" data-tone={os.tone}>{os.word}</span>
								<span class="chip soft" data-tone={ps.tone}>{ps.word}</span>
								<span class="o-amt">{formatMinor(o.total_minor, o.currency)}</span>
							</li>
						{/each}
					</ul>
				</section>

				<div class="side">
					<section class="panel">
						<div class="p-head"><h2>Needs a person</h2></div>
						<ul class="list">
							{#each issues.slice(0, 3) as i (i.id)}
								<li data-tone={severityTone(i.severity)}>
									<span class="l-text">{i.detail}</span>
									{#if i.expected_minor ?? i.actual_minor}
										<span class="l-amt">
											{formatMinor(i.expected_minor ?? i.actual_minor ?? 0, f.currency)}
										</span>
									{/if}
								</li>
							{/each}
						</ul>
					</section>

					<section class="panel">
						<div class="p-head"><h2>Running out</h2></div>
						<ul class="list">
							{#each low.slice(0, 3) as l (l.variant_id)}
								<li data-tone={l.available <= 0 ? 'danger' : 'warning'}>
									<span class="l-text">{l.title}<span class="dim"> · {l.variant_title}</span></span>
									<span class="l-amt">{l.available} left</span>
								</li>
							{/each}
						</ul>
					</section>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.app {
		display: grid;
		grid-template-columns: 232px minmax(0, 1fr);
		min-height: 720px;
		background: var(--b-bg);
		color: var(--b-ink);
		font-size: 14px;
		line-height: 1.5;

		--b-bg: #f6f7f9;
		--b-panel: #ffffff;
		--b-rail: #ffffff;
		--b-line: #e8eaee;
		--b-ink: #14161a;
		--b-muted: #5f6672;
		--b-faint: #949aa6;
		--b-brand: #4a7c0b;
		--b-radius: 12px;
		--b-lift: 0 1px 2px rgba(20, 22, 26, 0.05), 0 6px 16px -8px rgba(20, 22, 26, 0.14);
	}

	:global([data-theme='dark']) .app {
		--b-bg: #0b0c0f;
		--b-panel: #15171c;
		--b-rail: #101216;
		--b-line: #23262d;
		--b-ink: #eceef2;
		--b-muted: #99a0ac;
		--b-faint: #6c7380;
		--b-brand: #a8d92b;
		--b-lift: 0 1px 2px rgba(0, 0, 0, 0.5);
	}

	.rail {
		padding: 18px 12px;
		background: var(--b-rail);
		border-right: 1px solid var(--b-line);
	}

	.shop {
		display: flex;
		align-items: center;
		gap: 11px;
		padding: 4px 8px 20px;
	}

	.mark {
		display: grid;
		place-items: center;
		width: 34px;
		height: 34px;
		border-radius: 10px;
		background: var(--b-brand);
		color: #fff;
		font-weight: 600;
		flex: none;
	}

	.name {
		display: block;
		font-weight: 600;
		font-size: 14px;
	}

	.plan {
		display: block;
		font-size: 12px;
		color: var(--b-faint);
	}

	nav {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.item {
		display: flex;
		align-items: center;
		gap: 11px;
		padding: 9px 11px;
		border-radius: 9px;
		color: var(--b-muted);
	}

	.item.on {
		background: color-mix(in oklab, var(--b-brand) 12%, transparent);
		color: var(--b-brand);
		font-weight: 600;
	}

	.txt {
		flex: 1;
	}

	.badge {
		min-width: 21px;
		padding: 1px 6px;
		border-radius: 20px;
		background: color-mix(in oklab, var(--b-ink) 8%, transparent);
		font-size: 11.5px;
		text-align: center;
		font-variant-numeric: tabular-nums;
	}

	.badge[data-tone='danger'] {
		background: var(--danger);
		color: #fff;
	}

	.bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		height: 58px;
		padding: 0 24px;
		background: var(--b-panel);
		border-bottom: 1px solid var(--b-line);
	}

	.crumbs {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		color: var(--b-faint);
		font-size: 13px;
	}

	.crumbs b {
		color: var(--b-ink);
		font-weight: 600;
	}

	.bar-right {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.search {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		height: 34px;
		padding: 0 13px;
		border-radius: 9px;
		background: var(--b-bg);
		color: var(--b-faint);
		font-size: 13px;
		min-width: 200px;
	}

	.icon-btn {
		display: grid;
		place-items: center;
		width: 34px;
		height: 34px;
		border-radius: 9px;
		background: var(--b-bg);
		color: var(--b-muted);
	}

	.avatar {
		display: grid;
		place-items: center;
		width: 34px;
		height: 34px;
		border-radius: 50%;
		background: var(--b-ink);
		color: var(--b-panel);
		font-size: 12px;
		font-weight: 600;
	}

	.body {
		padding: 24px 24px 44px;
	}

	.hello h1 {
		margin: 0;
		font-size: 22px;
		font-weight: 650;
		letter-spacing: -0.02em;
	}

	.hello p {
		margin: 3px 0 20px;
		color: var(--b-muted);
		font-size: 13.5px;
	}

	.hero {
		display: grid;
		gap: 14px;
		margin-bottom: 14px;
	}

	@media (min-width: 900px) {
		.hero {
			grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr);
		}
	}

	.hero-main,
	.hero-chart {
		padding: 20px 22px;
		border-radius: var(--b-radius);
		background: var(--b-panel);
		box-shadow: var(--b-lift);
	}

	.hero-main {
		background: linear-gradient(
			135deg,
			color-mix(in oklab, var(--warning) 9%, var(--b-panel)),
			var(--b-panel) 62%
		);
	}

	.h-label {
		display: block;
		font-size: 13px;
		color: var(--b-muted);
	}

	.h-value {
		display: block;
		margin: 6px 0 4px;
		font-size: 38px;
		font-weight: 650;
		letter-spacing: -0.03em;
		font-variant-numeric: tabular-nums;
		line-height: 1;
	}

	.h-sub {
		display: block;
		font-size: 13px;
		color: var(--b-muted);
		max-width: 46ch;
	}

	.h-cta {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		margin-top: 14px;
		padding: 8px 14px;
		border-radius: 9px;
		background: var(--b-ink);
		color: var(--b-panel);
		font-size: 12.5px;
		font-weight: 600;
	}

	.c-label {
		display: block;
		font-size: 13px;
		color: var(--b-muted);
	}

	.c-value {
		display: block;
		margin: 6px 0 12px;
		font-size: 24px;
		font-weight: 650;
		letter-spacing: -0.02em;
		font-variant-numeric: tabular-nums;
	}

	.c-day {
		font-size: 13px;
		font-weight: 400;
		color: var(--b-faint);
	}

	.hero-chart svg {
		display: block;
		width: 100%;
		height: 62px;
		overflow: visible;
	}

	polyline {
		fill: none;
		stroke: var(--b-brand);
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
		vector-effect: non-scaling-stroke;
	}

	circle {
		fill: var(--b-brand);
	}

	.tiles {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(184px, 1fr));
		gap: 14px;
		margin-bottom: 18px;
	}

	.tile {
		padding: 16px 18px;
		border-radius: var(--b-radius);
		background: var(--b-panel);
		box-shadow: var(--b-lift);
	}

	.t-top {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		font-size: 12.5px;
		color: var(--b-muted);
	}

	.t-value {
		display: block;
		margin: 8px 0 2px;
		font-size: 26px;
		font-weight: 650;
		letter-spacing: -0.02em;
		font-variant-numeric: tabular-nums;
	}

	.tile[data-tone='warning'] .t-value {
		color: var(--warning);
	}
	.tile[data-tone='info'] .t-value {
		color: var(--info);
	}

	.t-sub {
		font-size: 12.5px;
		color: var(--b-faint);
	}

	.cols {
		display: grid;
		gap: 14px;
	}

	@media (min-width: 1080px) {
		.cols {
			grid-template-columns: minmax(0, 1.7fr) minmax(0, 1fr);
		}
	}

	.side {
		display: flex;
		flex-direction: column;
		gap: 14px;
	}

	.panel {
		border-radius: var(--b-radius);
		background: var(--b-panel);
		box-shadow: var(--b-lift);
		overflow: hidden;
	}

	.p-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 15px 18px;
		border-bottom: 1px solid var(--b-line);
	}

	h2 {
		margin: 0;
		font-size: 14px;
		font-weight: 650;
	}

	.ghost {
		font-size: 12.5px;
		color: var(--b-brand);
		font-weight: 600;
	}

	.orders,
	.list {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.orders li {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 12px 18px;
		border-bottom: 1px solid var(--b-line);
	}

	.orders li:last-child,
	.list li:last-child {
		border-bottom: none;
	}

	.o-av {
		display: grid;
		place-items: center;
		width: 32px;
		height: 32px;
		border-radius: 50%;
		background: var(--b-bg);
		color: var(--b-muted);
		font-size: 13px;
		font-weight: 600;
		flex: none;
	}

	.o-who {
		flex: 1;
		min-width: 0;
	}

	.o-name {
		display: block;
		font-size: 13.5px;
		font-weight: 550;
	}

	.o-meta {
		display: block;
		font-size: 12px;
		color: var(--b-faint);
	}

	.chip {
		padding: 3px 9px;
		border-radius: 20px;
		font-size: 11.5px;
		font-weight: 600;
		white-space: nowrap;
		background: color-mix(in oklab, var(--b-ink) 7%, transparent);
		color: var(--b-muted);
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
		background: color-mix(in oklab, var(--b-brand) 15%, transparent);
		color: var(--b-brand);
	}

	.soft {
		font-weight: 500;
	}

	.o-amt {
		font-variant-numeric: tabular-nums;
		font-weight: 600;
		font-size: 13.5px;
		white-space: nowrap;
	}

	.list li {
		display: flex;
		align-items: baseline;
		gap: 12px;
		padding: 12px 18px 12px 15px;
		border-bottom: 1px solid var(--b-line);
		border-left: 3px solid transparent;
		font-size: 13px;
	}

	.list li[data-tone='danger'] {
		border-left-color: var(--danger);
	}
	.list li[data-tone='warning'] {
		border-left-color: var(--warning);
	}
	.list li[data-tone='info'] {
		border-left-color: var(--info);
	}

	.l-text {
		flex: 1;
		min-width: 0;
		color: var(--b-muted);
	}

	.dim {
		color: var(--b-faint);
	}

	.l-amt {
		font-variant-numeric: tabular-nums;
		font-weight: 600;
		white-space: nowrap;
	}
</style>
