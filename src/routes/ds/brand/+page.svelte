<script lang="ts">
	/* Brand colour, judged where it actually lives.

	   Each column is the same slice of the admin with only the four brand
	   tokens swapped. It imports the real dashboard.css, so this page cannot
	   drift from the product: change a token there and this changes with it. */
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { ArrowRight01Icon, PlusSignIcon, FileImportIcon } from '@hugeicons/core-free-icons';
	import Seo from '$lib/seo/Seo.svelte';
	import { Chip } from '$lib/admin/ui';
	import '$lib/surfaces/admin.css';

	const stroke = 1.6;

	interface Candidate {
		key: string;
		name: string;
		/** Solid fills: buttons, the logo tile, a hovered arrow. */
		fill: string;
		press: string;
		/** What sits on top of a fill. */
		ink: string;
		/** Type on paper: links, focus rings, bar fills. */
		type: string;
		/** The light sibling a dark ground needs. */
		dark: string;
		onFill: number;
		asType: number;
		onDark: number;
		/** Degrees of hue between this and the nearest state colour. */
		gap: number;
		near: string;
		headline: string;
		note: string;
	}

	// Measured, not estimated — WCAG relative luminance against #ffffff paper
	// and the #17181b dark sheet.
	const candidates: Candidate[] = [
		{
			key: 'lime',
			name: 'Lime',
			fill: '#b7ec2f',
			press: '#9ed214',
			ink: '#101410',
			type: '#3f6a09',
			dark: '#b7ec2f',
			onFill: 12.73,
			asType: 6.41,
			onDark: 12.73,
			gap: 66,
			near: 'success',
			headline: 'The incumbent, and still the only one that cannot be a state',
			note: 'The single hue on offer that no state colour claims, which is why it survived the first pass. Its weakness is real: it fails as type at 1.4:1, so links and focus rings need a separate deep token. Everything else here is a candidate to replace it.'
		},
		{
			key: 'honolulu',
			name: 'Honolulu blue',
			fill: '#0076b6',
			press: '#005e92',
			ink: '#ffffff',
			type: '#00618f',
			dark: '#4fb3e8',
			onFill: 4.92,
			asType: 6.76,
			onDark: 7.56,
			gap: 9,
			near: 'info',
			headline: 'Collides with the state palette',
			note: 'Blue already means placed, confirmed, in progress. At 9° apart the brand and the state stop being separable. Workable only if you retire --info and let those two be neutral chips — defensible, since placed is the happy default. Free of every payment brand a seller touches. Cold; reads bank rather than shop.'
		},
		{
			key: 'indigo',
			name: 'Indigo',
			fill: '#4b44c9',
			press: '#3c36a8',
			ink: '#ffffff',
			type: '#3c36a8',
			dark: '#9b95f2',
			onFill: 7.07,
			asType: 9.19,
			onDark: 6.74,
			gap: 33,
			near: 'info',
			headline: 'Safe, and anonymous',
			note: 'The strongest numbers here, 33° clear of the nearest state colour, and nothing in the Bangladesh payment stack wears it. What you buy with that safety is anonymity — it is the house hue of every B2B tool built since 2020.'
		},
		{
			key: 'violet',
			name: 'Violet',
			fill: '#7c3aed',
			press: '#6828d9',
			ink: '#ffffff',
			type: '#6828d9',
			dark: '#b69bfa',
			onFill: 5.7,
			asType: 7.26,
			onDark: 7.66,
			gap: 52,
			near: 'info',
			headline: 'Separates best, positions worst',
			note: 'The widest gap from the state palette on offer, and it carries type and fills equally well. But violet is Dokan’s colour in this exact category, and the default hue of every AI product shipped this year.'
		},
		{
			key: 'orange',
			name: 'Orange',
			fill: '#c2410c',
			press: '#a83e07',
			ink: '#ffffff',
			type: '#a83e07',
			dark: '#fb923c',
			onFill: 5.18,
			asType: 6.26,
			onDark: 7.84,
			gap: 14,
			near: 'danger',
			headline: 'The one place it must not go',
			note: 'Lands 14° from danger and 16° from warning — between the two colours that mean something is wrong. In a product whose moat is reconciliation that is the most expensive collision available. It is also Nagad and Daraz.'
		}
	];

	const risk = (gap: number) => (gap < 20 ? 'danger' : gap < 40 ? 'warning' : 'success');

	const orders = [
		{ name: 'Karim', meta: 'DK-1005 · Dhaka', amount: '৳6,100.00', tone: 'info', word: 'Placed' },
		{
			name: 'Rahim Uddin',
			meta: 'DK-1004 · Barguna',
			amount: '৳6,100.00',
			tone: 'success',
			word: 'Paid'
		},
		{ name: 'Karim', meta: 'DK-1002 · Dhaka', amount: '৳4,500.00', tone: 'warning', word: 'Unpaid' }
	] as const;
</script>

<Seo title="Brand colour" description="Candidate brand colours against the admin." noindex />

<div class="dk-app is-inline ground">
	<div class="wrap">
		<header class="masthead">
			<span class="dk-eyebrow">Dukkan · brand colour</span>
			<h1 class="dk-h1">Four candidates, judged where the colour lives</h1>
			<p class="dek">
				Each column is the same slice of the admin with only the four brand tokens swapped —
				<code>--d-brand</code>, <code>--d-brand-deep</code>, <code>--d-brand-ink</code> and
				<code>--d-press</code>. Everything else is held identical, because those are the constants a
				brand has to survive. Contrast is measured against the real paper and the real dark sheet.
			</p>
		</header>

		<section class="control" aria-label="The state colours, which cannot move">
			<span class="dk-eyebrow">Cannot move</span>
			<div class="control-chips">
				<Chip tone="success" label="Paid" />
				<Chip tone="warning" label="Unpaid" />
				<Chip tone="danger" label="Short by" />
				<Chip tone="info" label="Placed" />
			</div>
			<p class="control-note">
				Green means the money arrived, amber means a person is needed, red means money or stock is
				at risk, blue means in progress. In a product whose moat is reconciliation these earn their
				meaning, so the further the brand sits from all four, the better it works.
			</p>
		</section>

		<div class="grid">
			{#each candidates as c (c.key)}
				<section
					class="dk-app is-inline col"
					id={c.key}
					aria-labelledby="{c.key}-name"
					style="--x-fill:{c.fill};--x-press:{c.press};--x-ink:{c.ink};--x-type:{c.type};--x-dark:{c.dark}"
				>
					<header class="colhead">
						<h2 class="dk-h2" id="{c.key}-name">{c.name}</h2>
						<span class="dk-num">{c.fill}</span>
					</header>

					<div class="stage">
						<div class="brandbar">
							<span class="dk-logo">র</span>
							<span class="dk-bname">Dukkàn</span>
						</div>

						<div class="dk-frame">
							<div class="dk-head"><span class="dk-eyebrow">Sales today</span></div>
							<div class="dk-panel dk-panel--stat">
								<span class="dk-stat-value">৳22,800.00</span>
							</div>
							<div class="dk-frame-foot">৳22,800.00 this month</div>
						</div>

						<div class="dk-frame">
							<div class="dk-head">
								<span class="dk-eyebrow">Today</span>
								<span class="dk-h2">Recent orders</span>
								<a class="dk-view" href="#{c.key}">View all</a>
							</div>
							<div class="dk-panel dk-panel--rows">
								{#each orders as o (o.meta)}
									<a class="dk-row" href="#{c.key}">
										<span class="dk-row-main">
											<span class="dk-row-title">{o.name}</span>
											<span class="dk-row-meta">{o.meta}</span>
										</span>
										<span class="dk-row-amt">{o.amount}</span>
										<Chip tone={o.tone} label={o.word} />
										<span class="dk-go" aria-hidden="true">
											<HugeiconsIcon icon={ArrowRight01Icon} size={14} strokeWidth={stroke} />
										</span>
									</a>
								{/each}
							</div>
						</div>

						<div class="dk-frame">
							<div class="dk-head">
								<span class="dk-eyebrow">Delivery</span><span class="dk-h2">In flight</span>
							</div>
							<div class="dk-panel dk-bars">
								<div class="dk-bar">
									<span class="dk-bar-name">To confirm</span>
									<span class="dk-bar-track"
										><span class="dk-bar-fill" style="width:62%"></span></span
									>
									<span class="dk-bar-count">4</span>
								</div>
								<div class="dk-bar">
									<span class="dk-bar-name">To send</span>
									<span class="dk-bar-track"
										><span class="dk-bar-fill" style="width:38%"></span></span
									>
									<span class="dk-bar-count">4</span>
								</div>
							</div>
						</div>

						<div class="dk-acts">
							<span class="dk-btn dk-btn--solid">
								<span class="dk-btn-icon" aria-hidden="true">
									<HugeiconsIcon icon={PlusSignIcon} size={15} strokeWidth={1.8} />
								</span>
								Add product
							</span>
							<span class="dk-btn dk-btn--quiet">
								<span class="dk-btn-icon" aria-hidden="true">
									<HugeiconsIcon icon={FileImportIcon} size={15} strokeWidth={1.8} />
								</span>
								Import
							</span>
						</div>

						<p class="linkline">
							A link in prose, like <a href="#{c.key}">open money owed</a>, uses the type step.
						</p>
					</div>

					<dl class="ramp">
						<div>
							<dt>Fill</dt>
							<dd>{c.onFill}</dd>
							<span>white on it</span>
						</div>
						<div>
							<dt>Type</dt>
							<dd>{c.asType}</dd>
							<span>on paper</span>
						</div>
						<div>
							<dt>Dark</dt>
							<dd>{c.onDark}</dd>
							<span>on dark sheet</span>
						</div>
					</dl>

					<p class="gap" data-risk={risk(c.gap)}>
						<span class="dk-eyebrow">Nearest state</span>
						<strong>{c.gap}° from --{c.near}</strong>
					</p>

					<div class="verdict">
						<h3>{c.headline}</h3>
						<p>{c.note}</p>
					</div>
				</section>
			{/each}
		</div>

		<footer class="closing">
			<h2 class="dk-h1">Where this leaves it</h2>
			<p>
				<strong>Indigo</strong> is the only candidate with no real objection: 33° of clearance, the best
				contrast on the page, nothing in the Bangladesh payment stack wearing it. You pay for that in
				anonymity.
			</p>
			<p>
				<strong>Honolulu blue</strong> is the more interesting choice, but only if you pay for it —
				retire
				<code>--info</code> and let placed and confirmed be neutral chips. Take that on purpose rather
				than discover it later.
			</p>
			<p>
				<strong>Violet</strong> separates best and positions worst; it is Dokan’s colour in your
				exact category. <strong>Orange</strong> is the warmest and the most Bangladeshi of the four, and
				it lands between danger and warning — the one region a reconciliation product cannot lend to its
				logo.
			</p>
			<p>
				None of the four beats lime on the axis that decides this. If you want to move off it,
				indigo is the move. If you want to stay, the fix is shade, not hue.
			</p>
		</footer>
	</div>
</div>

<style>
	/* The four brand knobs, sourced from the column and resolved by theme.
	   Inline custom properties beat stylesheet rules, so the values arrive as
	   --x-* and the theme decides which pair is live. */
	.col {
		--d-brand: var(--x-fill);
		--d-brand-deep: var(--x-press);
		--d-brand-ink: var(--x-ink);
		--d-press: var(--x-type);
	}

	:global([data-theme='dark']) .col {
		--d-brand: var(--x-dark);
		--d-brand-deep: var(--x-dark);
		--d-brand-ink: #0c0d0f;
		--d-press: var(--x-dark);
	}

	.ground {
		min-height: 100dvh;
		background: var(--d-shell);
	}

	.wrap {
		max-width: 1560px;
		margin-inline: auto;
		padding: 40px 28px 72px;
	}

	.masthead {
		max-width: 68ch;
		margin-bottom: 28px;
	}

	.masthead .dk-h1 {
		margin-top: 10px;
		text-wrap: balance;
	}

	.dek {
		margin: 14px 0 0;
		color: var(--d-muted);
		font-size: 15px;
	}

	code {
		font-family: var(--font-mono);
		font-size: 12.5px;
		color: var(--d-ink);
	}

	.control {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 10px 14px;
		padding: 16px 18px;
		margin-bottom: 26px;
		background: var(--d-card);
		border-radius: var(--r-card);
		box-shadow: inset 0 0 0 1px var(--d-edge);
	}

	.control-chips {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.control-note {
		flex-basis: 100%;
		margin: 2px 0 0;
		max-width: 88ch;
		color: var(--d-muted);
		font-size: 13px;
	}

	.grid {
		display: grid;
		gap: 18px;
		grid-template-columns: minmax(0, 1fr);
	}

	.col {
		display: flex;
		flex-direction: column;
		gap: 14px;
		min-width: 0;
	}

	.colhead {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 10px;
	}

	.stage {
		display: flex;
		flex-direction: column;
		gap: 12px;
		padding: 16px;
		background: var(--d-sheet);
		border-radius: var(--r-card);
		box-shadow: var(--d-soft);
	}

	.brandbar {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.linkline {
		margin: 0;
		font-size: 12.5px;
		color: var(--d-muted);
	}

	.linkline a {
		color: var(--d-press);
		text-decoration: underline;
		text-underline-offset: 3px;
	}

	.ramp {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 8px;
		margin: 0;
	}

	.ramp > div {
		display: flex;
		flex-direction: column;
		padding: 9px 11px;
		background: var(--d-card);
		border-radius: var(--r-control);
	}

	.ramp dt {
		font-family: var(--font-mono);
		font-size: 10px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--d-faint);
	}

	.ramp dd {
		margin: 2px 0 0;
		font-size: 15px;
		font-weight: 650;
		font-variant-numeric: tabular-nums;
	}

	.ramp span {
		font-size: 11px;
		color: var(--d-faint);
	}

	.gap {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 10px;
		margin: 0;
		padding: 11px 13px;
		background: var(--d-card);
		border-radius: var(--r-control);
		font-size: 12.5px;
	}

	.gap strong {
		font-family: var(--font-mono);
		font-size: 12px;
	}

	.gap[data-risk='danger'] strong {
		color: var(--danger);
	}
	.gap[data-risk='warning'] strong {
		color: var(--warning);
	}
	.gap[data-risk='success'] strong {
		color: var(--success);
	}

	.verdict h3 {
		margin: 0 0 6px;
		font-size: 13.5px;
		font-weight: 650;
		letter-spacing: -0.01em;
	}

	.verdict p {
		margin: 0;
		font-size: 13px;
		color: var(--d-muted);
	}

	.closing {
		max-width: 70ch;
		margin-top: 44px;
		padding-top: 26px;
		border-top: 1px solid var(--d-edge);
	}

	.closing .dk-h1 {
		font-size: 20px;
		margin-bottom: 12px;
	}

	.closing p {
		margin: 0 0 12px;
		color: var(--d-muted);
	}

	.closing strong {
		color: var(--d-ink);
		font-weight: 650;
	}

	@media (min-width: 760px) {
		.grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	/* Five columns need real width; below that a row crushes the name it is
	   meant to show. */
	@media (min-width: 1100px) {
		.grid {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}

	@media (min-width: 1700px) {
		.grid {
			grid-template-columns: repeat(5, minmax(0, 1fr));
		}
	}
</style>
