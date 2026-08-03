<script lang="ts">
	import { reveal } from './motion';
	import MkSectionHead from './ui/MkSectionHead.svelte';
	import MkButton from './ui/MkButton.svelte';
	import MkLink from './ui/MkLink.svelte';

	const tiers = [
		{
			name: 'Souk',
			monthly: 0,
			annual: 0,
			blurb: 'For the first hundred orders. Sell from a link, no card required to start.',
			features: [
				'1 storefront',
				'50 products',
				'Wallets and cash on delivery',
				'Dukkàn subdomain',
				'Community support'
			],
			cta: 'Start free',
			featured: false
		},
		{
			name: 'Atelier',
			monthly: 29,
			annual: 23,
			blurb: 'The working shop. Own domain, the full payment stack, couriers and staff logins.',
			features: [
				'3 storefronts',
				'Unlimited products',
				'All wallets, cards & BNPL',
				'Courier integrations',
				'5 staff accounts',
				'Abandoned cart recovery'
			],
			cta: 'Start free',
			featured: true
		},
		{
			name: 'Empire',
			monthly: 99,
			annual: 79,
			blurb: 'Multi-market operations. Separate catalogues, currencies and warehouses, one roof.',
			features: [
				'10 storefronts',
				'Multi-warehouse inventory',
				'Multi-currency & RTL locales',
				'API & webhooks',
				'Unlimited staff',
				'Priority support, 1h response'
			],
			cta: 'Start free',
			featured: false
		}
	];

	let annual = $state(false);
	let flipping = $state(false);

	function setBilling(next: boolean) {
		if (next === annual) return;
		// Prices drop out, swap, and come back — no layout shift while they move.
		flipping = true;
		setTimeout(() => {
			annual = next;
			flipping = false;
		}, 180);
	}
</script>

<section id="pricing" class="py-mk-section">
	<div class="mk-wrap">
		<MkSectionHead
			kicker="Pricing"
			heading="Pay for the platform. Never per sale."
			sub="One flat monthly fee and 1.9% of what you process. No per-order cents, no surprises."
		>
			<div use:reveal class="mt-7 inline-flex border border-mk-ink">
				<button
					type="button"
					onclick={() => setBilling(false)}
					aria-pressed={!annual}
					class="cursor-pointer px-5 py-[11px] font-mk-mono text-[11px] tracking-[0.12em] uppercase transition-colors duration-200 {annual
						? 'text-mk-muted hover:text-mk-ink'
						: 'bg-mk-dark text-mk-cream'}">Monthly</button
				>
				<button
					type="button"
					onclick={() => setBilling(true)}
					aria-pressed={annual}
					class="flex cursor-pointer items-center gap-[7px] px-5 py-[11px] font-mk-mono text-[11px] tracking-[0.12em] uppercase transition-colors duration-200 {annual
						? 'bg-mk-dark text-mk-cream'
						: 'text-mk-muted hover:text-mk-ink'}"
				>
					Annual
					<em class="not-italic {annual ? 'text-mk-lime' : 'text-mk-lime-ink'}">&minus;20%</em>
				</button>
			</div>
		</MkSectionHead>

		<!-- Equal-height columns: the featured card gains weight from colour, not size. -->
		<div class="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-3">
			{#each tiers as tier, i (tier.name)}
				<article
					use:reveal={i * 70}
					class="relative flex flex-col border transition-colors duration-300 {tier.featured
						? 'border-mk-dark bg-mk-dark text-mk-cream'
						: 'border-mk-rule-soft bg-mk-paper hover:border-mk-rule'}"
				>
					<div
						class="flex items-center justify-between border-b px-7 py-4 {tier.featured
							? 'border-mk-cream/15'
							: 'border-mk-rule-soft'}"
					>
						<p
							class="font-mk-mono text-[11px] tracking-[0.16em] uppercase {tier.featured
								? 'text-mk-lime'
								: 'text-mk-muted'}"
						>
							{tier.name}
						</p>
						{#if tier.featured}
							<span
								class="bg-mk-lime px-2 py-1 font-mk-mono text-[9px] tracking-[0.14em] text-mk-ink uppercase"
								>Most popular</span
							>
						{/if}
					</div>

					<div class="flex flex-1 flex-col p-7">
						<p
							class="flex items-baseline gap-1.5 text-[clamp(38px,4.4vw,52px)] leading-none tracking-[-0.045em]"
						>
							<span
								class="inline-block mk-num transition-[opacity,transform] duration-200 {flipping
									? '-translate-y-2 opacity-0'
									: ''}">${annual ? tier.annual : tier.monthly}</span
							>
							<i
								class="font-mk-mono text-[12px] tracking-[0.1em] not-italic {tier.featured
									? 'text-mk-cream/50'
									: 'text-mk-muted'}">/mo</i
							>
						</p>

						<p
							class="mt-4 min-h-[3.4em] text-[14px] {tier.featured
								? 'text-mk-cream/65'
								: 'text-mk-muted'}"
						>
							{tier.blurb}
						</p>

						<ul
							class="mt-6 flex flex-1 flex-col gap-3 border-t pt-6 text-[14px] {tier.featured
								? 'border-mk-cream/15 text-mk-cream/70'
								: 'border-mk-rule-soft text-mk-muted'}"
						>
							{#each tier.features as feature (feature)}
								<li class="flex items-start gap-3">
									<span
										class="mt-[7px] size-1.5 flex-none {tier.featured
											? 'bg-mk-lime'
											: 'bg-mk-lime-ink'}"
									></span>
									{feature}
								</li>
							{/each}
						</ul>

						<div class="mt-8">
							<MkButton href="#cta" variant={tier.featured ? 'lime' : 'ghost'} full
								>{tier.cta}</MkButton
							>
						</div>
					</div>
				</article>
			{/each}
		</div>

		<p
			use:reveal
			class="mt-6 text-center font-mk-mono text-[11px] tracking-[0.14em] text-mk-faint uppercase"
		>
			Billed in your local currency &middot; cancel anytime
		</p>

		<div
			use:reveal
			class="mt-5 flex flex-wrap items-center justify-between gap-6 border-t border-mk-rule-soft pt-6"
		>
			<div>
				<p class="mk-mono text-mk-muted">Enterprise</p>
				<p class="mt-1.5 max-w-[62ch] text-[14px] text-mk-muted">
					Large volumes, or a dedicated acquiring relationship? We build the contract around your
					operation.
				</p>
			</div>
			<MkLink href="#cta">Talk to sales</MkLink>
		</div>
	</div>
</section>
