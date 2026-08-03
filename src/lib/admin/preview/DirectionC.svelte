<script lang="ts">
	/* C — Operations console. For the person who has this open all day: every
	   row visible at once, a filter bar instead of navigation, and no
	   decoration competing with the numbers. */
	import Icon from './Icon.svelte';
	import { figures as f, recent, issues, low, shopName } from './data';
	import { formatMinor } from '$lib/utils/money';
	import { formatNumber } from '$lib/utils/format';
	import { orderState, paymentState, severityTone } from '$lib/admin/state';

	const tabs = ['Dashboard', 'Orders', 'Products', 'Money owed', 'Customers', 'Settings'];

	const strip = [
		{ label: 'Orders', value: formatNumber(f.orders_today), sub: 'today' },
		{ label: 'Sales', value: formatMinor(f.sales_today_minor, f.currency), sub: 'today' },
		{ label: 'Confirm', value: formatNumber(f.awaiting_confirmation), tone: 'info' },
		{ label: 'Send', value: formatNumber(f.awaiting_dispatch), tone: 'warning' },
		{ label: 'In transit', value: formatNumber(f.in_transit) },
		{ label: 'Out of stock', value: formatNumber(f.out_of_stock), tone: 'danger' }
	];
</script>

<div class="app">
	<header class="chrome">
		<span class="shop"><span class="mark">র</span>{shopName}</span>
		<nav>
			{#each tabs as t, i (t)}
				<span class="tab" class:on={i === 0}>{t}</span>
			{/each}
		</nav>
		<span class="right">
			<span class="clock">14:56</span>
			<span class="who">রহিম</span>
		</span>
	</header>

	<!-- One strip, everything at a glance. Cash with couriers is pinned to the
	     right and boxed, because it is the number that funds the shop. -->
	<div class="strip">
		{#each strip as s (s.label)}
			<span class="cell" data-tone={s.tone ?? 'plain'}>
				<span class="c-label">{s.label}</span>
				<span class="c-value">{s.value}</span>
				{#if s.sub}<span class="c-sub">{s.sub}</span>{/if}
			</span>
		{/each}
		<span class="cell cod">
			<span class="c-label">Cash with couriers</span>
			<span class="c-value">{formatMinor(f.outstanding_cod_minor, f.currency)}</span>
			<span class="c-sub"
				>{formatNumber(f.outstanding_parcels)} parcels · {f.critical_issues} critical</span
			>
		</span>
	</div>

	<div class="split">
		<section class="pane">
			<div class="pane-bar">
				<span class="title">Orders</span>
				<span class="filters">
					<span class="f on">All <b>842</b></span>
					<span class="f">To send <b>{f.awaiting_dispatch}</b></span>
					<span class="f">In transit <b>{f.in_transit}</b></span>
					<span class="f">Problems <b>{f.open_issues}</b></span>
				</span>
				<span class="tools">
					<span class="tool"><Icon name="filter" size={13} /></span>
					<span class="tool"><Icon name="refresh" size={13} /></span>
				</span>
			</div>

			<table>
				<thead>
					<tr>
						<th>Time</th><th>Order</th><th>Customer</th><th>District</th>
						<th>Status</th><th>Payment</th><th class="r">Items</th><th class="r">Total</th>
					</tr>
				</thead>
				<tbody>
					{#each recent as o (o.id)}
						{@const os = orderState(o.status)}
						{@const ps = paymentState(o.payment_state)}
						<tr>
							<td class="dim">{o.clock}</td>
							<td class="id">{o.number}</td>
							<td class="name">{o.recipient}</td>
							<td class="dim">{o.district_name}</td>
							<td><span class="bar-tone" data-tone={os.tone}></span>{os.word}</td>
							<td><span class="bar-tone" data-tone={ps.tone}></span>{ps.word}</td>
							<td class="r dim">{o.items}</td>
							<td class="r num">{formatMinor(o.total_minor, o.currency)}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</section>

		<aside class="pane rail">
			<div class="pane-bar">
				<span class="title">Money owed</span>
				<span class="count" data-tone="danger">{f.open_issues}</span>
			</div>
			<ul>
				{#each issues as i (i.id)}
					<li>
						<span class="sev" data-tone={severityTone(i.severity)}>{i.severity.slice(0, 4)}</span>
						<span class="l-text">{i.detail}</span>
						{#if i.expected_minor ?? i.actual_minor}
							<span class="num"
								>{formatMinor(i.expected_minor ?? i.actual_minor ?? 0, f.currency)}</span
							>
						{/if}
					</li>
				{/each}
			</ul>

			<div class="pane-bar sub">
				<span class="title">Running out</span>
				<span class="count" data-tone="warning">{low.length}</span>
			</div>
			<ul>
				{#each low as l (l.variant_id)}
					<li>
						<span class="sev" data-tone={l.available <= 0 ? 'danger' : 'warning'}>
							{l.available <= 0 ? 'out' : 'low'}
						</span>
						<span class="l-text">{l.title}<span class="dim"> {l.variant_title}</span></span>
						<span class="num">{l.available}</span>
					</li>
				{/each}
			</ul>
		</aside>
	</div>
</div>

<style>
	.app {
		min-height: 720px;
		background: var(--c-bg);
		color: var(--c-ink);
		font-size: 12.5px;
		line-height: 1.4;

		--c-bg: #ffffff;
		--c-panel: #fcfcfd;
		--c-line: #e3e4e8;
		--c-line-soft: #eeeff2;
		--c-ink: #121317;
		--c-muted: #5c626d;
		--c-faint: #90959f;
		--c-brand: #4a7c0b;
	}

	:global([data-theme='dark']) .app {
		--c-bg: #0a0b0d;
		--c-panel: #101115;
		--c-line: #23252b;
		--c-line-soft: #1a1c21;
		--c-ink: #e8eaee;
		--c-muted: #969ba5;
		--c-faint: #676c76;
		--c-brand: #a8d92b;
	}

	.chrome {
		display: flex;
		align-items: center;
		gap: 22px;
		height: 40px;
		padding: 0 14px;
		background: var(--c-panel);
		border-bottom: 1px solid var(--c-line);
	}

	.shop {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		font-weight: 600;
		font-size: 12.5px;
		white-space: nowrap;
	}

	.mark {
		display: grid;
		place-items: center;
		width: 20px;
		height: 20px;
		border-radius: 4px;
		background: var(--c-brand);
		color: #fff;
		font-size: 11px;
	}

	nav {
		display: flex;
		gap: 2px;
		flex: 1;
	}

	.tab {
		padding: 5px 10px;
		border-radius: 4px;
		color: var(--c-muted);
	}

	.tab.on {
		background: color-mix(in oklab, var(--c-ink) 8%, transparent);
		color: var(--c-ink);
		font-weight: 600;
	}

	.right {
		display: inline-flex;
		align-items: center;
		gap: 12px;
		color: var(--c-faint);
	}

	.clock {
		font-family: var(--font-mono);
		font-variant-numeric: tabular-nums;
	}

	.who {
		color: var(--c-ink);
	}

	.strip {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
		border-bottom: 1px solid var(--c-line);
		background: var(--c-panel);
	}

	.cell {
		display: block;
		padding: 9px 14px;
		border-right: 1px solid var(--c-line-soft);
	}

	.c-label {
		display: block;
		font-size: 10.5px;
		text-transform: uppercase;
		letter-spacing: 0.07em;
		color: var(--c-faint);
	}

	.c-value {
		display: block;
		margin-top: 2px;
		font-family: var(--font-mono);
		font-size: 17px;
		font-variant-numeric: tabular-nums;
		letter-spacing: -0.02em;
	}

	.c-sub {
		font-size: 11px;
		color: var(--c-faint);
	}

	.cell[data-tone='warning'] .c-value {
		color: var(--warning);
	}
	.cell[data-tone='danger'] .c-value {
		color: var(--danger);
	}
	.cell[data-tone='info'] .c-value {
		color: var(--info);
	}

	.cod {
		grid-column: span 2;
		background: var(--warning-soft);
		border-left: 2px solid var(--warning);
		border-right: none;
	}

	.cod .c-value {
		color: var(--warning);
		font-size: 20px;
	}

	.split {
		display: grid;
		align-items: start;
	}

	@media (min-width: 1100px) {
		.split {
			grid-template-columns: minmax(0, 1fr) 340px;
		}
	}

	.pane {
		min-width: 0;
	}

	.rail {
		border-left: 1px solid var(--c-line);
	}

	.pane-bar {
		display: flex;
		align-items: center;
		gap: 14px;
		height: 34px;
		padding: 0 12px;
		border-bottom: 1px solid var(--c-line);
		background: var(--c-panel);
	}

	.sub {
		border-top: 1px solid var(--c-line);
	}

	.title {
		font-weight: 600;
		white-space: nowrap;
	}

	.filters {
		display: flex;
		gap: 3px;
		flex: 1;
	}

	.f {
		padding: 3px 8px;
		border-radius: 4px;
		color: var(--c-muted);
		white-space: nowrap;
	}

	.f b {
		font-family: var(--font-mono);
		font-weight: 500;
		color: var(--c-faint);
		margin-left: 4px;
	}

	.f.on {
		background: color-mix(in oklab, var(--c-ink) 8%, transparent);
		color: var(--c-ink);
	}

	.tools {
		display: flex;
		gap: 4px;
	}

	.tool {
		display: grid;
		place-items: center;
		width: 24px;
		height: 24px;
		border-radius: 4px;
		border: 1px solid var(--c-line);
		color: var(--c-muted);
	}

	.count {
		font-family: var(--font-mono);
		padding: 1px 6px;
		border-radius: 3px;
		font-size: 11px;
	}

	.count[data-tone='danger'] {
		background: var(--danger-soft);
		color: var(--danger);
	}
	.count[data-tone='warning'] {
		background: var(--warning-soft);
		color: var(--warning);
	}

	table {
		width: 100%;
		border-collapse: collapse;
	}

	th {
		position: sticky;
		top: 0;
		text-align: left;
		font-size: 10.5px;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--c-faint);
		padding: 6px 12px;
		background: var(--c-bg);
		border-bottom: 1px solid var(--c-line);
	}

	td {
		padding: 6px 12px;
		border-bottom: 1px solid var(--c-line-soft);
		white-space: nowrap;
	}

	tbody tr:hover {
		background: color-mix(in oklab, var(--c-ink) 4%, transparent);
	}

	.r {
		text-align: right;
	}

	.id,
	.num,
	.dim {
		font-family: var(--font-mono);
		font-variant-numeric: tabular-nums;
	}

	.id {
		color: var(--c-brand);
	}

	.name {
		color: var(--c-ink);
	}

	.dim {
		color: var(--c-faint);
	}

	.num {
		color: var(--c-ink);
	}

	/* A short bar rather than a pill: it reads as fast and costs one line. */
	.bar-tone {
		display: inline-block;
		width: 3px;
		height: 11px;
		margin-right: 7px;
		border-radius: 1px;
		background: var(--c-faint);
		vertical-align: -1px;
	}

	.bar-tone[data-tone='success'] {
		background: var(--success);
	}
	.bar-tone[data-tone='warning'] {
		background: var(--warning);
	}
	.bar-tone[data-tone='danger'] {
		background: var(--danger);
	}
	.bar-tone[data-tone='info'] {
		background: var(--info);
	}
	.bar-tone[data-tone='accent'] {
		background: var(--c-brand);
	}

	ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	li {
		display: flex;
		align-items: baseline;
		gap: 9px;
		padding: 8px 12px;
		border-bottom: 1px solid var(--c-line-soft);
	}

	.sev {
		flex: none;
		width: 34px;
		font-family: var(--font-mono);
		font-size: 10px;
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	.sev[data-tone='danger'] {
		color: var(--danger);
	}
	.sev[data-tone='warning'] {
		color: var(--warning);
	}
	.sev[data-tone='info'] {
		color: var(--info);
	}

	.l-text {
		flex: 1;
		min-width: 0;
		color: var(--c-muted);
		white-space: normal;
	}
</style>
