<script lang="ts">
	import { formatCurrency, formatNumber } from '$lib/utils/format';

	/* Capability facts about the product, not claims about customers we do not have. */
	const figures = [
		{ value: formatNumber(4), label: 'Ways to take money', note: 'bKash, Nagad, cards, cash' },
		{ value: formatNumber(3), label: 'Couriers built in', note: 'Steadfast, Pathao, RedX' },
		{ value: formatNumber(7), label: 'Days between payouts', note: 'Or pick your own day' },
		{
			value: formatCurrency(0, 'BDT', 'en-BD', { maximumFractionDigits: 0 }),
			label: 'To set up',
			note: 'No card to start'
		}
	];
</script>

<section class="figures">
	<div class="container-page">
		<dl class="grid">
			{#each figures as figure (figure.label)}
				<div class="cell">
					<dd class="value t-mono">{figure.value}</dd>
					<dt class="label t-label">{figure.label}</dt>
					<dd class="note">{figure.note}</dd>
				</div>
			{/each}
		</dl>
	</div>
</section>

<style>
	.figures {
		padding-block: clamp(48px, 6vw, 72px);
		border-top: 1px solid var(--rule);
	}

	.grid {
		display: grid;
		gap: 40px 32px;
	}

	.value {
		font-size: clamp(40px, 6vw, 62px);
		font-weight: 500;
		line-height: 1;
		letter-spacing: -0.04em;
		font-variant-numeric: tabular-nums;
		color: var(--ink);
	}

	.label {
		display: block;
		margin-top: 18px;
		color: var(--ink);
	}

	.note {
		margin-top: 8px;
		font-size: 13px;
		line-height: 1.5;
		color: var(--faint);
	}

	@media (min-width: 640px) {
		.grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (min-width: 1000px) {
		.grid {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}
	}
</style>
