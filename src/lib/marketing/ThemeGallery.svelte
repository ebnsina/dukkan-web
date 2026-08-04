<script lang="ts">
	import { Frame, SectionHead } from '$lib/ui';
	import { reveal } from './motion';
	import ThemeMock from './mocks/ThemeMock.svelte';

	/* A theme store, not a grid of cards. The accents belong to the demo shops —
	   the one place other hues are legitimate, because variety is the product. */
	interface Theme {
		name: string;
		category: string;
		note: string;
		motif: number;
		rtl?: boolean;
		localName?: string;
		badge?: string;
		/** `art` is the hue the image slots glow with — an accent of near-black
		 * would wash out to grey, which is not an aurora. */
		palette: { bg: string; fg: string; accent: string; onAccent: string; art: string };
	}

	const themes: Theme[] = [
		{
			name: 'Medina',
			category: 'Fashion',
			note: 'Right-to-left first — the preview runs in Arabic.',
			rtl: true,
			localName: 'المدينة',
			motif: 0,
			badge: 'Most installed',
			palette: {
				bg: '#f7f3ec',
				fg: '#1b1712',
				accent: '#1b1712',
				onAccent: '#f7f3ec',
				art: '#b8823c'
			}
		},
		{
			name: 'Atelier',
			category: 'Fashion',
			note: 'Editorial spacing, photography carries the page.',
			motif: 1,
			palette: {
				bg: '#ffffff',
				fg: '#101214',
				accent: '#101214',
				onAccent: '#ffffff',
				art: '#7b8a99'
			}
		},
		{
			name: 'Souk',
			category: 'Grocery',
			note: 'Dense catalogue, built for hundreds of SKUs.',
			motif: 2,
			badge: 'New',
			palette: {
				bg: '#fdf6ea',
				fg: '#2a1a0f',
				accent: '#c2551f',
				onAccent: '#fff8f0',
				art: '#c2551f'
			}
		},
		{
			name: 'Noor',
			category: 'Beauty',
			note: 'Ingredient lists and shade pickers, handled.',
			motif: 3,
			palette: {
				bg: '#f6f1f4',
				fg: '#241a20',
				accent: '#7d4a63',
				onAccent: '#faf6f8',
				art: '#8d5375'
			}
		},
		{
			name: 'Kiosk',
			category: 'Grocery',
			note: 'One-tap reorder, built for repeat baskets.',
			motif: 4,
			palette: {
				bg: '#f2f6f3',
				fg: '#12211a',
				accent: '#1f6d4e',
				onAccent: '#f2f6f3',
				art: '#1f6d4e'
			}
		},
		{
			name: 'Gallery',
			category: 'Home',
			note: 'Made for one-of-a-kind stock and long stories.',
			motif: 5,
			palette: {
				bg: '#f4f4f2',
				fg: '#17181a',
				accent: '#3c5a7a',
				onAccent: '#f4f6f8',
				art: '#3c5a7a'
			}
		}
	];

	let selected = $state(0);
	let theme = $derived(themes[selected]);
</script>

<section id="themes" class="py-mk-section">
	<div class="mk-wrap">
		<SectionHead
			kicker="Themes"
			heading="A storefront for every kind of trade."
			sub="Every theme ships multilingual, RTL-ready and under 90KB. Swap it on a Tuesday without touching your products."
		/>

		<div class="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(280px,0.8fr)_1.7fr] lg:gap-16">
			<!-- The index. Picking a row repaints the preview beside it. -->
			<ul use:reveal class="flex flex-col border-t border-mk-rule-soft">
				{#each themes as item, i (item.name)}
					{@const isActive = i === selected}
					<li class="border-b border-mk-rule-soft">
						<button
							type="button"
							onclick={() => (selected = i)}
							onmouseenter={() => (selected = i)}
							aria-pressed={isActive}
							class="group flex w-full cursor-pointer items-baseline gap-4 py-4 text-left transition-colors duration-200"
						>
							<span
								class="w-7 shrink-0 mk-num text-[11px] transition-colors duration-200 {isActive
									? 'text-mk-brand-type'
									: 'text-mk-faint'}">0{i + 1}</span
							>

							<span class="min-w-0 flex-1">
								<span class="flex items-center gap-2.5">
									<span
										class="mk-display text-[20px] transition-colors duration-200 {isActive
											? 'text-mk-ink'
											: 'text-mk-muted group-hover:text-mk-ink'}">{item.name}</span
									>
									{#if item.badge}
										<span
											class="rounded-mk-chip bg-mk-brand px-2 py-[3px] font-mk-mono text-[9px] tracking-[0.14em] text-mk-on-brand uppercase"
											>{item.badge}</span
										>
									{/if}
								</span>
								<span
									class="mt-1 block text-[13px] transition-colors duration-200 {isActive
										? 'text-mk-muted'
										: 'text-mk-faint'}">{item.note}</span
								>
							</span>

							<span class="font-mk-mono text-[9px] tracking-[0.14em] text-mk-faint uppercase"
								>{item.category}</span
							>
						</button>
					</li>
				{/each}
			</ul>

			<div use:reveal={80}>
				<Frame eyebrow="Preview" title="{theme.name.toLowerCase()}.dukkan.store" tag={theme.badge}>
					<ThemeMock
						name={theme.name}
						rtl={theme.rtl}
						localName={theme.localName}
						motif={theme.motif}
						palette={theme.palette}
					/>
					{#snippet footer()}
						<p class="font-mk-mono text-[10px] tracking-[0.14em] text-mk-faint uppercase">
							Every theme is free to try &middot; swap without touching your products
						</p>
					{/snippet}
				</Frame>
			</div>
		</div>
	</div>
</section>
