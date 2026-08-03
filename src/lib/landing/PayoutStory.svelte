<script lang="ts">
	import { Section } from '$lib/ui';
	import { formatCurrency, formatDate, formatPercent } from '$lib/utils/format';

	const order = 4250;
	const courierFee = 80;
	const rate = 0.12;
	const commission = Math.round(order * rate);
	const seller = order - courierFee - commission;

	const steps = [
		{
			title: 'Order delivered',
			body: 'The courier hands over the parcel and takes ৳4,250 in cash from the customer.',
			label: 'Collected',
			amount: order,
			sign: ''
		},
		{
			title: 'Courier settles',
			body: 'Steadfast remits what it collected and keeps its delivery charge.',
			label: 'Courier charge',
			amount: courierFee,
			sign: '−'
		},
		{
			title: 'Your cut comes off',
			body: `Your commission on this seller is ${formatPercent(rate)}, taken automatically.`,
			label: 'Your commission',
			amount: commission,
			sign: '−'
		},
		{
			title: 'Seller paid',
			body: 'The balance lands in the seller account on payout day, with a statement they can check.',
			label: 'Seller receives',
			amount: seller,
			sign: '='
		}
	];
</script>

<Section
	id="payouts"
	eyebrow="Cash on delivery"
	heading="The hard part, done properly."
	lead="Most of Bangladesh still pays in cash at the door. That money passes through a courier before it ever reaches a seller, and it is where marketplaces lose track. Dukkan follows every taka of it."
	rule
	surface
>
	<div class="story">
		<ol class="steps">
			{#each steps as step, index (step.title)}
				<li class:is-final={index === steps.length - 1}>
					<div class="copy">
						<h3 class="t-sub">{step.title}</h3>
						<p class="body">{step.body}</p>
					</div>
					<div class="figure">
						<span class="figure-label t-label">{step.label}</span>
						<span class="amount t-mono">
							{#if step.sign}<span class="sign">{step.sign}</span>{/if}
							{formatCurrency(step.amount)}
						</span>
					</div>
				</li>
			{/each}
		</ol>

		<p class="footnote t-label">
			One order, {formatDate('2026-03-08')}. Sample figures, real arithmetic.
		</p>
	</div>
</Section>

<style>
	.story {
		background: var(--paper);
		padding: clamp(24px, 4vw, 40px);
	}

	li {
		display: grid;
		gap: 16px;
		padding-block: 28px;
		border-bottom: 1px solid var(--rule);
	}

	li:first-child {
		padding-top: 0;
	}

	.is-final {
		border-bottom: none;
		padding-bottom: 0;
	}

	.body {
		margin-top: 10px;
		font-size: var(--size-body);
		line-height: 1.6;
		color: var(--muted);
		max-width: 52ch;
	}

	.figure {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.figure-label {
		color: var(--faint);
	}

	.amount {
		font-size: clamp(22px, 3vw, 30px);
		font-weight: 500;
		line-height: 1;
		letter-spacing: -0.03em;
		font-variant-numeric: tabular-nums;
		color: var(--ink);
		white-space: nowrap;
	}

	.sign {
		color: var(--faint);
		margin-right: 2px;
	}

	/* The final line is the answer, so it carries more weight than the others. */
	.is-final .amount {
		font-size: clamp(28px, 4.4vw, 44px);
		font-weight: 600;
	}

	.footnote {
		margin-top: 28px;
		padding-top: 20px;
		border-top: 1px solid var(--rule);
		color: var(--faint);
	}

	@media (min-width: 760px) {
		li {
			grid-template-columns: minmax(0, 1fr) 220px;
			align-items: start;
			gap: 40px;
		}

		.figure {
			align-items: flex-end;
			text-align: right;
		}
	}
</style>
