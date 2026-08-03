<script lang="ts">
	/* F — Terminal. Dark, icon-only rail, a KPI row with movement against last
	   week, and a chart you read a value off. Built for someone watching money
	   move rather than someone catching up on the day. */
	import Icon from './Icon.svelte';
	import { figures as f, recent, issues, low, shopName } from './data';
	import { formatMinor } from '$lib/utils/money';
	import { formatNumber } from '$lib/utils/format';
	import { orderState, severityTone } from '$lib/admin/state';

	const rail = ['home', 'orders', 'products', 'money', 'customers', 'truck', 'settings'];
	const tabs = ['Overview', 'Orders', 'Money owed'];

	const kpis = [
		{
			label: 'Sales today',
			value: formatMinor(f.sales_today_minor, f.currency),
			delta: '+12.4%',
			up: true,
			note: 'vs last Sunday'
		},
		{
			label: 'Orders today',
			value: formatNumber(f.orders_today),
			delta: '+6',
			up: true,
			note: 'vs last Sunday'
		},
		{
			label: 'Average order',
			value: formatMinor(Math.round(f.sales_today_minor / f.orders_today), f.currency),
			delta: '-2.1%',
			up: false,
			note: 'vs this month'
		},
		{
			label: 'Cash with couriers',
			value: formatMinor(f.outstanding_cod_minor, f.currency),
			delta: `${f.outstanding_parcels} parcels`,
			up: false,
			note: 'not yet paid over',
			warn: true
		},
		{ label: 'Delivered rate', value: '91.4%', delta: '+1.8%', up: true, note: 'last 30 days' }
	];

	// Two weeks of daily sales; the marker sits on the day being read.
	const series = [
		2680, 3120, 2940, 4010, 3760, 5220, 4732, 3980, 4410, 3620, 5010, 4880, 5640, 4732
	];
	const peak = Math.max(...series);
	const pts = series.map((v, i) => [(i / (series.length - 1)) * 100, 46 - (v / peak) * 40]);
	const line = pts.map(([x, y]) => `${x},${y}`).join(' ');
	const area = `0,46 ${line} 100,46`;
	const markIndex = 12;
	const [mx, my] = pts[markIndex];

	const movers = {
		up: [
			{ name: 'ঢাকাই জামদানি শাড়ি', d: '+18.2%' },
			{ name: 'নকশি কাঁথা', d: '+11.4%' },
			{ name: 'খাঁটি সরিষার তেল', d: '+6.7%' }
		],
		down: [
			{ name: 'হাতে বোনা চাদর', d: '-9.8%' },
			{ name: 'মাটির চায়ের কাপ', d: '-4.2%' }
		]
	};

	const share = [
		{ name: 'শাড়ি', pct: 38, amount: 4180000 },
		{ name: 'গৃহসজ্জা', pct: 27, amount: 2970000 },
		{ name: 'খাবার', pct: 21, amount: 2310000 },
		{ name: 'অন্যান্য', pct: 14, amount: 1540000 }
	];

	const kickerFor = (kind: string) =>
		kind === 'delivered_not_remitted'
			? 'COURIER · PATHAO'
			: kind === 'unknown_consignment'
				? 'STATEMENT · UNKNOWN'
				: kind === 'duplicate_remittance'
					? 'STATEMENT · DUPLICATE'
					: 'COURIER · STEADFAST';
</script>

<div class="app">
	<aside class="rail">
		<span class="logo">র</span>
		{#each rail as name, i (name)}
			<span class="r-icon" class:on={i === 0}><Icon {name} size={17} /></span>
		{/each}
	</aside>

	<div class="main">
		<header class="bar">
			<span class="page">Overview</span>
			<span class="tabs">
				{#each tabs as t, i (t)}
					<span class="tab" class:on={i === 0}>{t}</span>
				{/each}
			</span>
			<span class="bar-right">
				<span class="ctl"><Icon name="down" size={13} /> This week</span>
				<span class="ctl accent"><Icon name="refresh" size={13} /> Sync couriers</span>
				<span class="user">
					<span class="face">রহ</span>
					<span class="u-text">
						<span class="u-name">{shopName}</span>
						<span class="u-sub">Growth plan</span>
					</span>
				</span>
			</span>
		</header>

		<div class="scroll">
			<section class="kpis">
				{#each kpis as k (k.label)}
					<div class="kpi" class:warn={k.warn}>
						<span class="k-label">{k.label}</span>
						<span class="k-value">{k.value}</span>
						<span class="k-foot">
							<span class="delta" data-dir={k.up ? 'up' : 'down'} data-warn={k.warn ? 'y' : 'n'}>
								{k.up ? '▲' : '▼'}
								{k.delta}
							</span>
							<span class="k-note">{k.note}</span>
						</span>
					</div>
				{/each}
			</section>

			<div class="row">
				<section class="panel chart">
					<div class="p-bar">
						<span class="p-title">Sales, last 14 days</span>
						<span class="legend">
							<span><i class="sw sales"></i> Sales</span>
							<span><i class="sw avg"></i> Average</span>
						</span>
						<span class="stats">
							<span class="stat-chip">Best ৳56,400</span>
							<span class="stat-chip">Avg ৳42,180</span>
						</span>
					</div>

					<svg viewBox="0 0 100 52" preserveAspectRatio="none" aria-hidden="true">
						{#each [6, 16, 26, 36, 46] as y (y)}
							<line class="grid" x1="0" x2="100" y1={y} y2={y} />
						{/each}
						<polygon class="fill" points={area} />
						<polyline class="avg-line" points="0,26 100,24" />
						<polyline class="line" points={line} />
						<line class="cross" x1={mx} x2={mx} y1="0" y2="46" />
						<circle class="mark" cx={mx} cy={my} r="2.4" />
					</svg>

					<div class="axis">
						{#each ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as d (d)}
							<span>{d}</span>
						{/each}
					</div>

					<!-- The tooltip is pinned rather than hovered: a still image of a
					     chart should still say what a point is worth. -->
					<div class="tip" style="left: {mx}%">
						<span class="t-day">Saturday</span>
						<span class="t-row"><i class="sw sales"></i> Sales <b>৳56,400</b></span>
						<span class="t-row"><i class="sw avg"></i> Average <b>৳42,180</b></span>
					</div>
				</section>

				<section class="panel">
					<div class="p-bar">
						<span class="p-title">Share of sales</span>
						<span class="view">This month</span>
					</div>
					<table class="holdings">
						<thead>
							<tr><th>Category</th><th class="r">Sales</th><th>Share</th></tr>
						</thead>
						<tbody>
							{#each share as s (s.name)}
								<tr>
									<td class="h-name">{s.name}</td>
									<td class="r num">{formatMinor(s.amount, f.currency)}</td>
									<td class="w-cell">
										<span class="w-bar"><span style="width: {s.pct}%"></span></span>
										<span class="w-pct">{s.pct}%</span>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</section>
			</div>

			<div class="row three">
				<section class="panel">
					<div class="p-bar"><span class="p-title">Orders now</span></div>
					<table class="orders">
						<tbody>
							{#each recent.slice(0, 6) as o (o.id)}
								{@const os = orderState(o.status)}
								<tr>
									<td class="num dim">{o.clock}</td>
									<td class="id">{o.number}</td>
									<td class="h-name">{o.recipient}</td>
									<td><span class="tone-dot" data-tone={os.tone}></span>{os.word}</td>
									<td class="r num">{formatMinor(o.total_minor, o.currency)}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</section>

				<section class="panel">
					<div class="p-bar"><span class="p-title">Moving</span></div>
					<div class="movers">
						<div>
							<span class="m-head up">SELLING MORE</span>
							{#each movers.up as m (m.name)}
								<span class="m-row"
									><span class="m-name">{m.name}</span><span class="up">{m.d}</span></span
								>
							{/each}
						</div>
						<div>
							<span class="m-head down">SELLING LESS</span>
							{#each movers.down as m (m.name)}
								<span class="m-row"
									><span class="m-name">{m.name}</span><span class="down">{m.d}</span></span
								>
							{/each}
							{#each low.slice(0, 1) as l (l.variant_id)}
								<span class="m-row"
									><span class="m-name">{l.title}</span><span class="down">out</span></span
								>
							{/each}
						</div>
					</div>
				</section>

				<section class="panel">
					<div class="p-bar">
						<span class="p-title">Money owed</span>
						<span class="view">{f.open_issues} open</span>
					</div>
					<div class="news">
						{#each issues.slice(0, 4) as i (i.id)}
							<div class="item">
								<span class="kick" data-tone={severityTone(i.severity)}>{kickerFor(i.kind)}</span>
								<span class="i-text">{i.detail}</span>
								{#if i.expected_minor ?? i.actual_minor}
									<span class="i-amt num">
										{formatMinor(i.expected_minor ?? i.actual_minor ?? 0, f.currency)}
									</span>
								{/if}
							</div>
						{/each}
					</div>
				</section>
			</div>
		</div>
	</div>
</div>

<style>
	.app {
		display: grid;
		grid-template-columns: 52px minmax(0, 1fr);
		min-height: 760px;
		background: #0a0a0b;
		color: #e9eaec;
		font-size: 12.5px;
		line-height: 1.45;

		--f-panel: #121214;
		--f-line: #212226;
		--f-soft: #1a1b1e;
		--f-muted: #8d9099;
		--f-faint: #62656d;
		--f-up: #35c07a;
		--f-down: #f0625a;
		--f-warn: #e2a83c;
		--f-accent: #a8d92b;
	}

	.rail {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 5px;
		padding: 12px 0;
		background: var(--f-panel);
		border-right: 1px solid var(--f-line);
	}

	.logo {
		display: grid;
		place-items: center;
		width: 28px;
		height: 28px;
		border-radius: 8px;
		background: var(--f-accent);
		color: #101410;
		font-weight: 700;
		margin-bottom: 12px;
	}

	.r-icon {
		display: grid;
		place-items: center;
		width: 32px;
		height: 32px;
		border-radius: 8px;
		color: var(--f-faint);
	}

	.r-icon.on {
		background: var(--f-soft);
		color: var(--f-accent);
	}

	.bar {
		display: flex;
		align-items: center;
		gap: 20px;
		height: 48px;
		padding: 0 16px;
		border-bottom: 1px solid var(--f-line);
		background: var(--f-panel);
	}

	.page {
		font-size: 14px;
		font-weight: 600;
	}

	.tabs {
		display: flex;
		gap: 16px;
		flex: 1;
	}

	.tab {
		padding: 4px 0;
		color: var(--f-muted);
		border-bottom: 2px solid transparent;
	}

	.tab.on {
		color: #fff;
		border-bottom-color: var(--f-accent);
	}

	.bar-right {
		display: flex;
		align-items: center;
		gap: 9px;
	}

	.ctl {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 6px 11px;
		border: 1px solid var(--f-line);
		border-radius: 7px;
		color: var(--f-muted);
		white-space: nowrap;
	}

	.accent {
		border-color: color-mix(in oklab, var(--f-accent) 40%, transparent);
		color: var(--f-accent);
	}

	.user {
		display: inline-flex;
		align-items: center;
		gap: 9px;
		padding-left: 6px;
	}

	.face {
		display: grid;
		place-items: center;
		width: 28px;
		height: 28px;
		border-radius: 50%;
		background: var(--f-soft);
		font-size: 11px;
		font-weight: 600;
	}

	.u-name {
		display: block;
		font-size: 12px;
		font-weight: 600;
	}

	.u-sub {
		display: block;
		font-size: 11px;
		color: var(--f-faint);
	}

	.scroll {
		padding: 14px 16px 30px;
	}

	.kpis {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(168px, 1fr));
		gap: 10px;
		margin-bottom: 12px;
	}

	.kpi {
		padding: 13px 15px;
		border: 1px solid var(--f-line);
		border-radius: 10px;
		background: var(--f-panel);
	}

	.kpi.warn {
		border-color: color-mix(in oklab, var(--f-warn) 45%, transparent);
		background: linear-gradient(
			160deg,
			color-mix(in oklab, var(--f-warn) 9%, var(--f-panel)),
			var(--f-panel)
		);
	}

	.k-label {
		display: block;
		font-size: 11.5px;
		color: var(--f-muted);
	}

	.k-value {
		display: block;
		margin: 7px 0 6px;
		font-size: 22px;
		font-weight: 600;
		letter-spacing: -0.02em;
		font-variant-numeric: tabular-nums;
	}

	.k-foot {
		display: flex;
		align-items: baseline;
		gap: 7px;
		font-size: 11.5px;
	}

	.delta[data-dir='up'] {
		color: var(--f-up);
	}
	.delta[data-dir='down'] {
		color: var(--f-down);
	}
	.delta[data-warn='y'] {
		color: var(--f-warn);
	}

	.k-note {
		color: var(--f-faint);
	}

	.row {
		display: grid;
		gap: 10px;
		margin-bottom: 10px;
	}

	@media (min-width: 1100px) {
		.row {
			grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr);
		}
		.three {
			grid-template-columns: minmax(0, 1.25fr) minmax(0, 0.85fr) minmax(0, 1fr);
		}
	}

	.panel {
		border: 1px solid var(--f-line);
		border-radius: 10px;
		background: var(--f-panel);
		overflow: hidden;
	}

	.p-bar {
		display: flex;
		align-items: center;
		gap: 14px;
		padding: 11px 14px;
		border-bottom: 1px solid var(--f-line);
	}

	.p-title {
		font-size: 12.5px;
		font-weight: 600;
	}

	.legend {
		display: flex;
		gap: 14px;
		flex: 1;
		color: var(--f-muted);
		font-size: 11.5px;
	}

	.legend span {
		display: inline-flex;
		align-items: center;
		gap: 6px;
	}

	.sw {
		width: 8px;
		height: 2px;
		border-radius: 2px;
	}

	.sales {
		background: var(--f-accent);
	}
	.avg {
		background: var(--f-faint);
	}

	.stats {
		display: flex;
		gap: 6px;
	}

	.stat-chip {
		padding: 3px 8px;
		border-radius: 5px;
		background: var(--f-soft);
		color: var(--f-muted);
		font-size: 11px;
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
	}

	.chart {
		position: relative;
	}

	.chart svg {
		display: block;
		width: 100%;
		height: 190px;
		padding: 12px 14px 0;
		box-sizing: border-box;
		overflow: visible;
	}

	.grid {
		stroke: var(--f-line);
		stroke-width: 1;
		vector-effect: non-scaling-stroke;
	}

	.fill {
		fill: color-mix(in oklab, var(--f-accent) 12%, transparent);
	}

	.line {
		fill: none;
		stroke: var(--f-accent);
		stroke-width: 1.8;
		stroke-linejoin: round;
		vector-effect: non-scaling-stroke;
	}

	.avg-line {
		fill: none;
		stroke: var(--f-faint);
		stroke-width: 1;
		stroke-dasharray: 3 3;
		vector-effect: non-scaling-stroke;
	}

	.cross {
		stroke: #fff;
		stroke-width: 1;
		stroke-dasharray: 2 2;
		opacity: 0.35;
		vector-effect: non-scaling-stroke;
	}

	.mark {
		fill: #0a0a0b;
		stroke: var(--f-accent);
		stroke-width: 2;
		vector-effect: non-scaling-stroke;
	}

	.axis {
		display: flex;
		justify-content: space-between;
		padding: 6px 14px 12px;
		color: var(--f-faint);
		font-size: 11px;
	}

	.tip {
		position: absolute;
		top: 26px;
		transform: translateX(-50%);
		padding: 8px 11px;
		border: 1px solid var(--f-line);
		border-radius: 8px;
		background: #17181b;
		box-shadow: 0 10px 24px -12px #000;
		white-space: nowrap;
	}

	.t-day {
		display: block;
		font-size: 11px;
		color: var(--f-faint);
		margin-bottom: 4px;
	}

	.t-row {
		display: flex;
		align-items: center;
		gap: 7px;
		font-size: 11.5px;
		color: var(--f-muted);
	}

	.t-row b {
		margin-left: auto;
		color: #fff;
		font-variant-numeric: tabular-nums;
	}

	table {
		width: 100%;
		border-collapse: collapse;
	}

	th {
		text-align: left;
		font-size: 10.5px;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--f-faint);
		padding: 8px 14px;
		border-bottom: 1px solid var(--f-line);
	}

	td {
		padding: 8px 14px;
		border-bottom: 1px solid var(--f-soft);
		white-space: nowrap;
	}

	tbody tr:last-child td {
		border-bottom: none;
	}

	.r {
		text-align: right;
	}

	.num,
	.id {
		font-family: var(--font-mono);
		font-variant-numeric: tabular-nums;
	}

	.id {
		color: var(--f-accent);
	}

	.dim {
		color: var(--f-faint);
	}

	.h-name {
		color: #e9eaec;
	}

	/* A weight bar reads as a proportion faster than the percentage does. */
	.w-cell {
		display: flex;
		align-items: center;
		gap: 9px;
		width: 130px;
	}

	.w-bar {
		flex: 1;
		height: 4px;
		border-radius: 3px;
		background: var(--f-soft);
		overflow: hidden;
	}

	.w-bar span {
		display: block;
		height: 100%;
		background: var(--f-accent);
	}

	.w-pct {
		font-size: 11px;
		color: var(--f-muted);
		font-variant-numeric: tabular-nums;
	}

	.tone-dot {
		display: inline-block;
		width: 5px;
		height: 5px;
		border-radius: 50%;
		margin-right: 7px;
		background: var(--f-faint);
		vertical-align: middle;
	}

	.tone-dot[data-tone='success'] {
		background: var(--f-up);
	}
	.tone-dot[data-tone='warning'] {
		background: var(--f-warn);
	}
	.tone-dot[data-tone='danger'] {
		background: var(--f-down);
	}
	.tone-dot[data-tone='info'] {
		background: #5b9bd6;
	}
	.tone-dot[data-tone='accent'] {
		background: var(--f-accent);
	}

	.movers {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0;
	}

	.movers > div {
		padding: 11px 14px;
	}

	.movers > div:first-child {
		border-right: 1px solid var(--f-line);
	}

	.m-head {
		display: block;
		margin-bottom: 8px;
		font-size: 10px;
		letter-spacing: 0.07em;
	}

	.m-head.up {
		color: var(--f-up);
	}
	.m-head.down {
		color: var(--f-down);
	}

	.m-row {
		display: flex;
		align-items: baseline;
		gap: 8px;
		padding: 5px 0;
		font-size: 11.5px;
	}

	.m-name {
		flex: 1;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		color: var(--f-muted);
	}

	.up {
		color: var(--f-up);
		font-variant-numeric: tabular-nums;
	}
	.down {
		color: var(--f-down);
		font-variant-numeric: tabular-nums;
	}

	.news {
		padding: 4px 0;
	}

	.item {
		padding: 9px 14px;
		border-bottom: 1px solid var(--f-soft);
	}

	.item:last-child {
		border-bottom: none;
	}

	/* The kicker says where the problem came from before the sentence does. */
	.kick {
		display: block;
		margin-bottom: 3px;
		font-size: 9.5px;
		letter-spacing: 0.08em;
		color: var(--f-faint);
	}

	.kick[data-tone='danger'] {
		color: var(--f-down);
	}
	.kick[data-tone='warning'] {
		color: var(--f-warn);
	}

	.i-text {
		display: block;
		font-size: 11.5px;
		color: var(--f-muted);
		white-space: normal;
	}

	.i-amt {
		display: block;
		margin-top: 3px;
		font-size: 11.5px;
		color: #fff;
	}
</style>
