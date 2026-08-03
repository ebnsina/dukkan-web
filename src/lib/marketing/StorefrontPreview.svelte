<script lang="ts">
	import { onMount } from 'svelte';
	import { prefersReduced } from './motion';
	import ArtSlot from './ui/ArtSlot.svelte';
	import Frame from './ui/Frame.svelte';
	import { taka } from './money';

	/** The swatches repaint the window by swapping its CSS custom properties. */
	const themes = {
		ivory: {
			'--shop-bg': '#fbfaf7',
			'--shop-fg': '#101410',
			'--shop-accent': '#b7ec2f',
			'--shop-on-accent': '#101410'
		},
		ink: {
			'--shop-bg': '#141814',
			'--shop-fg': '#f2f4f1',
			'--shop-accent': '#b7ec2f',
			'--shop-on-accent': '#101410'
		},
		lime: {
			'--shop-bg': '#f2f7e6',
			'--shop-fg': '#16200c',
			'--shop-accent': '#4a7c0b',
			'--shop-on-accent': '#ffffff'
		}
	} as const;

	type ThemeName = keyof typeof themes;

	const swatches: { name: ThemeName; label: string; chip: string }[] = [
		{ name: 'ivory', label: 'Ivory', chip: 'bg-[#fbfaf7]' },
		{ name: 'ink', label: 'Ink', chip: 'bg-[#141814]' },
		{ name: 'lime', label: 'Lime', chip: 'bg-mk-lime' }
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

	let theme = $state<ThemeName>('ivory');

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

<div class="relative">
	<!--
		The frame is the browser: dots and address on its header row, so the mock
		inside is just the shop — cropped, tilted, running off two edges.
	-->
	<Frame clip class="group h-[clamp(420px,46vw,540px)]">
		<!-- Colour never transitions here: gradients cannot interpolate, so a fade
			 would land the new accent on the old ground. -->
		{#snippet head()}
			<span class="flex gap-1.5">
				{#each [0, 1, 2] as dot (dot)}
					<span class="size-[7px] rounded-full bg-mk-ink/15"></span>
				{/each}
			</span>
			<span
				class="ml-1 truncate bg-mk-paper px-3 py-1 font-mk-mono text-[10px] tracking-[0.06em] text-mk-muted"
				>yourshop.dukkan.store</span
			>
		{/snippet}

		{#snippet footer()}
			<!-- Controls sit on the shell, under the panel, clear of the mock. -->
			<div class="flex items-center justify-between gap-4">
				<span class="font-mk-mono text-[10px] tracking-[0.16em] text-mk-faint uppercase">Theme</span
				>
				<div class="flex items-center gap-2">
					{#each swatches as swatch (swatch.name)}
						<button
							type="button"
							onclick={() => (theme = swatch.name)}
							aria-label="{swatch.label} theme"
							aria-pressed={theme === swatch.name}
							class="size-5 cursor-pointer border transition-transform duration-200 hover:-translate-y-0.5 {swatch.chip} {theme ===
							swatch.name
								? 'border-mk-lime'
								: 'border-mk-ink/20'}"
						></button>
					{/each}
				</div>
			</div>
		{/snippet}

		<div
			{style}
			class="absolute top-[7%] left-[7%] h-full w-full origin-center rotate-[-6deg] bg-[var(--shop-bg)] p-5 text-[var(--shop-fg)] transition-[rotate] duration-300 ease-in-out group-hover:rotate-[-3deg] motion-reduce:transition-none"
		>
			<div class="mb-4 flex items-start justify-between gap-4">
				<div>
					<p class="mk-display text-[19px] leading-tight">Marigold Supply</p>
					<p class="font-mk-mono text-[10px] tracking-[0.14em] uppercase opacity-50">
						Home &amp; textiles
					</p>
				</div>
				<span
					class="flex items-center gap-2 font-mk-mono text-[10px] tracking-[0.12em] uppercase opacity-60"
				>
					Cart <b class="mk-num">2</b>
				</span>
			</div>

			<figure class="relative aspect-21/9 overflow-hidden">
				<ArtSlot seed={1} tone="var(--shop-accent)" base="var(--shop-bg)" class="size-full" />
				<figcaption
					class="absolute bottom-3 left-3 bg-[var(--shop-accent)] px-2.5 py-1 font-mk-mono text-[9px] tracking-[0.14em] text-[var(--shop-on-accent)] uppercase"
				>
					New season
				</figcaption>
			</figure>

			<!-- No card outlines: the gap between them is the separator. -->
			<div class="mt-4 grid grid-cols-3 gap-4">
				{#each products as product (product.name)}
					<article>
						<ArtSlot
							seed={product.motif}
							tone="var(--shop-accent)"
							base="var(--shop-bg)"
							class="aspect-4/3 w-full"
						/>
						<div class="mt-2 flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
							<p class="min-w-0 text-[12px] font-medium">{product.name}</p>
							<p class="shrink-0 mk-num text-[12px] opacity-60">{product.price}</p>
						</div>
					</article>
				{/each}
			</div>
		</div>
	</Frame>

	<!--
		Notifications stacked the way a phone stacks repeats: the newest rises in at
		the front and the rest slide back a rank.
	-->
	<div class="absolute bottom-28 -left-4 h-[68px] w-[264px] lg:-left-12">
		{#each feed as item, depth (item.at)}
			<div
				aria-live={depth === 0 ? 'polite' : undefined}
				aria-hidden={depth > 0 ? 'true' : undefined}
				style="transform:translateY({depth * -9}px) scale({1 - depth * 0.045});opacity:{[
					1, 0.55, 0.28
				][depth]};z-index:{3 - depth}"
				class="absolute inset-x-0 bottom-0 flex origin-bottom animate-mk-notify items-center gap-3 border border-mk-ink/14 bg-mk-paper px-3.5 py-3 transition-[transform,opacity] duration-500 ease-mk motion-reduce:animate-none motion-reduce:transition-none"
			>
				<!-- The app mark, same square as the nav — a notification carries an icon. -->
				<span
					aria-hidden="true"
					class="grid size-9 flex-none place-items-center bg-mk-lime text-[20px] leading-none text-mk-ink"
				>
					&#1583;
				</span>

				<div class="min-w-0 flex-1">
					<div
						class="flex items-baseline justify-between gap-2 font-mk-mono text-[9px] tracking-[0.16em] text-mk-faint uppercase"
					>
						<span>Dukk&agrave;n</span>
						<span>{depth === 0 ? 'Now' : `${depth}m`}</span>
					</div>
					<p class="mt-0.5 truncate">
						<span class="mk-num text-[16px] text-mk-ink">{item.amount}</span>
						<span class="text-[12px] text-mk-muted">&middot; {item.label}</span>
					</p>
				</div>
			</div>
		{/each}
	</div>
</div>
