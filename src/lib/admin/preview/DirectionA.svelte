<script lang="ts">
	/* A — Product console. A left rail you stop seeing after a day, compact
	   type, bordered cards, and a table dense enough to hold a screenful. */
	import Icon from './Icon.svelte';
	import { figures as f, recent, issues, low, shopName } from './data';
	import { formatMinor } from '$lib/utils/money';
	import { formatNumber } from '$lib/utils/format';
	import { orderState, paymentState, severityTone } from '$lib/admin/state';

	const nav = [
		{ icon: 'home', label: 'Dashboard', active: true },
		{ icon: 'orders', label: 'Orders', badge: f.awaiting_dispatch },
		{ icon: 'products', label: 'Products' },
		{ icon: 'money', label: 'Money owed', badge: f.open_issues, tone: 'danger' },
		{ icon: 'customers', label: 'Customers' },
		{ icon: 'settings', label: 'Settings' }
	];

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
			label: 'To send',
			value: formatNumber(f.awaiting_dispatch),
			sub: `${formatNumber(f.awaiting_confirmation)} to confirm`,
			tone: 'warning'
		},
		{ label: 'On its way', value: formatNumber(f.in_transit), sub: 'with couriers now' }
	];
</script>

<div class="app">
	<aside class="rail">
		<div class="shop">
			<span class="mark">র</span>
			<span class="name">{shopName}</span>
		</div>

		<nav>
			{#each nav as item (item.label)}
				<span class="item" class:on={item.active}>
					<Icon name={item.icon} size={15} />
					<span class="txt">{item.label}</span>
					{#if item.badge}
						<span class="badge" data-tone={item.tone ?? 'plain'}>{item.badge}</span>
					{/if}
				</span>
			{/each}
		</nav>

		<div class="foot">
			<span class="item"><Icon name="box" size={15} /><span class="txt">View shop</span></span>
		</div>
	</aside>

	<main class="body">
		<header class="top">
			<div>
				<h1>Dashboard</h1>
				<p class="sub">Sunday, 3 August</p>
			</div>
			<div class="acts">
				<span class="search"><Icon name="search" size={14} /> Search orders</span>
				<span class="btn">＋ Add product</span>
			</div>
		</header>

		<!-- Cash the courier holds sits alone and wide: nothing else on this
		     screen is a number the shop cannot see anywhere else. -->
		<section class="cod">
			<div>
				<span class="cod-label">Cash with couriers</span>
				<span class="cod-value">{formatMinor(f.outstanding_cod_minor, f.currency)}</span>
				<span class="cod-sub">
					{formatNumber(f.outstanding_parcels)} parcels delivered and not yet paid over
				</span>
			</div>
			<div class="cod-side">
				<span class="pill" data-tone="danger">
					<Icon name="alert" size={13} />
					{f.critical_issues} need chasing
				</span>
				<span class="link">Open the list <Icon name="chevron" size={13} /></span>
			</div>
		</section>

		<section class="stats">
			{#each stats as s (s.label)}
				<div class="stat" data-tone={s.tone ?? 'plain'}>
					<span class="s-label">{s.label}</span>
					<span class="s-value">{s.value}</span>
					<span class="s-sub">{s.sub}</span>
				</div>
			{/each}
		</section>

		<div class="cols">
			<section class="card">
				<div class="card-head">
					<h2>Recent orders</h2>
					<span class="quiet">All orders</span>
				</div>
				<table>
					<thead>
						<tr>
							<th>Order</th><th>Customer</th><th>Status</th><th>Payment</th>
							<th class="r">Total</th><th class="r">Time</th>
						</tr>
					</thead>
					<tbody>
						{#each recent.slice(0, 7) as o (o.id)}
							{@const os = orderState(o.status)}
							{@const ps = paymentState(o.payment_state)}
							<tr>
								<td class="mono id">{o.number}</td>
								<td>
									<span class="who">{o.recipient}</span>
									<span class="where">{o.district_name}</span>
								</td>
								<td><span class="dot" data-tone={os.tone}></span>{os.word}</td>
								<td><span class="tag" data-tone={ps.tone}>{ps.word}</span></td>
								<td class="r mono">{formatMinor(o.total_minor, o.currency)}</td>
								<td class="r mono quiet">{o.ago}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</section>

			<div class="side">
				<section class="card">
					<div class="card-head"><h2>Needs a person</h2></div>
					<ul class="issues">
						{#each issues.slice(0, 4) as i (i.id)}
							<li>
								<span class="dot" data-tone={severityTone(i.severity)}></span>
								<span class="i-text">{i.detail}</span>
								{#if i.expected_minor ?? i.actual_minor}
									<span class="mono i-amt">
										{formatMinor(i.expected_minor ?? i.actual_minor ?? 0, f.currency)}
									</span>
								{/if}
							</li>
						{/each}
					</ul>
				</section>

				<section class="card">
					<div class="card-head"><h2>Running out</h2></div>
					<ul class="issues">
						{#each low.slice(0, 4) as l (l.variant_id)}
							<li>
								<span class="dot" data-tone={l.available <= 0 ? 'danger' : 'warning'}></span>
								<span class="i-text">{l.title}<span class="quiet"> · {l.variant_title}</span></span>
								<span class="mono i-amt">{l.available}</span>
							</li>
						{/each}
					</ul>
				</section>
			</div>
		</div>
	</main>
</div>

<style>
	.app {
		display: grid;
		grid-template-columns: 224px minmax(0, 1fr);
		min-height: 720px;
		background: var(--a-bg);
		color: var(--a-ink);
		font-size: 13px;
		line-height: 1.45;

		--a-bg: #fbfbfc;
		--a-panel: #ffffff;
		--a-rail: #f4f4f6;
		--a-line: #e6e6ea;
		--a-ink: #16161a;
		--a-muted: #6a6a76;
		--a-faint: #9a9aa6;
		--a-brand: #4a7c0b;
		--a-radius: 7px;
	}

	:global([data-theme='dark']) .app {
		--a-bg: #0d0d10;
		--a-panel: #141418;
		--a-rail: #101014;
		--a-line: #24242b;
		--a-ink: #ececef;
		--a-muted: #9797a2;
		--a-faint: #6b6b76;
		--a-brand: #a8d92b;
	}

	.rail {
		display: flex;
		flex-direction: column;
		gap: 4px;
		padding: 14px 10px;
		background: var(--a-rail);
		border-right: 1px solid var(--a-line);
	}

	.shop {
		display: flex;
		align-items: center;
		gap: 9px;
		padding: 6px 8px 14px;
	}

	.mark {
		display: grid;
		place-items: center;
		width: 26px;
		height: 26px;
		border-radius: var(--a-radius);
		background: var(--a-brand);
		color: #fff;
		font-size: 13px;
		font-weight: 600;
	}

	.name {
		font-weight: 600;
		font-size: 13px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	nav {
		display: flex;
		flex-direction: column;
		gap: 1px;
	}

	.item {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 7px 9px;
		border-radius: 6px;
		color: var(--a-muted);
		cursor: default;
	}

	.item:hover {
		background: color-mix(in oklab, var(--a-ink) 6%, transparent);
	}

	.item.on {
		background: var(--a-panel);
		color: var(--a-ink);
		font-weight: 550;
		box-shadow: 0 0 0 1px var(--a-line);
	}

	.txt {
		flex: 1;
	}

	.badge {
		min-width: 19px;
		padding: 1px 5px;
		border-radius: 20px;
		background: color-mix(in oklab, var(--a-ink) 9%, transparent);
		font-size: 11px;
		text-align: center;
		font-variant-numeric: tabular-nums;
	}

	.badge[data-tone='danger'] {
		background: var(--danger);
		color: #fff;
	}

	.foot {
		margin-top: auto;
		padding-top: 10px;
		border-top: 1px solid var(--a-line);
	}

	.body {
		padding: 20px 24px 40px;
		min-width: 0;
	}

	.top {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 20px;
		margin-bottom: 18px;
	}

	h1 {
		font-size: 19px;
		font-weight: 600;
		letter-spacing: -0.015em;
		margin: 0;
	}

	.sub {
		margin: 2px 0 0;
		color: var(--a-faint);
		font-size: 12.5px;
	}

	.acts {
		display: flex;
		gap: 8px;
	}

	.search,
	.btn {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		height: 31px;
		padding: 0 11px;
		border-radius: 6px;
		font-size: 12.5px;
		white-space: nowrap;
	}

	.search {
		border: 1px solid var(--a-line);
		background: var(--a-panel);
		color: var(--a-faint);
		min-width: 190px;
	}

	.btn {
		background: var(--a-brand);
		color: #fff;
		font-weight: 550;
	}

	.cod {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		padding: 16px 18px;
		margin-bottom: 12px;
		border-radius: var(--a-radius);
		border: 1px solid var(--a-line);
		border-left: 3px solid var(--warning);
		background: var(--a-panel);
	}

	.cod-label {
		display: block;
		font-size: 12px;
		color: var(--a-muted);
	}

	.cod-value {
		display: block;
		margin: 3px 0 2px;
		font-size: 30px;
		font-weight: 600;
		letter-spacing: -0.025em;
		font-variant-numeric: tabular-nums;
	}

	.cod-sub {
		font-size: 12.5px;
		color: var(--a-faint);
	}

	.cod-side {
		display: flex;
		align-items: center;
		gap: 14px;
	}

	.pill {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 4px 10px;
		border-radius: 20px;
		font-size: 12px;
		background: var(--danger-soft);
		color: var(--danger);
		font-weight: 550;
	}

	.link {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		color: var(--a-brand);
		font-weight: 550;
		font-size: 12.5px;
	}

	.stats {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
		gap: 10px;
		margin-bottom: 14px;
	}

	.stat {
		padding: 13px 15px;
		border: 1px solid var(--a-line);
		border-radius: var(--a-radius);
		background: var(--a-panel);
	}

	.s-label {
		display: block;
		font-size: 12px;
		color: var(--a-muted);
	}

	.s-value {
		display: block;
		margin: 5px 0 3px;
		font-size: 22px;
		font-weight: 600;
		letter-spacing: -0.02em;
		font-variant-numeric: tabular-nums;
	}

	.stat[data-tone='warning'] .s-value {
		color: var(--warning);
	}

	.s-sub {
		font-size: 12px;
		color: var(--a-faint);
	}

	.cols {
		display: grid;
		gap: 12px;
	}

	@media (min-width: 1080px) {
		.cols {
			grid-template-columns: minmax(0, 1.9fr) minmax(0, 1fr);
		}
	}

	.side {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.card {
		border: 1px solid var(--a-line);
		border-radius: var(--a-radius);
		background: var(--a-panel);
		overflow: hidden;
	}

	.card-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 11px 15px;
		border-bottom: 1px solid var(--a-line);
	}

	h2 {
		margin: 0;
		font-size: 13px;
		font-weight: 600;
	}

	table {
		width: 100%;
		border-collapse: collapse;
	}

	th {
		text-align: left;
		font-size: 11.5px;
		font-weight: 500;
		color: var(--a-faint);
		padding: 8px 15px;
		border-bottom: 1px solid var(--a-line);
	}

	td {
		padding: 9px 15px;
		border-bottom: 1px solid var(--a-line);
		vertical-align: middle;
	}

	tbody tr:last-child td {
		border-bottom: none;
	}

	tbody tr:hover {
		background: color-mix(in oklab, var(--a-ink) 3%, transparent);
	}

	.r {
		text-align: right;
	}

	.mono {
		font-family: var(--font-mono);
		font-variant-numeric: tabular-nums;
		font-size: 12px;
	}

	.id {
		color: var(--a-brand);
		font-weight: 550;
	}

	.who {
		display: block;
	}

	.where {
		display: block;
		font-size: 11.5px;
		color: var(--a-faint);
	}

	.quiet {
		color: var(--a-faint);
	}

	.dot {
		display: inline-block;
		width: 6px;
		height: 6px;
		border-radius: 50%;
		margin-right: 7px;
		background: var(--a-faint);
		vertical-align: middle;
	}

	.dot[data-tone='success'] {
		background: var(--success);
	}
	.dot[data-tone='warning'] {
		background: var(--warning);
	}
	.dot[data-tone='danger'] {
		background: var(--danger);
	}
	.dot[data-tone='info'] {
		background: var(--info);
	}
	.dot[data-tone='accent'] {
		background: var(--a-brand);
	}

	.tag {
		display: inline-block;
		padding: 2px 7px;
		border-radius: 5px;
		font-size: 11.5px;
		background: color-mix(in oklab, var(--a-ink) 7%, transparent);
		color: var(--a-muted);
	}

	.tag[data-tone='success'] {
		background: var(--success-soft);
		color: var(--success);
	}
	.tag[data-tone='warning'] {
		background: var(--warning-soft);
		color: var(--warning);
	}
	.tag[data-tone='danger'] {
		background: var(--danger-soft);
		color: var(--danger);
	}

	.issues {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.issues li {
		display: flex;
		align-items: baseline;
		gap: 8px;
		padding: 10px 15px;
		border-bottom: 1px solid var(--a-line);
		font-size: 12.5px;
	}

	.issues li:last-child {
		border-bottom: none;
	}

	.i-text {
		flex: 1;
		min-width: 0;
		color: var(--a-muted);
	}

	.i-amt {
		white-space: nowrap;
		color: var(--a-ink);
	}
</style>
