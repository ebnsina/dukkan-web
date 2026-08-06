<script lang="ts">
	/* The problem, drawn rather than argued.
	 *
	 * A shop owner knows what went out. The courier hands back one figure for
	 * the week, and the column that would connect the two is the one nobody
	 * fills in. Every question mark here is a real one.
	 */
	import { taka } from '$lib/marketing/money';
	import { DAY, GAP, ORDERS, REST } from './book.svelte';
</script>

<div class="overflow-x-auto">
	<table class="w-full min-w-[560px] border-collapse text-left">
		<thead>
			<tr class="border-b border-lg-rule">
				<th scope="col" class="lg-label pb-2 font-normal text-lg-faint">Order</th>
				<th scope="col" class="lg-label pb-2 font-normal text-lg-faint">Delivered to</th>
				<th scope="col" class="lg-label pb-2 text-right font-normal text-lg-faint">To collect</th>
				<th scope="col" class="lg-label pb-2 text-right font-normal text-lg-faint">Paid to you</th>
			</tr>
		</thead>

		<tbody class="lg-num text-[14px]">
			{#each ORDERS as order (order.no)}
				<tr class="border-b border-lg-rule-soft">
					<td class="py-3 text-lg-ink">#{order.no}</td>
					<td class="py-3 font-lg-body text-[15px] text-lg-muted">{order.district}</td>
					<td class="py-3 text-right text-lg-ink">{taka(order.cod)}</td>
					<td class="py-3 text-right text-lg-faint">?</td>
				</tr>
			{/each}

			<tr class="border-b border-lg-rule-soft">
				<td class="py-3 text-lg-faint">&hellip;</td>
				<td class="py-3 font-lg-body text-[15px] text-lg-muted"
					>{REST.orders} more, all over the country</td
				>
				<td class="py-3 text-right text-lg-ink">{taka(REST.cod)}</td>
				<td class="py-3 text-right text-lg-faint">?</td>
			</tr>

			<tr class="border-b-2 border-lg-ink">
				<td colspan="2" class="py-3 font-lg-body text-[15px] text-lg-ink"
					>The week's orders, {DAY.orders} of them</td
				>
				<td class="py-3 text-right font-medium text-lg-ink">{taka(DAY.collect)}</td>
				<td class="py-3 text-right text-lg-faint">&mdash;</td>
			</tr>

			<!-- The courier's side of the story: one number, no orders attached. -->
			<tr>
				<td colspan="3" class="py-3 font-lg-body text-[15px] text-lg-muted"
					>The courier's remittance, one line, no orders named</td
				>
				<td class="py-3 text-right font-medium text-lg-ink">{taka(DAY.remitted)}</td>
			</tr>

			<tr>
				<td colspan="3" class="pt-1 font-lg-body text-[15px] text-lg-ink">Unaccounted for</td>
				<td class="pt-1 text-right">
					<span class="lg-stamp text-lg-margin">Short {taka(GAP)}</span>
				</td>
			</tr>
		</tbody>
	</table>
</div>

<p class="mt-10 max-w-[56ch] text-lg-muted">
	Two of those orders came back and were never yours. Some of it is the delivery charge you already
	agreed to. And somewhere in there is money that simply did not arrive. Without the middle column,
	all three look the same.
</p>
