<script lang="ts">
	import { Button, Section, Switch, Tag } from '$lib/ui';
	import { formatCurrency, formatNumber } from '$lib/utils/format';

	interface Tier {
		name: string;
		monthly: number;
		blurb: string;
		sellers: string;
		orders: string;
		address: string;
		credits: number;
		extras: string[];
		lead?: boolean;
	}

	const tiers: Tier[] = [
		{
			name: 'Starter',
			monthly: 2500,
			blurb: 'A first marketplace, finding its feet.',
			sellers: '10 sellers',
			orders: '500 orders a month',
			address: 'A Dukkan web address',
			credits: 200,
			extras: ['bKash and Nagad', 'Steadfast pickups', 'Cash on delivery', 'Help by email']
		},
		{
			name: 'Growth',
			monthly: 7500,
			blurb: 'Steady orders, every week.',
			sellers: '75 sellers',
			orders: '5,000 orders a month',
			address: 'Your own web address',
			credits: 2000,
			extras: [
				'Everything in Starter',
				'Cards through SSLCommerz',
				'Pathao and RedX',
				'Payouts that run themselves',
				'Keys for your whole team'
			],
			lead: true
		},
		{
			name: 'Scale',
			monthly: 22500,
			blurb: 'The biggest name in your category.',
			sellers: 'Sellers without limit',
			orders: '50,000 orders a month',
			address: 'Several web addresses',
			credits: 15000,
			extras: [
				'Everything in Growth',
				'A different cut per seller',
				'Your own connections in and out',
				'One person you can call'
			]
		}
	];

	let yearly = $state(false);
	const price = (tier: Tier) => (yearly ? Math.round(tier.monthly * 0.8) : tier.monthly);
</script>

<Section id="pricing" label="Pricing" rule>
	<h2 class="t-heading">One price. We never touch your sales.</h2>
	<p class="lead t-lead">
		Whatever cut you take from your sellers stays yours. You pay us for the marketplace, and nothing
		more.
	</p>

	<div class="billing">
		<Switch bind:checked={yearly} label="Pay for a year" />
		<Tag>Save a fifth</Tag>
	</div>

	<div class="tiers">
		{#each tiers as tier (tier.name)}
			<article class="tier" class:is-lead={tier.lead} data-reveal-item>
				<header>
					<div class="name-row">
						<h3 class="t-sub">{tier.name}</h3>
						{#if tier.lead}<Tag variant="solid">Most picked</Tag>{/if}
					</div>
					<p class="blurb">{tier.blurb}</p>
				</header>

				<p class="price">
					<span class="amount t-mono">
						{formatCurrency(price(tier), 'BDT', 'en-BD', { maximumFractionDigits: 0 })}
					</span>
					<span class="per t-label">a month{yearly ? ', billed yearly' : ''}</span>
				</p>

				<Button href="/#start" variant={tier.lead ? 'solid' : 'ghost'} class="pick" arrow>
					Choose {tier.name}
				</Button>

				<dl class="limits">
					{#each [['Sellers', tier.sellers], ['Orders', tier.orders], ['Address', tier.address], ['Writing credits', `${formatNumber(tier.credits)} a month`]] as [term, value] (term)}
						<div>
							<dt class="t-label">{term}</dt>
							<dd>{value}</dd>
						</div>
					{/each}
				</dl>

				<ul class="extras">
					{#each tier.extras as extra (extra)}
						<li>{extra}</li>
					{/each}
				</ul>
			</article>
		{/each}
	</div>

	<p class="footnote t-label">
		Prices are early-access and leave out VAT. Payment and courier companies charge their own fees.
	</p>
</Section>

<style>
	.lead {
		margin-top: 24px;
		color: var(--muted);
	}

	.billing {
		display: flex;
		align-items: center;
		gap: 16px;
		margin-top: 40px;
	}

	.tiers {
		display: grid;
		gap: 0;
		margin-top: 48px;
		border-top: 1px solid var(--rule-strong);
	}

	.tier {
		display: flex;
		flex-direction: column;
		padding-block: 32px;
		border-bottom: 1px solid var(--rule);
	}

	.name-row {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.blurb {
		margin-top: 10px;
		font-size: 14px;
		line-height: 1.6;
		color: var(--muted);
	}

	.price {
		display: flex;
		flex-direction: column;
		gap: 8px;
		margin-top: 28px;
	}

	.amount {
		font-size: 34px;
		font-weight: 500;
		letter-spacing: -0.03em;
		font-variant-numeric: tabular-nums;
	}

	.per {
		color: var(--faint);
	}

	.tier :global(.pick) {
		margin-top: 24px;
		align-self: flex-start;
	}

	.limits {
		margin-top: 32px;
		padding-top: 24px;
		border-top: 1px solid var(--rule);
	}

	.limits > div + div {
		margin-top: 16px;
	}

	.limits dt {
		color: var(--faint);
	}

	.limits dd {
		margin-top: 5px;
		font-size: 14px;
	}

	.extras {
		margin-top: 28px;
	}

	.extras li {
		position: relative;
		padding-left: 18px;
		font-size: 14px;
		line-height: 1.6;
		color: var(--muted);
	}

	.extras li + li {
		margin-top: 8px;
	}

	.extras li::before {
		content: '';
		position: absolute;
		left: 0;
		top: 10px;
		width: 8px;
		height: 1px;
		background: var(--faint);
	}

	.footnote {
		margin-top: 40px;
		color: var(--faint);
		max-width: 60ch;
		line-height: 1.7;
	}

	@media (min-width: 860px) {
		.tiers {
			grid-template-columns: repeat(3, minmax(0, 1fr));
			gap: 0 32px;
		}

		.tier {
			padding-inline-end: 32px;
			border-right: 1px solid var(--rule);
		}

		.tier:last-child {
			border-right: none;
			padding-inline-end: 0;
		}
	}
</style>
