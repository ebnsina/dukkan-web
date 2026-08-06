<script lang="ts">
	/* What "built for Bangladesh" actually amounts to.
	 *
	 * Every line is something the product does differently because of where it
	 * is, rather than a claim about the country. The one about the money
	 * landing in the shop's own account is the one worth reading twice, so it
	 * is first.
	 */
	const rows = [
		[
			'The money is yours before we see it',
			'Card, bKash, Nagad and the rest go through one payment page on your own SSLCommerz account. Dukkàn never holds a taka of it.'
		],
		[
			'Cash on delivery is the normal case',
			'Not a plugin and not an afterthought. Most orders here are paid at the door, so the whole product is built around the ones that are.'
		],
		[
			'Steadfast, on your own account',
			'Consignments made and tracked from the order, with the courier status turned into words you already use.'
		],
		[
			'Delivery charged by district',
			'Inside Dhaka, outside Dhaka, or a rate per district — whatever you actually charge.'
		],
		[
			'Phone numbers, typed any way',
			'01712-345678 and +8801712345678 are the same customer, not two accounts.'
		],
		[
			'Bangla is not a translation layer',
			'Shop names, product titles and postal addresses are stored and shown exactly as they were typed.'
		],
		['Taka reads the way you read it', 'Grouped ৳1,00,000, never ৳100,000, everywhere it appears.'],
		[
			'The day ends in Dhaka',
			"Today's orders are today's, closing at midnight here and not six hours later."
		]
	];
</script>

<dl>
	{#each rows as [term, description] (term)}
		<div class="grid gap-x-10 gap-y-1 border-b border-lg-rule-soft py-5 sm:grid-cols-[minmax(0,15rem)_1fr]">
			<dt class="text-[16px] tracking-tight">{term}</dt>
			<dd class="max-w-[56ch] text-[15px] text-lg-muted">{description}</dd>
		</div>
	{/each}
</dl>
