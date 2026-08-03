<script lang="ts">
	/* E — Ambient. A tinted wash behind glass panels, a greeting rather than a
	   page title, and the day's work offered as things to tap. Calm: for a shop
	   owner who opens this on a phone between customers. */
	import Icon from './Icon.svelte';
	import { figures as f, recent, issues, low, shopName } from './data';
	import { formatMinor } from '$lib/utils/money';
	import { formatNumber } from '$lib/utils/format';
	import { orderState, severityTone } from '$lib/admin/state';

	const nav = [
		{ icon: 'home', label: 'Dashboard', active: true },
		{ icon: 'orders', label: 'Orders' },
		{ icon: 'products', label: 'Products' },
		{ icon: 'customers', label: 'Customers' }
	];

	// Nested like folders: the money section is where a shop owner digs.
	const money = [
		{ label: 'Money owed', badge: f.critical_issues },
		{ label: 'Statements' },
		{ label: 'Payouts' }
	];

	const actions = [
		{ icon: 'box', label: `Send ${f.awaiting_dispatch} parcels` },
		{ icon: 'orders', label: `Confirm ${f.awaiting_confirmation} orders` },
		{ icon: 'money', label: 'Import a statement' },
		{ icon: 'products', label: 'Add a product' }
	];
</script>

<div class="app">
	<aside class="rail">
		<span class="brand">{shopName}</span>

		<span class="new"><Icon name="plus" size={15} /> New order</span>

		<span class="quick"><Icon name="search" size={15} /> Search</span>

		<div class="nav-block">
			{#each nav as item (item.label)}
				<span class="nav" class:on={item.active}>
					<Icon name={item.icon} size={16} />
					{item.label}
				</span>
			{/each}
		</div>

		<span class="group">Money</span>
		<div class="nav-block">
			{#each money as m, i (m.label)}
				<span class="nav" class:child={i > 0}>
					{#if i === 0}<span class="folder" data-tone="warning"></span>{/if}
					{m.label}
					{#if m.badge}<span class="dot-badge">{m.badge}</span>{/if}
				</span>
			{/each}
		</div>
	</aside>

	<main class="body">
		<div class="hello">
			<div class="orb"></div>
			<h1>Good afternoon, রহিম</h1>
			<p>
				{formatNumber(f.orders_today)} orders today, {formatMinor(f.sales_today_minor, f.currency)} taken.
			</p>
		</div>

		<!-- The panel that would hold a prompt holds the money instead: it is
		     the thing this shop opens the app to check. -->
		<section class="glass hero">
			<span class="h-label">Cash with couriers</span>
			<span class="h-value">{formatMinor(f.outstanding_cod_minor, f.currency)}</span>
			<div class="h-foot">
				<span class="tagline">
					{formatNumber(f.outstanding_parcels)} parcels delivered, not yet paid over
				</span>
				<span class="pill warn"><Icon name="alert" size={13} /> {f.critical_issues} to chase</span>
			</div>
		</section>

		<div class="chips">
			{#each actions as a (a.label)}
				<span class="chip"><Icon name={a.icon} size={15} /> {a.label}</span>
			{/each}
		</div>

		<div class="split">
			<section>
				<h2>Latest orders</h2>
				<div class="cards">
					{#each recent.slice(0, 4) as o (o.id)}
						{@const os = orderState(o.status)}
						<div class="glass mini">
							<span class="m-top">
								<span class="m-name">{o.recipient}</span>
								<span class="state" data-tone={os.tone}>{os.word}</span>
							</span>
							<span class="m-sub">{o.number} · {o.district_name}</span>
							<span class="m-amt">{formatMinor(o.total_minor, o.currency)}</span>
						</div>
					{/each}
				</div>
			</section>

			<section>
				<h2>Worth a look</h2>
				<div class="stack">
					{#each issues.slice(0, 3) as i (i.id)}
						<div class="glass line" data-tone={severityTone(i.severity)}>
							<span class="l-text">{i.detail}</span>
							<span class="l-amt">
								{formatMinor(i.expected_minor ?? i.actual_minor ?? 0, f.currency)}
							</span>
						</div>
					{/each}
					{#each low.slice(0, 2) as l (l.variant_id)}
						<div class="glass line" data-tone={l.available <= 0 ? 'danger' : 'warning'}>
							<span class="l-text">
								{l.title}
								<span class="quiet"
									>· {l.available <= 0 ? 'out of stock' : `${l.available} left`}</span
								>
							</span>
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
		grid-template-columns: 244px minmax(0, 1fr);
		min-height: 760px;
		color: var(--e-ink);
		font-size: 13.5px;
		line-height: 1.5;
		background:
			radial-gradient(1100px 520px at 12% -8%, var(--e-wash-a), transparent 62%),
			radial-gradient(900px 480px at 88% 4%, var(--e-wash-b), transparent 58%), var(--e-bg);

		--e-bg: #f2f3f8;
		--e-wash-a: #d9defb;
		--e-wash-b: #e6dcf7;
		--e-glass: rgba(255, 255, 255, 0.72);
		--e-edge: rgba(255, 255, 255, 0.9);
		--e-ink: #1a1b24;
		--e-muted: #5f6272;
		--e-faint: #8f92a3;
		--e-accent: #5b5bd6;
		--e-r: 18px;
	}

	:global([data-theme='dark']) .app {
		--e-bg: #0b0c12;
		--e-wash-a: #1c1f3d;
		--e-wash-b: #221a38;
		--e-glass: rgba(28, 30, 42, 0.68);
		--e-edge: rgba(255, 255, 255, 0.07);
		--e-ink: #e9eaf2;
		--e-muted: #9b9db0;
		--e-faint: #71748a;
		--e-accent: #9b9bf0;
	}

	.rail {
		display: flex;
		flex-direction: column;
		gap: 5px;
		padding: 20px 14px;
		border-right: 1px solid var(--e-edge);
	}

	.brand {
		padding: 2px 8px 18px;
		font-size: 16px;
		font-weight: 650;
		letter-spacing: -0.02em;
	}

	.new {
		display: flex;
		align-items: center;
		gap: 9px;
		padding: 11px 14px;
		border-radius: 14px;
		background: var(--e-glass);
		border: 1px solid var(--e-edge);
		box-shadow: 0 6px 18px -10px rgba(30, 30, 60, 0.4);
		font-weight: 600;
		margin-bottom: 6px;
	}

	.quick {
		display: flex;
		align-items: center;
		gap: 9px;
		padding: 9px 14px;
		color: var(--e-muted);
	}

	.nav-block {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.nav {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 9px 14px;
		border-radius: 12px;
		color: var(--e-muted);
	}

	.nav.on {
		background: var(--e-glass);
		color: var(--e-ink);
		font-weight: 600;
	}

	.child {
		padding-left: 34px;
		font-size: 12.5px;
	}

	.group {
		padding: 16px 14px 6px;
		font-size: 11.5px;
		color: var(--e-faint);
	}

	.folder {
		width: 13px;
		height: 11px;
		border-radius: 3px;
		background: var(--warning);
		flex: none;
	}

	.dot-badge {
		margin-left: auto;
		min-width: 19px;
		padding: 1px 6px;
		border-radius: 20px;
		background: var(--danger);
		color: #fff;
		font-size: 11px;
		text-align: center;
	}

	.body {
		padding: 30px 26px 44px;
		min-width: 0;
	}

	.hello {
		text-align: center;
		margin-bottom: 22px;
	}

	/* A soft mark instead of a logo lockup: it belongs to the mood, not the brand. */
	.orb {
		width: 62px;
		height: 62px;
		margin: 0 auto 14px;
		border-radius: 50%;
		background:
			radial-gradient(circle at 32% 30%, #fff, transparent 45%),
			linear-gradient(140deg, #b9c0ff, #efc7e8 52%, #ffd9b0);
		box-shadow: 0 10px 26px -12px rgba(70, 60, 140, 0.55);
	}

	h1 {
		margin: 0;
		font-size: 27px;
		font-weight: 600;
		letter-spacing: -0.025em;
	}

	.hello p {
		margin: 5px 0 0;
		color: var(--e-muted);
	}

	.glass {
		background: var(--e-glass);
		border: 1px solid var(--e-edge);
		border-radius: var(--e-r);
		-webkit-backdrop-filter: blur(14px);
		backdrop-filter: blur(14px);
	}

	.hero {
		padding: 22px 24px;
		margin-bottom: 14px;
		box-shadow: 0 18px 40px -28px rgba(40, 40, 90, 0.5);
	}

	.h-label {
		font-size: 13px;
		color: var(--e-muted);
	}

	.h-value {
		display: block;
		margin: 6px 0 12px;
		font-size: 42px;
		font-weight: 650;
		letter-spacing: -0.035em;
		line-height: 1;
		font-variant-numeric: tabular-nums;
	}

	.h-foot {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
	}

	.tagline {
		color: var(--e-muted);
		font-size: 13px;
	}

	.pill {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 5px 12px;
		border-radius: 999px;
		font-size: 12px;
		font-weight: 600;
	}

	.warn {
		background: var(--warning-soft);
		color: var(--warning);
	}

	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		margin-bottom: 26px;
	}

	.chip {
		display: inline-flex;
		align-items: center;
		gap: 9px;
		padding: 10px 16px;
		border-radius: 999px;
		background: var(--e-glass);
		border: 1px solid var(--e-edge);
		font-size: 12.5px;
		color: var(--e-ink);
	}

	.split {
		display: grid;
		gap: 22px;
	}

	@media (min-width: 1000px) {
		.split {
			grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
		}
	}

	h2 {
		margin: 0 0 12px;
		font-size: 14px;
		font-weight: 650;
		color: var(--e-muted);
	}

	.cards {
		display: grid;
		gap: 10px;
	}

	@media (min-width: 620px) {
		.cards {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	.mini {
		padding: 14px 16px;
	}

	.m-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
	}

	.m-name {
		font-weight: 600;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.state {
		padding: 3px 9px;
		border-radius: 999px;
		font-size: 11px;
		font-weight: 600;
		background: rgba(140, 140, 170, 0.16);
		color: var(--e-muted);
		white-space: nowrap;
	}

	.state[data-tone='success'] {
		background: var(--success-soft);
		color: var(--success);
	}
	.state[data-tone='warning'] {
		background: var(--warning-soft);
		color: var(--warning);
	}
	.state[data-tone='danger'] {
		background: var(--danger-soft);
		color: var(--danger);
	}
	.state[data-tone='info'] {
		background: var(--info-soft);
		color: var(--info);
	}
	.state[data-tone='accent'] {
		background: var(--accent-soft);
		color: var(--accent);
	}

	.m-sub {
		display: block;
		margin-top: 3px;
		font-size: 12px;
		color: var(--e-faint);
	}

	.m-amt {
		display: block;
		margin-top: 10px;
		font-size: 17px;
		font-weight: 650;
		font-variant-numeric: tabular-nums;
	}

	.stack {
		display: grid;
		gap: 10px;
	}

	.line {
		display: flex;
		align-items: baseline;
		gap: 12px;
		padding: 13px 16px 13px 14px;
		border-left: 3px solid transparent;
	}

	.line[data-tone='danger'] {
		border-left-color: var(--danger);
	}
	.line[data-tone='warning'] {
		border-left-color: var(--warning);
	}
	.line[data-tone='info'] {
		border-left-color: var(--info);
	}

	.l-text {
		flex: 1;
		min-width: 0;
		font-size: 12.5px;
		color: var(--e-muted);
	}

	.quiet {
		color: var(--e-faint);
	}

	.l-amt {
		font-weight: 650;
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
	}
</style>
