<script lang="ts">
	/* Opening a shop, in four answers.
	 *
	 * This holds what the steps agree on — which step is showing, and the answers
	 * given so far — and nothing else. Each step owns its own fields and its own
	 * validity; none of them knows what comes next. */
	import Seo from '$lib/seo/Seo.svelte';
	import MkNav from '$lib/marketing/MkNav.svelte';
	import MkFooter from '$lib/marketing/MkFooter.svelte';
	import { AddressCheck } from '$lib/signup/address.svelte';
	import StepRail from '$lib/signup/StepRail.svelte';
	import NameStep from '$lib/signup/NameStep.svelte';
	import TradeStep from '$lib/signup/TradeStep.svelte';
	import DesignStep from '$lib/signup/DesignStep.svelte';
	import NumberStep from '$lib/signup/NumberStep.svelte';
	import ShopOpen from '$lib/signup/ShopOpen.svelte';
	import type { ThemePreset, ThemeSummary } from '$lib/api/types';

	let { data, form } = $props();

	const STEPS = ['Name', 'Trade', 'Design', 'Number'];

	let step = $state(0);
	let shopName = $state('');
	let industry = $state('');
	let themeCode = $state('');
	let presetCode = $state('');
	/* Held here rather than in the step: sending the code is a successful post,
	   and `enhance` resets the form element it came from. */
	let phone = $state('');

	const address = new AddressCheck();

	// The trade decides which designs are offered, in the same order the API
	// picks its default from: an exact match first, then the general ones.
	let suited = $derived.by((): ThemeSummary[] => {
		if (!industry) return data.themes;
		const fits = (t: ThemeSummary) => t.industries.includes(industry);
		const pool = data.themes.filter((t) => fits(t) || t.industries.includes('general'));
		return [...pool.filter(fits), ...pool.filter((t) => !fits(t))];
	});

	let theme = $derived(suited.find((t) => t.code === themeCode) ?? suited[0]);
	let preset = $derived<ThemePreset | undefined>(
		theme?.presets.find((p) => p.code === presetCode) ??
			theme?.presets.find((p) => p.is_default) ??
			theme?.presets[0]
	);

	let sent = $derived(form?.sent === true);
	let done = $derived(form?.shop ?? null);
	let fields = $derived(form?.fields ?? {});

	function pickTrade(code: string) {
		industry = code;
		themeCode = '';
		presetCode = '';
		step = 2;
	}

	function pickTheme(picked: ThemeSummary) {
		themeCode = picked.code;
		presetCode = picked.presets.find((p) => p.is_default)?.code ?? picked.presets[0]?.code ?? '';
	}
</script>

<Seo
	title="Open your shop"
	description="Pick a name, say what you sell, choose a design and verify your number. Your shop is live in a minute."
/>

<div class="mk-surface relative [overflow-x:clip]">
	<MkNav />

	<main class="mk-wrap max-w-[900px] py-[clamp(40px,6vw,80px)]">
		{#if done}
			<ShopOpen shop={done} {shopName} />
		{:else}
			<p class="mb-3 block mk-kicker text-mk-brand-type">Open your shop</p>
			<h1 class="text-mk-h2">Four answers and you are trading.</h1>

			<StepRail steps={STEPS} current={step} />

			{#if form?.message}
				<p
					class="mt-6 rounded-mk-nested border border-mk-ink/25 bg-mk-shell p-4 text-[14px] text-mk-ink"
				>
					{form.message}
				</p>
			{/if}

			{#if step === 0}
				<NameStep bind:shopName {address} onnext={() => (step = 1)} />
			{:else if step === 1}
				<TradeStep
					industries={data.industries}
					chosen={industry}
					onpick={pickTrade}
					onback={() => (step = 0)}
				/>
			{:else if step === 2}
				<DesignStep
					themes={suited}
					{shopName}
					{theme}
					{preset}
					onpick={pickTheme}
					onpreset={(code) => (presetCode = code)}
					onback={() => (step = 1)}
					onnext={() => (step = 3)}
				/>
			{:else}
				<!-- The design passed on is the one the step showed as chosen, which is
				     a default until it is clicked — so the shop opens wearing what its
				     owner was looking at. -->
				<NumberStep
					{shopName}
					slug={address.found?.slug ?? ''}
					{industry}
					themeCode={theme?.code ?? ''}
					presetCode={preset?.code ?? ''}
					bind:phone
					{sent}
					{fields}
					onback={() => (step = 2)}
				/>
			{/if}
		{/if}
	</main>

	<MkFooter />
</div>
