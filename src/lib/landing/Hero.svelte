<script lang="ts">
	import { Button } from '$lib/ui';
	import { revealHeading } from '$lib/motion/reveal';
	import { formatCurrency, formatNumber, formatRelativeTime } from '$lib/utils/format';

	const now = Date.now();
	const orders = [
		{ id: 'DK-10482', shop: 'Nokshi Home', total: 4250, paid: 'bKash', at: now - 4 * 60_000 },
		{ id: 'DK-10481', shop: 'Dhaka Threads', total: 18900, paid: 'Cash', at: now - 26 * 60_000 },
		{ id: 'DK-10480', shop: 'Chattogram Tea', total: 1120, paid: 'Nagad', at: now - 95 * 60_000 }
	];
</script>

<section class="hero">
	<div class="container-page">
		<div class="rail-grid">
			<div><span class="eyebrow t-label">Marketplace software</span></div>
			<div>
				<h1 class="t-display" {@attach revealHeading()}>
					Many sellers.<br />One shopfront.<br /><span class="light">Your name on it.</span>
				</h1>

				<p class="lead t-lead">
					Dukkan runs the marketplace so you can run the business. Sellers add their own products.
					Customers pay with bKash, Nagad or cash. Money reaches each seller on time, every week.
				</p>

				<div class="actions">
					<Button href="/#pricing" arrow>Start free</Button>
					<Button href="/#how-it-works" variant="ghost">See how it works</Button>
				</div>

				<p class="small t-label">No card needed. Bring your own web address when you are ready.</p>
			</div>
		</div>
	</div>

	<div class="container-page">
		<div class="board-grid rail-grid">
			<div><span class="board-label t-label">Today</span></div>
			<div class="board">
				{#each orders as order (order.id)}
					<div class="line">
						<span class="id t-mono">{order.id}</span>
						<span class="shop">{order.shop}</span>
						<span class="paid t-mono">{order.paid}</span>
						<span class="total t-mono">{formatCurrency(order.total)}</span>
						<span class="when t-mono">{formatRelativeTime(order.at)}</span>
					</div>
				{/each}
				<p class="footnote t-label">
					Sample orders &mdash; {formatNumber(3)} of many. Not a real shop.
				</p>
			</div>
		</div>
	</div>
</section>

<style>
	.hero {
		padding-block: clamp(56px, 9vw, 120px) 0;
	}

	.eyebrow {
		display: block;
		padding-top: 12px;
		color: var(--faint);
	}

	/* Emphasis inside a heading is a lighter weight at full ink, never a lighter colour. */
	.light {
		font-weight: 300;
	}

	.lead {
		margin-top: 36px;
		color: var(--muted);
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		margin-top: 40px;
	}

	.small {
		margin-top: 24px;
		color: var(--faint);
	}

	.board-grid {
		margin-top: clamp(64px, 9vw, 112px);
	}

	.board-label {
		display: block;
		padding-top: 22px;
		color: var(--faint);
	}

	.board {
		border-top: 1px solid var(--rule-strong);
	}

	.line {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr) auto auto auto;
		align-items: baseline;
		gap: 24px;
		padding-block: 18px;
		border-bottom: 1px solid var(--rule);
		font-size: 13px;
	}

	.id,
	.paid,
	.when {
		color: var(--faint);
	}

	.shop {
		font-size: var(--size-body);
		font-weight: 600;
	}

	.total {
		color: var(--ink);
		font-variant-numeric: tabular-nums;
	}

	.footnote {
		padding-top: 20px;
		color: var(--faint);
	}

	@media (max-width: 720px) {
		.line {
			grid-template-columns: minmax(0, 1fr) auto;
			gap: 4px 16px;
		}

		.id {
			order: 1;
		}

		.shop {
			order: 0;
		}

		.paid,
		.when {
			display: none;
		}

		.total {
			order: 2;
			grid-column: 2;
			grid-row: 1;
		}
	}
</style>
