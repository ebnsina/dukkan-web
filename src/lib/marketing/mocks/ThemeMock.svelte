<script lang="ts">
	import ArtSlot from '$lib/marketing/art/ArtSlot.svelte';
	import { taka } from '../money';

	interface Props {
		name: string;
		/** Renders the storefront right-to-left, in Arabic — a theme that claims
		 * RTL should be seen doing it, not captioned as doing it. */
		rtl?: boolean;
		/** Shop name in the storefront's own script. */
		localName?: string;
		/** Chooses the motif set, so each theme reads differently. */
		motif: number;
		palette: { bg: string; fg: string; accent: string; onAccent: string; art: string };
	}

	let { name, rtl = false, localName, motif, palette }: Props = $props();

	// Nav in the reading direction the theme actually ships.
	const nav = { ltr: ['Shop', 'Journal', 'Cart (2)'], rtl: ['المتجر', 'المجلة', 'السلة (٢)'] };

	// Price and buy belong on the product. One bar under the whole grid reads as
	// a checkout, and no catalogue page has one.
	const products = {
		ltr: [
			{ name: 'Woven throw', price: taka(2450) },
			{ name: 'Linen scarf', price: taka(1190) },
			{ name: 'Clay vessel', price: taka(980) }
		],
		rtl: [
			{ name: 'بطانية منسوجة', price: taka(2450) },
			{ name: 'وشاح كتان', price: taka(1190) },
			{ name: 'إناء فخاري', price: taka(980) }
		]
	};

	// Palette rides on custom properties, so switching themes is a colour
	// transition rather than a re-render.
	let style = $derived(
		`--t-bg:${palette.bg};--t-fg:${palette.fg};--t-accent:${palette.accent};--t-on:${palette.onAccent}`
	);
</script>

<!--
	The theme's own palette on the same storefront. Colour never transitions:
	gradients cannot interpolate, so a fade would show a theme that does not exist.
-->
	<!--
	No browser chrome. The Frame around this already names the address in its
	header, so the dots and the URL pill drew it twice and spent the top of the
	preview on a picture of a window instead of on the theme.
-->
	<!--
	The corner is the frame's less the rail it sits inside: a 17px panel with a
	10px inset wants 7px here, so the two curves stay concentric instead of a
	square box sitting in a rounded one.
-->
<div
	{style}
	class="overflow-hidden rounded-mk-tile border border-mk-ink/10 bg-[var(--t-bg)] text-[var(--t-fg)]"
>
	<div class="p-6">
		<div class="mb-5 flex items-baseline justify-between">
			<p class="mk-display text-[22px]">{rtl && localName ? localName : name}</p>
			<div class="flex gap-5 font-mk-mono text-[10px] tracking-[0.14em] uppercase opacity-45">
				{#each rtl ? nav.rtl : nav.ltr as item (item)}
					<span>{item}</span>
				{/each}
			</div>
		</div>

		<ArtSlot seed={motif} tone={palette.art} base={palette.bg} class="aspect-21/9" />

		<!-- Each card carries its own name, price and buy. -->
		<div class="mt-5 grid grid-cols-3 gap-5">
			{#each rtl ? products.rtl : products.ltr as product, i (product.name)}
				<article class="flex flex-col">
					<ArtSlot
						seed={motif + i + 1}
						tone={palette.accent}
						base={palette.bg}
						class="aspect-5/4 w-full"
					/>
					<!-- Wraps rather than truncates: ~90px cards in a narrow frame. -->
					<div
						class="mt-2.5 flex flex-1 flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5"
					>
						<p class="min-w-0 text-[13px]">{product.name}</p>
						<!-- Prices stay LTR even in an RTL theme — currency reads left to right. -->
						<p class="shrink-0 mk-num text-[13px] opacity-60" dir="ltr">{product.price}</p>
					</div>
					<button
						type="button"
						tabindex="-1"
						class="mt-2.5 bg-[var(--t-accent)] px-3 py-2 font-mk-mono text-[9px] tracking-[0.14em] text-[var(--t-on)] uppercase"
					>
						{rtl ? 'أضف إلى السلة' : 'Add to cart'}
					</button>
				</article>
			{/each}
		</div>
	</div>
</div>
