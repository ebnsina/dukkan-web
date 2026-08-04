<script lang="ts">
	/* Not a wall of names: a directory of live shops.
	 *
	 * A grid of eight names in boxes is the logo wall every platform ships,
	 * minus the logos. What is ours to show is the address — every shop gets
	 * its own, and putting it under the name turns the row into the thing the
	 * hero is offering rather than decoration. The gap does the separating, so
	 * there are no boxes to count. */
	import { Pulse } from '$lib/ui';
	import { reveal, scramble } from './motion';

	// Deliberately static. The order ticker is the only marquee on the page.
	const merchants = [
		{ name: 'Jamdani House', slug: 'jamdani', trade: 'Saris' },
		{ name: 'Adda Threads', slug: 'adda', trade: 'Streetwear' },
		{ name: 'Ceylon & Co.', slug: 'ceylon', trade: 'Tea' },
		{ name: 'Souk Al Oud', slug: 'souk', trade: 'Perfume' },
		{ name: 'Mehndi Beauty', slug: 'mehndi', trade: 'Cosmetics' },
		{ name: 'Deshi Denim', slug: 'deshi', trade: 'Denim' },
		{ name: 'Kahwa Roasters', slug: 'kahwa', trade: 'Coffee' },
		{ name: 'Bab Al Bakhoor', slug: 'bakhoor', trade: 'Incense' }
	];
</script>

<section class="pt-3.5 pb-11">
	<div class="mk-wrap">
		<p use:reveal class="mb-8 flex items-center gap-2.5 mk-kicker text-mk-brand-type">
			<Pulse />
			<span use:scramble>Open right now</span>
		</p>

		<ul class="grid grid-cols-2 gap-x-10 gap-y-9 sm:grid-cols-4">
			{#each merchants as merchant, i (merchant.slug)}
				<li use:reveal={i * 45}>
					<a href="/shop" class="group block">
						<span
							class="block mk-display text-[clamp(16px,1.5vw,19px)] font-bold text-mk-ink transition-colors duration-200 group-hover:text-mk-brand-type"
						>
							{merchant.name}
						</span>
						<!-- The address is the product: mono, and underlined only under
						     the pointer so eight of them do not read as eight links. -->
						<span
							class="mt-2 block font-mk-mono text-[11px] tracking-[0.02em] text-mk-faint underline decoration-transparent decoration-dotted underline-offset-4 transition-colors duration-200 group-hover:decoration-mk-brand-type"
						>
							{merchant.slug}<span class="text-mk-muted/60">.dukkan.store</span>
						</span>
						<span class="mt-1.5 block text-[12px] text-mk-muted">{merchant.trade}</span>
					</a>
				</li>
			{/each}
		</ul>
	</div>
</section>
