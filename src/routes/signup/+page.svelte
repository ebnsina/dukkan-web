<script lang="ts">
	import { enhance } from '$app/forms';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import {
		ArrowLeft02Icon,
		ArrowRight02Icon,
		CheckmarkBadge01Icon,
		Globe02Icon
	} from '@hugeicons/core-free-icons';
	import { PUBLIC_API_URL } from '$env/static/public';
	import Seo from '$lib/seo/Seo.svelte';
	import MkNav from '$lib/marketing/MkNav.svelte';
	import MkFooter from '$lib/marketing/MkFooter.svelte';
	import Frame from '$lib/marketing/ui/Frame.svelte';
	import MkButton from '$lib/marketing/ui/MkButton.svelte';
	import ThemePreview from '$lib/signup/ThemePreview.svelte';
	import { industryIcon, industryLabel } from '$lib/signup/industries';
	import type { Availability, ThemePreset, ThemeSummary } from '$lib/api/types';

	let { data, form } = $props();

	const STEPS = ['Name', 'Trade', 'Design', 'Number'];

	let step = $state(0);
	let shopName = $state('');
	let ownerName = $state('');
	let industry = $state('');
	let themeCode = $state('');
	let presetCode = $state('');
	let phone = $state('');
	let code = $state('');

	/* The address is the server's answer, not ours: `slug.Make` keeps Bangla, so
	   a shop called রহিম স্টোর gets রহিম-স্টোর and not an empty string. */
	let address = $state<Availability | null>(null);
	let checking = $state(false);
	let addressEdited = $state(false);
	let wanted = $state('');
	let checkFailed = $state('');

	let timer = 0;
	let lastAsked = '';

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

	let nameReady = $derived(shopName.trim().length >= 2 && Boolean(address?.available));
	let phoneReady = $derived(/^(\+?88)?01[3-9]\d{8}$/.test(phone.trim()));
	let sent = $derived(form?.sent === true);
	let done = $derived(form?.shop ?? null);
	let fields = $derived(form?.fields ?? {});

	function askServer(value: string) {
		const trimmed = value.trim();
		if (trimmed.length < 2) {
			address = null;
			checking = false;
			return;
		}
		if (trimmed === lastAsked) return;
		lastAsked = trimmed;
		checking = true;
		checkFailed = '';

		// Straight to the API rather than through our server: the check is rate
		// limited per address, and one shared server address is one bucket for
		// everyone.
		fetch(`${PUBLIC_API_URL.replace(/\/$/, '')}/v1/signup/check-address`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ slug: trimmed })
		})
			.then(async (response) => {
				const payload = await response.json();
				if (!response.ok) throw new Error(payload?.error?.message ?? '');
				if (lastAsked === trimmed) address = payload as Availability;
			})
			.catch((cause: Error) => {
				if (lastAsked !== trimmed) return;
				address = null;
				checkFailed = cause.message || 'We could not check that address. Try again in a moment.';
			})
			.finally(() => {
				if (lastAsked === trimmed) checking = false;
			});
	}

	function check(value: string) {
		clearTimeout(timer);
		timer = window.setTimeout(() => askServer(value), 550);
	}

	function onName(event: Event) {
		shopName = (event.currentTarget as HTMLInputElement).value;
		if (!addressEdited) check(shopName);
	}

	function onAddress(event: Event) {
		wanted = (event.currentTarget as HTMLInputElement).value;
		addressEdited = true;
		check(wanted);
	}

	function pickTrade(pickedCode: string) {
		industry = pickedCode;
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
			<!-- The shop exists. Everything here is a way into it. -->
			<div class="text-center">
				<p class="mb-3 flex items-center justify-center gap-2 mk-kicker text-mk-brand-type">
					<HugeiconsIcon icon={CheckmarkBadge01Icon} size={16} strokeWidth={1.8} />
					Your shop is open
				</p>
				<h1 class="text-mk-h2">{shopName}</h1>
				<p class="mx-auto mt-4 max-w-[46ch] text-[17px] text-mk-muted">
					It is live now, with a few sample items so it does not look empty. Sign in to put your own
					things in it.
				</p>

				<Frame eyebrow="Your address" class="mt-9 text-left">
					<div class="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
						<a
							href={done.storefront}
							class="font-mk-mono text-[clamp(15px,2vw,20px)] break-all text-mk-ink underline decoration-mk-brand-type underline-offset-4"
						>
							{done.storefront}
						</a>
						<span
							class="shrink-0 font-mk-mono text-[11px] tracking-[0.14em] text-mk-faint uppercase"
							>{done.theme_code} · {done.preset_code}</span
						>
					</div>
				</Frame>

				<div class="mt-8 flex flex-wrap justify-center gap-3">
					<MkButton href={done.storefront} variant="brand" arrow>Open my shop</MkButton>
					<MkButton href="/admin">Go to the dashboard</MkButton>
				</div>
			</div>
		{:else}
			<p class="mb-3 block mk-kicker text-mk-brand-type">Open your shop</p>
			<h1 class="text-mk-h2">Four answers and you are trading.</h1>

			<!-- The rail names every step, so nobody is guessing how long this is. -->
			<ol class="mt-8 flex flex-wrap gap-x-6 gap-y-2">
				{#each STEPS as label, index (label)}
					<li class="flex items-center gap-2">
						<span
							class="grid h-5 w-5 place-items-center font-mk-mono text-[10px] {index <= step
								? 'bg-mk-brand text-mk-on-brand'
								: 'bg-mk-shell-deep text-mk-faint'}">{index + 1}</span
						>
						<span
							class="font-mk-mono text-[11px] tracking-[0.14em] uppercase {index === step
								? 'text-mk-ink'
								: 'text-mk-faint'}">{label}</span
						>
					</li>
				{/each}
			</ol>

			{#if form?.message}
				<p class="mt-6 rounded-2xl border border-mk-ink/25 bg-mk-shell p-4 text-[14px] text-mk-ink">
					{form.message}
				</p>
			{/if}

			{#if step === 0}
				<section class="mt-9">
					<h2 class="mk-display text-[22px]">What is your shop called?</h2>
					<p class="mt-2 max-w-[52ch] text-[15px] text-mk-muted">
						Bangla is fine. The web address follows the name, and you can change it below.
					</p>

					<Frame eyebrow="Shop name" class="mt-6">
						<input
							value={shopName}
							oninput={onName}
							placeholder="রহিম স্টোর"
							aria-label="Shop name"
							autocomplete="organization"
							class="w-full bg-transparent px-5 py-4 text-[clamp(18px,2.4vw,26px)] text-mk-ink placeholder:text-mk-faint focus:outline-none"
						/>
					</Frame>

					<Frame eyebrow="Web address" class="mt-4">
						<div class="flex items-center gap-3 px-5 py-4">
							<span aria-hidden="true" class="shrink-0 text-mk-faint">
								<HugeiconsIcon icon={Globe02Icon} size={18} strokeWidth={1.6} />
							</span>
							<input
								value={addressEdited ? wanted : (address?.slug ?? '')}
								oninput={onAddress}
								placeholder="your-shop"
								aria-label="Web address"
								spellcheck="false"
								autocomplete="off"
								class="min-w-0 flex-1 bg-transparent font-mk-mono text-[clamp(14px,1.7vw,18px)] text-mk-ink placeholder:text-mk-faint focus:outline-none"
							/>
							<span class="shrink-0 font-mk-mono text-[clamp(14px,1.7vw,18px)] text-mk-faint"
								>.dukkan.store</span
							>
						</div>
					</Frame>

					<p
						aria-live="polite"
						class="mt-3 min-h-[18px] font-mk-mono text-[11px] tracking-[0.12em] uppercase"
					>
						{#if checking}
							<span class="text-mk-muted">Checking…</span>
						{:else if checkFailed}
							<span class="text-mk-muted">{checkFailed}</span>
						{:else if address?.available}
							<span class="text-mk-brand-type">{address.slug}.dukkan.store is free</span>
						{:else if address?.reason}
							<span class="text-mk-muted">{address.reason}</span>
						{/if}
					</p>

					<div class="mt-8">
						<button
							type="button"
							disabled={!nameReady}
							onclick={() => (step = 1)}
							class="group flex cursor-pointer items-center gap-2 rounded-xl border border-mk-brand bg-mk-brand px-6 py-[15px] font-mk-mono text-[12px] font-medium tracking-[0.12em] text-mk-on-brand uppercase transition-colors duration-200 hover:border-mk-brand-deep hover:bg-mk-brand-deep disabled:cursor-not-allowed disabled:border-mk-shell-deep disabled:bg-mk-shell-deep disabled:text-mk-faint"
						>
							Next
							<span class="transition-transform duration-200 group-hover:translate-x-1">
								<HugeiconsIcon icon={ArrowRight02Icon} size={16} strokeWidth={2} />
							</span>
						</button>
					</div>
				</section>
			{:else if step === 1}
				<section class="mt-9">
					<h2 class="mk-display text-[22px]">What do you sell?</h2>
					<p class="mt-2 max-w-[52ch] text-[15px] text-mk-muted">
						This picks the design that suits your shop, and the sample items we start you with.
					</p>

					<div class="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
						{#each data.industries as trade (trade.code)}
							<button
								type="button"
								onclick={() => pickTrade(trade.code)}
								class="flex cursor-pointer flex-col items-start gap-3 border p-4 text-left transition-colors duration-200 {industry ===
								trade.code
									? 'border-mk-ink bg-mk-shell'
									: 'border-mk-ink/15 hover:border-mk-ink'}"
							>
								<span class="text-mk-brand-type">
									<HugeiconsIcon icon={industryIcon(trade.code)} size={20} strokeWidth={1.6} />
								</span>
								<span class="text-[14px] text-mk-ink">{industryLabel(trade.code)}</span>
							</button>
						{/each}
					</div>

					<div class="mt-8 flex gap-3">
						<button
							type="button"
							onclick={() => (step = 0)}
							class="flex cursor-pointer items-center gap-2 font-mk-mono text-[12px] tracking-[0.12em] text-mk-muted uppercase hover:text-mk-ink"
						>
							<HugeiconsIcon icon={ArrowLeft02Icon} size={16} strokeWidth={2} /> Back
						</button>
					</div>
				</section>
			{:else if step === 2}
				<section class="mt-9">
					<h2 class="mk-display text-[22px]">Pick how it looks.</h2>
					<p class="mt-2 max-w-[52ch] text-[15px] text-mk-muted">
						Every design changes the arrangement as well as the colour. You can change this later.
					</p>

					<div class="mt-6 grid gap-5 sm:grid-cols-2">
						{#each suited as option (option.code)}
							{@const chosen = theme?.code === option.code}
							{@const shown =
								(chosen ? preset : undefined) ??
								option.presets.find((p) => p.is_default) ??
								option.presets[0]}
							<div>
								<button
									type="button"
									onclick={() => pickTheme(option)}
									class="w-full cursor-pointer border text-left transition-colors duration-200 {chosen
										? 'border-mk-ink'
										: 'border-mk-ink/15 hover:border-mk-ink'}"
								>
									{#if shown}
										<ThemePreview tokens={shown.tokens} layout={option.layout} name={shopName} />
									{/if}
									<div class="border-t border-mk-ink/10 p-3">
										<span class="mk-display text-[15px] text-mk-ink">{option.name}</span>
										<p class="mt-1 text-[13px] leading-snug text-mk-muted">{option.description}</p>
									</div>
								</button>

								{#if chosen}
									<div class="mt-2 flex flex-wrap gap-2">
										{#each option.presets as choice (choice.code)}
											<button
												type="button"
												onclick={() => (presetCode = choice.code)}
												class="flex cursor-pointer items-center gap-2 border px-3 py-1.5 font-mk-mono text-[10px] tracking-[0.12em] uppercase {preset?.code ===
												choice.code
													? 'border-mk-ink text-mk-ink'
													: 'border-mk-ink/15 text-mk-muted hover:border-mk-ink'}"
											>
												<span
													aria-hidden="true"
													class="h-3 w-3"
													style="background: {choice.tokens.accent}"
												></span>
												{choice.name}
											</button>
										{/each}
									</div>
								{/if}
							</div>
						{/each}
					</div>

					<div class="mt-8 flex flex-wrap items-center gap-4">
						<button
							type="button"
							onclick={() => (step = 1)}
							class="flex cursor-pointer items-center gap-2 font-mk-mono text-[12px] tracking-[0.12em] text-mk-muted uppercase hover:text-mk-ink"
						>
							<HugeiconsIcon icon={ArrowLeft02Icon} size={16} strokeWidth={2} /> Back
						</button>
						<button
							type="button"
							onclick={() => (step = 3)}
							class="group flex cursor-pointer items-center gap-2 rounded-xl border border-mk-brand bg-mk-brand px-6 py-[15px] font-mk-mono text-[12px] font-medium tracking-[0.12em] text-mk-on-brand uppercase transition-colors duration-200 hover:border-mk-brand-deep hover:bg-mk-brand-deep"
						>
							Next
							<span class="transition-transform duration-200 group-hover:translate-x-1">
								<HugeiconsIcon icon={ArrowRight02Icon} size={16} strokeWidth={2} />
							</span>
						</button>
					</div>
				</section>
			{:else}
				<section class="mt-9">
					<h2 class="mk-display text-[22px]">Your mobile number.</h2>
					<p class="mt-2 max-w-[52ch] text-[15px] text-mk-muted">
						This is how you sign in, and where we send the code. No password to forget.
					</p>

					<form method="POST" action="?/start" use:enhance class="mt-6 max-w-[440px]">
						<label
							class="block font-mk-mono text-[11px] tracking-[0.14em] text-mk-faint uppercase"
							for="signup-phone">Mobile number</label
						>
						<div class="mt-2 flex flex-col gap-2 sm:flex-row">
							<input
								id="signup-phone"
								name="phone"
								bind:value={phone}
								inputmode="tel"
								autocomplete="tel"
								placeholder="01712345678"
								aria-invalid={Boolean(fields.phone)}
								class="min-w-0 flex-1 border border-mk-ink/25 bg-transparent px-4 py-[15px] font-mk-mono text-[15px] text-mk-ink placeholder:text-mk-faint focus:border-mk-ink focus:outline-none"
							/>
							<button
								type="submit"
								disabled={!phoneReady}
								class="cursor-pointer border border-mk-ink/25 px-6 py-[15px] font-mk-mono text-[12px] tracking-[0.12em] text-mk-ink uppercase hover:border-mk-ink hover:bg-mk-ink hover:text-mk-paper disabled:cursor-not-allowed disabled:border-mk-ink/10 disabled:text-mk-faint disabled:hover:bg-transparent"
							>
								{sent ? 'Send again' : 'Send the code'}
							</button>
						</div>
						{#if fields.phone}
							<p class="mt-2 font-mk-mono text-[11px] tracking-[0.12em] text-mk-ink uppercase">
								{fields.phone}
							</p>
						{/if}
					</form>

					{#if sent}
						<form
							method="POST"
							action="?/complete"
							use:enhance
							class="mt-7 max-w-[440px] border-t border-mk-rule pt-7"
						>
							<input type="hidden" name="shop_name" value={shopName} />
							<input type="hidden" name="slug" value={address?.slug ?? ''} />
							<input type="hidden" name="industry" value={industry} />
							<input type="hidden" name="phone" value={phone} />

							<label
								class="block font-mk-mono text-[11px] tracking-[0.14em] text-mk-faint uppercase"
								for="signup-owner">Your name</label
							>
							<input
								id="signup-owner"
								name="owner_name"
								bind:value={ownerName}
								autocomplete="name"
								placeholder="Rahim Uddin"
								class="mt-2 w-full border border-mk-ink/25 bg-transparent px-4 py-[15px] text-[15px] text-mk-ink placeholder:text-mk-faint focus:border-mk-ink focus:outline-none"
							/>

							<label
								class="mt-5 block font-mk-mono text-[11px] tracking-[0.14em] text-mk-faint uppercase"
								for="signup-code">The code we sent you</label
							>
							<input
								id="signup-code"
								name="code"
								bind:value={code}
								inputmode="numeric"
								autocomplete="one-time-code"
								placeholder="000000"
								aria-invalid={Boolean(fields.code)}
								class="mt-2 w-full border border-mk-ink/25 bg-transparent px-4 py-[15px] font-mk-mono text-[20px] tracking-[0.3em] text-mk-ink placeholder:text-mk-faint focus:border-mk-ink focus:outline-none"
							/>
							{#if fields.code}
								<p class="mt-2 font-mk-mono text-[11px] tracking-[0.12em] text-mk-ink uppercase">
									{fields.code}
								</p>
							{/if}
							{#if fields.slug}
								<p class="mt-2 font-mk-mono text-[11px] tracking-[0.12em] text-mk-ink uppercase">
									{fields.slug}
								</p>
							{/if}

							<button
								type="submit"
								class="group mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-mk-brand bg-mk-brand px-6 py-[15px] font-mk-mono text-[12px] font-medium tracking-[0.12em] text-mk-on-brand uppercase transition-colors duration-200 hover:border-mk-brand-deep hover:bg-mk-brand-deep"
							>
								Open my shop
								<span class="transition-transform duration-200 group-hover:translate-x-1">
									<HugeiconsIcon icon={ArrowRight02Icon} size={16} strokeWidth={2} />
								</span>
							</button>
						</form>
					{/if}

					<div class="mt-8">
						<button
							type="button"
							onclick={() => (step = 2)}
							class="flex cursor-pointer items-center gap-2 font-mk-mono text-[12px] tracking-[0.12em] text-mk-muted uppercase hover:text-mk-ink"
						>
							<HugeiconsIcon icon={ArrowLeft02Icon} size={16} strokeWidth={2} /> Back
						</button>
					</div>
				</section>
			{/if}
		{/if}
	</main>

	<MkFooter />
</div>
