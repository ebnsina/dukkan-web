<script lang="ts">
	/* The right-hand column of the book, and the page's argument in one place.
	 *
	 * It opens with the day's orders, loses ৳2,600 when the courier's money
	 * arrives, and gets it back line by line. Every section the reader passes
	 * moves it on, so by the closing entry the page has not claimed the money
	 * adds up — it has added it up in front of them.
	 *
	 * Figures roll into place rather than being swapped, because a total that
	 * changes without moving is a total nobody notices changing.
	 */
	import { taka } from '$lib/marketing/money';
	import { book, DAY, GAP, SHORT, SETTLED } from './book.svelte';

	let { inline = false }: { inline?: boolean } = $props();

	let stage = $derived(book.stage);
	let remitted = $derived(stage >= SHORT ? taka(DAY.remitted) : '—');
	let unaccounted = $derived(stage < SHORT ? '—' : stage < SETTLED ? taka(GAP) : taka(0));

	const breakdown = [
		['Returned to you', DAY.returns],
		['Delivery charges', DAY.delivery],
		['Short-paid, raised', DAY.short]
	] as const;
</script>

<div class="lg-sheet {inline ? '' : 'sticky top-24'} p-5">
	<div class="flex items-baseline justify-between gap-3 pb-3">
		<p class="lg-label text-lg-ink">The day's book</p>
		<!-- Said plainly, because these are not somebody's real takings. -->
		<p class="lg-label text-lg-faint">Example</p>
	</div>

	<dl class="border-t border-lg-rule pt-3 text-[13px]">
		<div class="flex items-baseline justify-between gap-3 py-1.5">
			<dt class="text-lg-muted">Orders</dt>
			<dd class="lg-num text-lg-ink">{DAY.orders}</dd>
		</div>
		<div class="flex items-baseline justify-between gap-3 py-1.5">
			<dt class="text-lg-muted">To collect</dt>
			<dd class="lg-num text-lg-ink">{taka(DAY.collect)}</dd>
		</div>

		<div class="mt-3 flex items-baseline justify-between gap-3 overflow-hidden border-t border-lg-rule-soft py-1.5 pt-3">
			<dt class="text-lg-muted">Courier remitted</dt>
			{#key remitted}
				<dd class="lg-num animate-lg-roll {stage >= SHORT ? 'text-lg-ink' : 'text-lg-faint'}">
					{remitted}
				</dd>
			{/key}
		</div>

		{#if stage >= SETTLED}
			<!-- The three lines that close the gap, arriving in the order the entry
			     beside them explains them. -->
			{#each breakdown as [label, amount], i (label)}
				<div
					class="flex animate-lg-roll items-baseline justify-between gap-3 py-1 pl-3 text-[12px]"
					style="animation-delay: {i * 90}ms"
				>
					<dt class="text-lg-faint">{label}</dt>
					<dd class="lg-num text-lg-muted">{taka(amount)}</dd>
				</div>
			{/each}
		{/if}

		<div class="mt-3 flex items-baseline justify-between gap-3 overflow-hidden border-t-2 border-lg-ink pt-3 pb-1">
			<dt class="lg-label text-lg-ink">Unaccounted</dt>
			{#key unaccounted}
				<dd
					class="lg-num animate-lg-roll text-[17px] font-medium {stage < SHORT
						? 'text-lg-faint'
						: stage < SETTLED
							? 'text-lg-margin'
							: 'text-lg-credit'}"
				>
					{unaccounted}
				</dd>
			{/key}
		</div>
	</dl>

	{#if stage >= SETTLED}
		<p class="mt-4 animate-lg-roll text-[12px] leading-relaxed text-lg-muted" style="animation-delay: 270ms">
			The day closes. Nothing was written off to make it.
		</p>
	{:else if stage >= SHORT}
		<p class="mt-4 text-[12px] leading-relaxed text-lg-margin">
			Somewhere in {DAY.orders} orders. Keep reading.
		</p>
	{/if}
</div>
