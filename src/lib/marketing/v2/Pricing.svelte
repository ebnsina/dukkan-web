<script lang="ts">
	/* The plans as the billing system holds them.
	 *
	 * The figures are what a shop is charged against, fetched rather than
	 * written here — a pricing entry quoting a number nobody enforces is the
	 * one lie this page cannot afford. When the list will not load the entry
	 * says so and keeps its shape.
	 */
	/* The marketing formatter, not the exact one: a plan is ৳990 a month and the
	   paisa on the end of it is two characters of noise. */
	import { taka } from '$lib/marketing/money';
	import { fromMinor } from '$lib/utils/money';
	import { blurb, byInterval, included } from '$lib/marketing/plan-copy';
	import type { Plan } from '$lib/api/types';

	let { plans }: { plans: Plan[] } = $props();

	let monthly = $derived(byInterval(plans, 'monthly'));
</script>

{#if monthly.length}
	<div class="border-t border-lg-ink">
		{#each monthly as plan (plan.code)}
			<div class="grid gap-x-10 gap-y-5 border-b border-lg-rule py-7 lg:grid-cols-[minmax(0,11rem)_1fr_minmax(0,16rem)]">
				<div>
					<p class="lg-num text-[24px] font-medium tracking-tight">
						{taka(fromMinor(plan.price_minor))}
					</p>
					<p class="lg-label mt-1 text-lg-faint">{plan.name} &middot; a month</p>
				</div>

				<p class="max-w-[44ch] text-[15px] text-lg-muted">{blurb(plan)}</p>

				<ul class="lg-num space-y-1 text-[13px] text-lg-ink">
					{#each included(plan) as feature (feature)}
						<li>{feature}</li>
					{/each}
				</ul>
			</div>
		{/each}
	</div>

	<div class="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
		<a
			href="/signup"
			class="rounded-[3px] bg-lg-brand px-6 py-3.5 font-lg-num text-[12px] font-medium tracking-[0.1em] text-lg-on-brand uppercase transition-colors duration-200 hover:bg-lg-brand-deep"
		>
			Open a shop
		</a>
		<p class="max-w-[44ch] text-[14px] text-lg-muted">
			Nothing is taken out of an order. What the customer pays is what reaches your account, less
			whatever your own gateway charges you.
		</p>
	</div>
{:else}
	<p class="max-w-[52ch] border-t border-lg-ink pt-6 text-lg-muted">
		The prices come from the billing system, and it is not answering right now. Rather than print a
		figure nobody checked: one flat fee a month, in taka, and nothing taken out of an order.
	</p>
{/if}
