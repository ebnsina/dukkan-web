<script lang="ts">
	import { Button, Section, Switch, Tag } from '$lib/ui';
	import { formatCurrency, formatNumber } from '$lib/utils/format';

	interface Tier {
		name: string;
		monthly: number;
		blurb: string;
		limits: Array<[string, string]>;
		extras: string[];
		lead?: boolean;
	}

	const tiers: Tier[] = [
		{
			name: 'Starter',
			monthly: 990,
			blurb: 'A first marketplace, finding its feet.',
			limits: [
				['Sellers', formatNumber(10)],
				['Orders a month', formatNumber(500)],
				['Products', formatNumber(1000)],
				['Staff seats', formatNumber(2)],
				['Writing credits', `${formatNumber(100)} a month`]
			],
			extras: ['bKash and Nagad', 'Steadfast pickups', 'Cash on delivery', 'Help by email']
		},
		{
			name: 'Growth',
			monthly: 2990,
			blurb: 'Steady orders, every week.',
			limits: [
				['Sellers', formatNumber(100)],
				['Orders a month', formatNumber(5000)],
				['Products', formatNumber(25000)],
				['Staff seats', formatNumber(10)],
				['Writing credits', `${formatNumber(1000)} a month`]
			],
			extras: [
				'Everything in Starter',
				'Your own web address',
				'Cards through SSLCommerz',
				'Pathao and RedX',
				'Charge your sellers a monthly fee',
				'Connections to your own systems'
			],
			lead: true
		},
		{
			name: 'Scale',
			monthly: 7990,
			blurb: 'The biggest name in your category.',
			limits: [
				['Sellers', 'No limit'],
				['Orders a month', 'No limit'],
				['Products', 'No limit'],
				['Staff seats', 'No limit'],
				['Writing credits', `${formatNumber(5000)} a month`]
			],
			extras: [
				'Everything in Growth',
				'A different cut per seller',
				'Several web addresses',
				'One person you can call'
			]
		}
	];

	let yearly = $state(false);
	const price = (tier: Tier) => (yearly ? Math.round(tier.monthly * 0.8) : tier.monthly);
</script>

<Section
	id="pricing"
	eyebrow="Pricing"
	heading="One price. We never touch your sales."
	lead="Whatever cut you take from your sellers stays yours. You pay us for the marketplace, and nothing more."
	rule
>
	<div class="billing">
		<Switch bind:checked={yearly} label="Pay for a year" />
		<Tag>Save a fifth</Tag>
	</div>

	<div class="tiers">
		{#each tiers as tier (tier.name)}
			<article class="tier" class:is-lead={tier.lead}>
				<header>
					<h3 class="t-sub">{tier.name}</h3>
					<p class="blurb">{tier.blurb}</p>
				</header>

				<p class="price">
					<span class="amount t-mono">
						{formatCurrency(price(tier), 'BDT', 'en-BD', { maximumFractionDigits: 0 })}
					</span>
					<span class="per t-label">a month{yearly ? ', billed yearly' : ''}</span>
				</p>

				<div class="pick">
					<Button href="/#start" variant={tier.lead ? 'solid' : 'ghost'} arrow>
						Choose {tier.name}
					</Button>
				</div>

				<dl class="limits">
					{#each tier.limits as [term, value] (term)}
						<div>
							<dt class="t-label">{term}</dt>
							<dd class="t-mono">{value}</dd>
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
	.billing {
		display: flex;
		align-items: center;
		gap: 16px;
		margin-bottom: 48px;
	}

	.tiers {
		display: grid;
		border-top: 1px solid var(--rule-strong);
	}

	.tier {
		padding-block: 32px;
		border-bottom: 1px solid var(--rule);
	}

	/* Promotion by inversion — what --inverse-paper and --inverse-ink exist for.
	   No badge, no border, no shadow, no hue. */
	.is-lead {
		background: var(--inverse-paper);
		color: var(--inverse-ink);
		padding-inline: 28px;
	}

	.is-lead .blurb,
	.is-lead .per,
	.is-lead .limits dt,
	.is-lead .extras li {
		color: var(--inverse-ink);
		opacity: 0.72;
	}

	.is-lead .amount,
	.is-lead .limits dd {
		color: var(--inverse-ink);
	}

	.is-lead .limits {
		border-top-color: color-mix(in srgb, var(--inverse-ink) 22%, transparent);
	}

	.is-lead .extras li::before {
		background: color-mix(in srgb, var(--inverse-ink) 50%, transparent);
	}

	/* The panel is already ink, so the action inverts back to paper to stay visible. */
	.is-lead .pick :global(.btn) {
		background: var(--paper);
		color: var(--ink);
		border-color: var(--paper);
	}

	.is-lead .pick :global(.btn:hover) {
		background: var(--surface);
		border-color: var(--surface);
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

	.pick {
		margin-top: 24px;
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

	/* Subgrid keeps price, button, limits and extras on the same lines across all
	   three tiers, so a longer blurb cannot knock the rows out of step. */
	@media (min-width: 860px) {
		.tiers {
			grid-template-columns: repeat(3, minmax(0, 1fr));
			grid-template-rows: repeat(5, auto);
			column-gap: 32px;
		}

		.tier {
			display: grid;
			grid-row: span 5;
			grid-template-rows: subgrid;
			align-content: start;
			padding-inline-end: 32px;
			border-right: 1px solid var(--rule);
		}

		.tier:last-child {
			border-right: none;
			padding-inline-end: 0;
		}

		/* The surface change is the edge, so the inverted tier drops the rules. */
		.is-lead,
		.is-lead + .tier {
			border-right-color: transparent;
		}

		.is-lead {
			padding-inline: 28px;
			margin-block: -20px;
			padding-block: 52px;
			border-bottom-color: transparent;
		}
	}
</style>
