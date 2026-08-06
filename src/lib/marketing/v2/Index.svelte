<script lang="ts">
	/* Table stakes, listed as an index rather than sold as features.
	 *
	 * Nobody chooses a shop platform because it has a cart. They do refuse one
	 * that is missing something, so the list is here to be checked off quickly
	 * and then left behind — which is why it is an index and not eight cards.
	 */
	const rows = [
		['Catalogue', 'Products, variants, stock and photographs, in Bangla or English.'],
		['Storefront', 'Home, categories, search, product pages and a cart, at your own address.'],
		['Checkout', 'Guest or signed in, division and district, delivery charge worked out at the door.'],
		['Orders', 'Placed through to delivered, with an invoice, a cancellation and a refund record.'],
		['Customers', 'Sign-in by phone, saved addresses, and everything they have bought before.'],
		['Messages', 'An SMS when the order is placed, when it ships and when it arrives.'],
		['Staff', 'Accounts that run the shop day to day and cannot change where the money lands.'],
		['Found online', 'Titles, descriptions, a sitemap and product data search engines read.']
	];
</script>

<dl class="grid gap-x-12 sm:grid-cols-2">
	{#each rows as [term, description] (term)}
		<div class="border-b border-lg-rule-soft py-4">
			<dt class="lg-label text-lg-ink">{term}</dt>
			<dd class="mt-1.5 text-[15px] text-lg-muted">{description}</dd>
		</div>
	{/each}
</dl>
