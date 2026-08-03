<script lang="ts">
	import { Section } from '$lib/ui';
	import { formatNumber } from '$lib/utils/format';

	/* Numbered, because the order is the point. */
	const steps = [
		{
			title: 'Open your marketplace',
			body: 'Name it, add your logo, decide your cut. The shopfront is live the same day.'
		},
		{
			title: 'Bring your sellers in',
			body: 'Send one link. They add their own products and wait for your nod.'
		},
		{
			title: 'Switch on money and delivery',
			body: 'Add your bKash, Nagad or SSLCommerz details and your courier account. Place a test order to be sure.'
		},
		{
			title: 'Sell, then pay everyone',
			body: 'Orders reach the right seller, parcels get picked up, and payouts run on the day you choose.'
		}
	];
</script>

<Section
	id="how-it-works"
	eyebrow="How it works"
	heading="Open on Monday. Paying sellers by Sunday."
	rule
>
	<ol class="steps">
		{#each steps as step, index (step.title)}
			<li>
				<span class="num t-mono">{formatNumber(index + 1).padStart(2, '0')}</span>
				<h3 class="t-sub">{step.title}</h3>
				<p class="body">{step.body}</p>
			</li>
		{/each}
	</ol>
</Section>

<style>
	.steps {
		display: grid;
		gap: 44px 40px;
	}

	li {
		padding-top: 24px;
		border-top: 1px solid var(--rule);
	}

	.num {
		display: block;
		font-size: 11px;
		letter-spacing: 0.16em;
		color: var(--faint);
		margin-bottom: 20px;
	}

	.body {
		margin-top: 12px;
		font-size: var(--size-body);
		line-height: 1.6;
		color: var(--muted);
		max-width: 36ch;
	}

	/* Four items in a 2x2, so the fourth is never stranded alone. */
	@media (min-width: 700px) {
		.steps {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
</style>
