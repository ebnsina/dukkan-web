<script lang="ts">
	/* The answer to the entry above: the same gap, named three ways.
	 *
	 * Set on ink, because it is the one moment on the page where something is
	 * settled rather than described — and because eight entries of the same
	 * paper is a page nobody finishes. The stamps land as the panel is read.
	 */
	import { taka } from '$lib/marketing/money';
	import { reveal } from '$lib/marketing/motion';
	import { DAY, ORDERS } from './book.svelte';
	import Tally from './Tally.svelte';

	const lines = [
		{
			amount: DAY.returns,
			title: 'Came back before the door',
			stamp: 'Returned',
			tone: 'plain',
			note: 'Two orders were refused. That money was never yours to collect, and the package it belongs to already says so.'
		},
		{
			amount: DAY.delivery,
			title: 'The courier took their charge',
			stamp: 'Charged',
			tone: 'plain',
			note: 'At the rate you agreed, against the consignments it covers — not as a deduction from a lump sum you cannot read.'
		},
		{
			amount: DAY.short,
			title: `Order #${ORDERS[0].no} came back light`,
			stamp: 'Raised',
			tone: 'short',
			note: `The order says ${taka(ORDERS[0].cod)}; ${taka(ORDERS[0].cod - DAY.short)} arrived. It is raised against that order and left for a person to settle — nothing is written off to make the day balance.`
		}
	];
</script>

<div class="overflow-hidden rounded-[6px] bg-lg-ink text-lg-paper-inv">
	<div class="lg-feint px-[clamp(20px,3vw,40px)] py-[clamp(24px,3vw,40px)] opacity-100">
		{#each lines as line, i (line.title)}
			<div
				use:reveal={i * 90}
				class="grid gap-x-8 gap-y-3 border-b border-lg-rule-inv py-6 first:pt-0 sm:grid-cols-[128px_1fr]"
			>
				<p class="lg-num text-[19px] {line.tone === 'short' ? 'text-lg-margin' : 'text-lg-paper-inv'}">
					{taka(line.amount)}
				</p>

				<div class="min-w-0">
					<div class="flex flex-wrap items-center gap-3">
						<h3 class="text-[18px] text-lg-paper-inv">{line.title}</h3>
						<span
							class="lg-stamp animate-lg-stamp {line.tone === 'short'
								? 'text-lg-margin'
								: 'text-lg-muted-inv'}"
							style="animation-delay: {320 + i * 140}ms"
						>
							{line.stamp}
						</span>
					</div>
					<p class="mt-2 max-w-[56ch] text-[15px] text-lg-muted-inv">{line.note}</p>
				</div>
			</div>
		{/each}

		<div use:reveal={280} class="grid gap-x-8 gap-y-3 pt-7 sm:grid-cols-[128px_1fr]">
			<p class="lg-num text-[24px] font-medium text-lg-credit-soft">{taka(0)}</p>
			<div class="flex flex-wrap items-center gap-3">
				<h3 class="text-[18px] text-lg-paper-inv">Unaccounted for</h3>
				<span class="lg-stamp animate-lg-stamp text-lg-credit-soft" style="animation-delay: 760ms">
					Day closed
				</span>
			</div>
		</div>
	</div>
</div>

<!-- The entry earns an ask: this is the one thing the product does that the
     reader came here for, and the next paragraph is a feature list. -->
<div class="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
	<a
		href="/signup"
		class="rounded-[3px] bg-lg-brand px-6 py-3.5 font-lg-num text-[12px] font-medium tracking-[0.1em] text-lg-on-brand uppercase transition-colors duration-200 hover:bg-lg-brand-deep"
	>
		Start your book
	</a>
	<p class="max-w-[40ch] text-[15px] text-lg-muted">
		Free to start, no card. Your first order can be tomorrow's entry.
	</p>
</div>

<!-- The rail is the desktop's running total; on a narrow screen it belongs
     here, where the day has just finished being counted. -->
<div class="mt-12 lg:hidden">
	<Tally inline />
</div>
