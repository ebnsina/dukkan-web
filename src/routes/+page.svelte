<script lang="ts">
	import Seo from '$lib/seo/Seo.svelte';
	import Ribbon from '$lib/marketing/Ribbon.svelte';
	import MkNav from '$lib/marketing/MkNav.svelte';
	import MkHero from '$lib/marketing/MkHero.svelte';
	import ClaimAddress from '$lib/marketing/ClaimAddress.svelte';
	import MerchantRow from '$lib/marketing/MerchantRow.svelte';
	import Features from '$lib/marketing/Features.svelte';
	import ThemeGallery from '$lib/marketing/ThemeGallery.svelte';
	import FeeCalculator from '$lib/marketing/FeeCalculator.svelte';
	import Testimonials from '$lib/marketing/Testimonials.svelte';
	import PricingPlans from '$lib/marketing/PricingPlans.svelte';
	import Integrations from '$lib/marketing/Integrations.svelte';
	import Faq from '$lib/marketing/Faq.svelte';
	import SignupBand from '$lib/marketing/SignupBand.svelte';
	import MkFooter from '$lib/marketing/MkFooter.svelte';

	let { data } = $props();
</script>

<Seo
	title="Dukkàn — everything your store needs"
	description="Storefront, payments, inventory and shipping in one login. Take any payment, ship the order, settle in 24 hours."
/>

<svelte:head>
	<!-- Instrument Serif is used once, for the footer wordmark. -->
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Instrument+Serif&display=swap"
	/>
</svelte:head>

<!--
	A fixed, always-light brand surface. `mk-surface` pins the palette and type
	so the app's theme toggle cannot repaint this page half-way.
-->
<div id="top" class="mk-surface relative [overflow-x:clip]">
	<div aria-hidden="true" class="pointer-events-none fixed inset-0 z-9 mk-grain"></div>

	<Ribbon />
	<MkNav />

	<main>
		<MkHero demoShop={data.demoShop} />
		<ClaimAddress />
		<MerchantRow demoShop={data.demoShop} />
		<Features />
		<ThemeGallery />
		<FeeCalculator />
		<Testimonials />
		<PricingPlans plans={data.plans} />
		<Integrations />
		<Faq />
		<SignupBand />
	</main>

	<MkFooter />
</div>
