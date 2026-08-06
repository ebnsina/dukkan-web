<script lang="ts">
	/* The landing page as a shop owner's accounts book.
	 *
	 * Read top to bottom it is one day: thirty-four orders out, the courier's
	 * money back, and the difference explained line by line until nothing is
	 * unaccounted for. The right-hand rail keeps the running total, so by the
	 * closing entry the page has not claimed the money adds up — it has added
	 * it up in front of the reader. That is the one thing this product does
	 * that nothing else here does, so it is the page's structure rather than a
	 * paragraph inside it.
	 */
	import Seo from '$lib/seo/Seo.svelte';
	import Masthead from '$lib/marketing/v2/Masthead.svelte';
	import Hero from '$lib/marketing/v2/Hero.svelte';
	import Entry from '$lib/marketing/v2/Entry.svelte';
	import Tally from '$lib/marketing/v2/Tally.svelte';
	import Gap from '$lib/marketing/v2/Gap.svelte';
	import Close from '$lib/marketing/v2/Close.svelte';
	import Index from '$lib/marketing/v2/Index.svelte';
	import Local from '$lib/marketing/v2/Local.svelte';
	import Shapes from '$lib/marketing/v2/Shapes.svelte';
	import Pricing from '$lib/marketing/v2/Pricing.svelte';
	import Questions from '$lib/marketing/v2/Questions.svelte';
	import Carried from '$lib/marketing/v2/Carried.svelte';
	import Colophon from '$lib/marketing/v2/Colophon.svelte';
	import { DAY, SHORT, SETTLED } from '$lib/marketing/v2/book.svelte';
	import { taka } from '$lib/marketing/money';

	let { data } = $props();
</script>

<!-- Two landing pages at once would compete for the same searches, so this one
     stays out of the index until it replaces the other. -->
<Seo
	title="Dukkàn — sell online, count every taka"
	description="Shop software for Bangladesh. A storefront at your own address, cash on delivery, Steadfast at the door, and a day that closes with nothing unexplained."
	noindex
/>

<svelte:head>
	<!-- The three faces this page is set in. Loaded here rather than in
	     base.css so nothing else in the product pays for them. -->
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..700&family=DM+Mono:wght@400;500&family=Newsreader:opsz,wght@6..72,400..600&display=swap"
	/>
</svelte:head>

<div class="lg-surface">
	<Masthead />

	<!-- No `items-start`: the rail column has to be as tall as the entries for
	     its sticky total to have anything to stick to. -->
	<div class="lg-wrap grid gap-x-[clamp(32px,4vw,72px)] lg:grid-cols-[minmax(0,1fr)_248px]">
		<!-- The red rule down the margin of the book. It runs the whole column,
		     printed before anything was written on it. -->
		<main class="min-w-0 border-l border-lg-margin/60 pl-[clamp(14px,2vw,28px)]">
			<Hero demoShop={data.demoShop} />

			<Entry
				folio="02"
				stage={SHORT}
				heading="The gap nobody explains."
				sub="A week's orders went out worth {taka(DAY.collect)}. The courier's remittance is {taka(
					DAY.remitted
				)}, in one line, with no orders named on it. Which ones is it short on?"
			>
				<Gap />
			</Entry>

			<Entry
				folio="03"
				stage={SETTLED}
				heading="How the day closes."
				sub="Dukkàn matches that one line against the consignments it covers, and then names what is left over instead of leaving it as a feeling."
			>
				<Close />
			</Entry>

			<Entry
				folio="04"
				heading="The rest of the book."
				sub="Everything a shop needs before any of the above matters. None of it is a reason to choose us; all of it is a reason not to."
			>
				<Index />
			</Entry>

			<Entry
				folio="05"
				heading="Written for how the country sells."
				sub="Not a foreign product with a taka symbol dropped into it."
			>
				<Local />
			</Entry>

			<Entry
				folio="06"
				heading="One shop, or many."
				sub="The same product does both, and the second one is not a migration."
			>
				<Shapes />
			</Entry>

			<Entry
				id="costs"
				folio="07"
				heading="What it costs."
				sub="One flat fee a month, billed in taka. Never a share of what you sell."
			>
				<Pricing plans={data.plans} />
			</Entry>

			<Entry
				id="questions"
				folio="08"
				heading="Asked before signing up."
				sub="The answers are the real ones, including where the answer is that a person does it by hand."
			>
				<Questions />
			</Entry>
		</main>

		<aside aria-label="The example day's running total" class="hidden py-[clamp(56px,7vw,104px)] lg:block">
			<Tally />
		</aside>
	</div>

	<Carried />
	<Colophon demoShop={data.demoShop} />
</div>
