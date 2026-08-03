<script lang="ts">
	import Seo from '$lib/seo/Seo.svelte';
	import SiteHeader from '$lib/site/SiteHeader.svelte';
	import SiteFooter from '$lib/site/SiteFooter.svelte';
	import { Button, CtaBand } from '$lib/ui';
	import Hero from '$lib/landing/Hero.svelte';
	import Proof from '$lib/landing/Proof.svelte';
	import Capabilities from '$lib/landing/Capabilities.svelte';
	import WhatYouGet from '$lib/landing/WhatYouGet.svelte';
	import HowItWorks from '$lib/landing/HowItWorks.svelte';
	import PayoutStory from '$lib/landing/PayoutStory.svelte';
	import Pricing from '$lib/landing/Pricing.svelte';
	import Questions from '$lib/landing/Questions.svelte';
</script>

<Seo
	title="Dukkan"
	description="Dukkan gives you your own marketplace: many sellers, one shopfront, your name on it. bKash, Nagad and cards, Steadfast and Pathao pickups, cash on delivery that adds up, and sellers paid on time."
/>

<SiteHeader />

<main>
	<Hero />
	<Proof />
	<Capabilities />
	<WhatYouGet />
	<HowItWorks />
	<PayoutStory />
	<Pricing />
	<Questions />

	<CtaBand
		id="start"
		heading="Your marketplace could be taking orders this week."
		note="No card needed to start"
	>
		{#snippet actions()}
			<Button href="/#pricing" arrow>Start free</Button>
			<Button href="/#questions" variant="ghost">Read the questions</Button>
		{/snippet}
	</CtaBand>
</main>

<SiteFooter />
