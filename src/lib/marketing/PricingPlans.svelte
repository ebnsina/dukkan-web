<script lang="ts">
	import { Button, Link, SectionHead, Ticker } from '$lib/ui';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { CheckmarkBadge01Icon } from '@hugeicons/core-free-icons';
	import { reveal } from './motion';
	import { taka } from './money';
	import { fromMinor } from '$lib/utils/money';
	import { blurb, byInterval, included } from './plan-copy';
	import type { Plan } from '$lib/api/types';

	let { plans }: { plans: Plan[] } = $props();

	let monthly = $derived(byInterval(plans, 'monthly'));
	let yearly = $derived(byInterval(plans, 'yearly'));

	/* The toggle appears only when there is a yearly plan to switch to. There
	   is not one today, and a discount the billing would not honour is the same
	   fabrication as a made-up price. */
	let canBeAnnual = $derived(yearly.length > 0);

	let annual = $state(false);
	let shown = $derived(annual && canBeAnnual ? yearly : monthly);

	/* The middle plan carries the badge — a marketing choice, not a column in
	   the plans table, so it is made here and by position. */
	let featuredAt = $derived(shown.length > 2 ? Math.floor((shown.length - 1) / 2) : -1);

	/* The figure rolls to the new price rather than being replaced by it: the
	   digits that change are the ones that move, so the eye is told what the
	   toggle did instead of being handed a different number. */
	function setBilling(next: boolean) {
		annual = next;
	}
</script>

<section id="pricing" class="bg-mk-shell py-mk-section">
	<div class="mk-wrap">
		<!-- The rate that used to sit here — "1.9% of what you process" — was not a
		     number the product holds anywhere. A flat fee is what the plans table
		     actually says, so that is what this says. -->
		<SectionHead
			kicker="Pricing"
			heading="Pay for the platform. Never per sale."
			sub="One flat monthly fee, billed in taka. Nothing taken out of an order."
		>
			{#if canBeAnnual}
				<div
					use:reveal
					class="mt-7 inline-flex overflow-hidden rounded-mk-control border border-mk-rule-soft"
				>
					<button
						type="button"
						onclick={() => setBilling(false)}
						aria-pressed={!annual}
						class="cursor-pointer px-5 py-[11px] font-mk-mono text-[11px] tracking-[0.12em] uppercase transition-colors duration-200 {annual
							? 'text-mk-muted hover:text-mk-ink'
							: 'bg-mk-brand text-mk-on-brand'}">Monthly</button
					>
					<button
						type="button"
						onclick={() => setBilling(true)}
						aria-pressed={annual}
						class="flex cursor-pointer items-center gap-[7px] px-5 py-[11px] font-mk-mono text-[11px] tracking-[0.12em] uppercase transition-colors duration-200 {annual
							? 'bg-mk-brand text-mk-on-brand'
							: 'text-mk-muted hover:text-mk-ink'}"
					>
						Annual
						<em class="not-italic {annual ? 'text-mk-on-brand/75' : 'text-mk-brand-type'}"
							>&minus;20%</em
						>
					</button>
				</div>
			{/if}
		</SectionHead>

		<!-- The prices come from the API, so they can be missing. Saying so is
		     better than an empty grid, and far better than the invented figures
		     that used to stand here. -->
		{#if shown.length === 0}
			<p use:reveal class="mt-8 max-w-[52ch] text-[15px] text-mk-muted">
				We cannot reach our price list at the moment. Try again shortly, or
				<a href="/signup" class="mk-underline text-mk-ink">start a shop</a> — you are not charged during
				signup.
			</p>
		{/if}

		<!-- Equal-height columns: the featured card gains weight from colour, not size. -->
		<div class="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-3">
			{#each shown as plan, i (plan.code)}
				{@const featured = i === featuredAt}
				<article
					use:reveal={i * 70}
					class="relative flex flex-col overflow-hidden rounded-mk-card border transition-colors duration-300 {featured
						? 'border-mk-dark bg-mk-dark text-mk-cream'
						: 'border-mk-rule-soft bg-mk-paper hover:border-mk-rule'}"
				>
					<div
						class="flex items-center justify-between border-b px-7 py-4 {featured
							? 'border-mk-cream/15'
							: 'border-mk-rule-soft'}"
					>
						<p
							class="font-mk-mono text-[11px] tracking-[0.16em] uppercase {featured
								? 'text-mk-brand-lift'
								: 'text-mk-muted'}"
						>
							{plan.name}
						</p>
						{#if featured}
							<span
								class="rounded-mk-chip bg-mk-brand px-2 py-1 font-mk-mono text-[9px] tracking-[0.14em] text-mk-on-brand uppercase"
								>Most popular</span
							>
						{/if}
					</div>

					<div class="flex flex-1 flex-col p-7">
						<p
							class="flex items-baseline gap-1.5 text-[clamp(38px,4.4vw,52px)] leading-none tracking-[-0.045em]"
						>
							<Ticker value={fromMinor(plan.price_minor)} format={taka} class="mk-num" />
							<i
								class="font-mk-mono text-[12px] tracking-[0.1em] not-italic {featured
									? 'text-mk-cream/50'
									: 'text-mk-muted'}">/{plan.interval === 'yearly' ? 'yr' : 'mo'}</i
							>
						</p>

						<p
							class="mt-4 min-h-[3.4em] text-[14px] {featured
								? 'text-mk-cream/65'
								: 'text-mk-muted'}"
						>
							{blurb(plan)}
						</p>

						<ul
							class="mt-6 flex flex-1 flex-col gap-3 border-t pt-6 text-[14px] {featured
								? 'border-mk-cream/15 text-mk-cream/70'
								: 'border-mk-rule-soft text-mk-muted'}"
						>
							<!-- The same tick the product section uses. A square dot here and a
							     checkmark there were two marks for one idea: this is included. -->
							{#each included(plan) as feature (feature)}
								<li class="flex items-start gap-3">
									<span
										class="mt-[1px] flex-none {featured
											? 'text-mk-brand-lift'
											: 'text-mk-brand-type'}"
									>
										<HugeiconsIcon icon={CheckmarkBadge01Icon} size={16} strokeWidth={1.8} />
									</span>
									{feature}
								</li>
							{/each}
						</ul>

						<div class="mt-8">
							<Button href="/signup" variant={featured ? 'solid' : 'ghost'} full>Start free</Button>
						</div>
					</div>
				</article>
			{/each}
		</div>

		<p
			use:reveal
			class="mt-6 text-center font-mk-mono text-[11px] tracking-[0.14em] text-mk-faint uppercase"
		>
			Billed in taka &middot; cancel anytime
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
			<Link href="#cta">Talk to sales</Link>
		</div>
	</div>
</section>
