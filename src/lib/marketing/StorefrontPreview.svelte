<script lang="ts">
	import IphoneFrame from '$lib/marketing/art/IphoneFrame.svelte';
	import MacBookFrame from '$lib/marketing/art/MacBookFrame.svelte';
	import MacWindow from '$lib/marketing/art/MacWindow.svelte';
	import ArtSlot from '$lib/marketing/art/ArtSlot.svelte';
	import { onMount } from 'svelte';
	import { prefersReduced } from './motion';
	import { taka } from './money';

	/* The swatches repaint the window by swapping its CSS custom properties.
	   These are three presets the API actually ships — surface and accent come
	   straight from the seeded token sets, so the page cannot advertise a
	   theme a shop owner then cannot pick. */
	const themes = {
		warm: {
			'--shop-bg': '#faf6f2',
			'--shop-fg': '#1a1512',
			'--shop-accent': '#b4552d',
			'--shop-on-accent': '#ffffff'
		},
		ink: {
			'--shop-bg': '#141414',
			'--shop-fg': '#f4f4f4',
			'--shop-accent': '#ffffff',
			'--shop-on-accent': '#0b0b0d'
		},
		rose: {
			'--shop-bg': '#fdf7f8',
			'--shop-fg': '#1d1417',
			'--shop-accent': '#a63d5c',
			'--shop-on-accent': '#ffffff'
		}
	} as const;

	type ThemeName = keyof typeof themes;

	const swatches: { name: ThemeName; label: string; chip: string }[] = [
		{ name: 'warm', label: 'Warm clay', chip: 'bg-[#b4552d]' },
		{ name: 'ink', label: 'Ink', chip: 'bg-[#141414]' },
		{ name: 'rose', label: 'Rose', chip: 'bg-[#a63d5c]' }
	];

	const products = [
		{ motif: 0, name: 'Woven throw', price: taka(2450) },
		{ motif: 2, name: 'Linen scarf', price: taka(1190) },
		{ motif: 3, name: 'Clay vessel', price: taka(980) }
	];

	/* Method names carry the difference; borrowed brand hues would put a third
	   palette in a card that is already grey and lime. */
	const payments = [
		{ label: 'bKash', amount: taka(2450) },
		{ label: 'Card', amount: taka(1190) },
		{ label: 'Cash on delivery', amount: taka(3640) },
		{ label: 'Nagad', amount: taka(980) }
	];

	let theme = $state<ThemeName>('warm');

	/* Three real entries, newest first: the arrival pushes the rest back a rank,
	   which is what stops it reading as one card replaying. */
	let tick = $state(0);
	let feed = $derived(
		Array.from({ length: 3 }, (_, depth) => {
			const at = tick - depth;
			return { at, ...payments[((at % payments.length) + payments.length) % payments.length] };
		})
	);

	let style = $derived(
		Object.entries(themes[theme])
			.map(([key, value]) => `${key}:${value}`)
			.join(';')
	);
	onMount(() => {
		if (prefersReduced()) return;

		const timer = setInterval(() => {
			tick += 1;
		}, 4000);

		return () => clearInterval(timer);
	});
</script>

<div class="pb-[16%]">
	<!-- Staged, not scattered: the laptop squares to the page and the phone stands
		 in front of it, overlapping the base. -->
	<div class="relative">
		<MacBookFrame>
			<!-- The browser fills the desktop, so the shop keeps the room it needs. -->
			<MacWindow url="yourshop.dukkan.store" class="h-full">
				<!-- Colour never transitions: gradients cannot interpolate, so a fade would
				 land the new accent on the old ground. -->
				<div {style} class="h-full bg-[var(--shop-bg)] p-3.5 text-[var(--shop-fg)]">
					<div class="mb-3 flex items-start justify-between gap-3">
						<div>
							<p class="mk-display text-[15px] leading-tight">Marigold Supply</p>
							<p class="font-mk-mono text-[8px] tracking-[0.14em] uppercase opacity-50">
								Home &amp; textiles
							</p>
						</div>
						<span
							class="flex items-center gap-1.5 font-mk-mono text-[8px] tracking-[0.12em] uppercase opacity-60"
						>
							Cart <b class="mk-num">2</b>
						</span>
					</div>

					<figure class="relative aspect-[16/5] overflow-hidden">
						<ArtSlot seed={1} tone="var(--shop-accent)" base="var(--shop-bg)" class="size-full" />
						<figcaption
							class="absolute bottom-2 left-2 bg-[var(--shop-accent)] px-2 py-[3px] font-mk-mono text-[7px] tracking-[0.14em] text-[var(--shop-on-accent)] uppercase"
						>
							New season
						</figcaption>
					</figure>

					<!-- No card outlines: the gap between them is the separator. -->
					<div class="mt-3 grid grid-cols-3 gap-3">
						{#each products as product (product.name)}
							<article>
								<ArtSlot
									seed={product.motif}
									tone="var(--shop-accent)"
									base="var(--shop-bg)"
									class="aspect-4/3 w-full"
								/>
								<div class="mt-1.5 flex flex-wrap items-baseline justify-between gap-x-1.5">
									<p class="min-w-0 text-[9.5px] font-medium">{product.name}</p>
									<p class="shrink-0 mk-num text-[9.5px] opacity-60">{product.price}</p>
								</div>
							</article>
						{/each}
					</div>
				</div>
			</MacWindow>
		</MacBookFrame>

		<!-- A lock screen: the same payments, arriving where a merchant sees them. -->
		<IphoneFrame class="absolute bottom-[-17%] left-[-5%] z-10 w-[24%]">
			<p class="text-center font-mk-mono text-[7px] tracking-[0.14em] text-mk-muted uppercase">
				Today
			</p>
			<p
				class="mt-0.5 text-center mk-display text-[28px] leading-none tracking-[-0.03em] text-mk-ink"
			>
				9:41
			</p>

			<div class="relative mt-3 h-[108px]">
				{#each feed as item, depth (item.at)}
					<div
						aria-live={depth === 0 ? 'polite' : undefined}
						aria-hidden={depth > 0 ? 'true' : undefined}
						style="transform:translateY({depth * 36}px);opacity:{[1, 0.7, 0.4][depth]}"
						class="absolute inset-x-0 top-0 flex animate-mk-notify items-center gap-1.5 rounded-[11px] bg-mk-paper px-1.5 py-1.5 transition-[transform,opacity] duration-500 ease-mk motion-reduce:animate-none motion-reduce:transition-none"
					>
						<span
							aria-hidden="true"
							class="grid size-[20px] flex-none place-items-center rounded-[6px] bg-mk-brand text-[11px] leading-none text-mk-on-brand"
						>
							&#1583;
						</span>

						<div class="min-w-0 flex-1">
							<div
								class="flex items-baseline justify-between gap-1 font-mk-mono text-[6px] tracking-[0.1em] text-mk-faint uppercase"
							>
								<span>Dukk&agrave;n</span>
								<span>{depth === 0 ? 'now' : `${depth}m`}</span>
							</div>
							<p class="truncate text-[8px] text-mk-ink">
								<span class="mk-num">{item.amount}</span>
							</p>
						</div>
					</div>
				{/each}
			</div>
		</IphoneFrame>
	</div>

	<!-- Controls sit under the devices, square, on the page rather than a screen. -->
	<div class="mt-6 flex items-center justify-end gap-3">
		<span class="font-mk-mono text-[10px] tracking-[0.16em] text-mk-faint uppercase">Theme</span>
		<div class="flex items-center gap-2">
			{#each swatches as swatch (swatch.name)}
				<button
					type="button"
					onclick={() => (theme = swatch.name)}
					aria-label="{swatch.label} theme"
					aria-pressed={theme === swatch.name}
					class="size-5 cursor-pointer rounded-mk-chip border transition-transform duration-200 hover:-translate-y-0.5 {swatch.chip} {theme ===
					swatch.name
						? 'border-mk-brand'
						: 'border-mk-ink/20'}"
				></button>
			{/each}
		</div>
	</div>
</div>
