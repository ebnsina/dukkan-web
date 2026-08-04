<script lang="ts">
	import { SectionHead } from '$lib/ui';
	import { reveal } from './motion';

	/* Monograms until a real mark exists: drop the SVG in `static/logos/<slug>.svg`
	   and add its slug to `withLogo`. Tints are approximations — replace before launch. */
	const withLogo = new Set<string>();

	interface Integration {
		name: string;
		slug: string;
		group: string;
	}

	const integrations: Integration[] = [
		{ name: 'bKash', slug: 'bkash', group: 'Wallets' },
		{ name: 'Nagad', slug: 'nagad', group: 'Wallets' },
		{ name: 'Rocket', slug: 'rocket', group: 'Wallets' },
		{ name: 'JazzCash', slug: 'jazzcash', group: 'Wallets' },
		{ name: 'Easypaisa', slug: 'easypaisa', group: 'Wallets' },
		{ name: 'UPI', slug: 'upi', group: 'Wallets' },
		{ name: 'mada', slug: 'mada', group: 'Cards' },
		{ name: 'KNET', slug: 'knet', group: 'Cards' },
		{ name: 'Fawry', slug: 'fawry', group: 'Cards' },
		{ name: 'Visa', slug: 'visa', group: 'Cards' },
		{ name: 'Mastercard', slug: 'mastercard', group: 'Cards' },
		{ name: 'Apple Pay', slug: 'apple-pay', group: 'Cards' },
		{ name: 'Tabby', slug: 'tabby', group: 'Pay later' },
		{ name: 'Tamara', slug: 'tamara', group: 'Pay later' },
		{ name: 'Pathao', slug: 'pathao', group: 'Shipping' },
		{ name: 'Steadfast', slug: 'steadfast', group: 'Shipping' },
		{ name: 'RedX', slug: 'redx', group: 'Shipping' },
		{ name: 'Aramex', slug: 'aramex', group: 'Shipping' },
		{ name: 'DHL', slug: 'dhl', group: 'Shipping' },
		{ name: 'WhatsApp', slug: 'whatsapp', group: 'Channels' },
		{ name: 'Meta Ads', slug: 'meta-ads', group: 'Channels' },
		{
			name: 'TikTok Shop',
			slug: 'tiktok-shop',
			group: 'Channels'
		},
		{ name: 'QuickBooks', slug: 'quickbooks', group: 'Finance' },
		{ name: 'Xero', slug: 'xero', group: 'Finance' }
	];

	const monogram = (name: string) =>
		name
			.replace(/[^A-Za-z ]/g, '')
			.split(' ')
			.slice(0, 2)
			.map((word) => word[0])
			.join('')
			.toUpperCase();
</script>

<section class="py-mk-section">
	<div class="mk-wrap">
		<SectionHead
			kicker="Integrations"
			heading="Already connected to how you get paid."
			sub="Payments, couriers, channels and books — connected in a click, not a quarter."
		/>

		<!-- Hover isolates a category. `:has()` rather than JS: nothing here is
			focusable, so a hover handler would only earn a bogus ARIA role. -->
		<ul class="tiles grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
			{#each integrations as item, i (item.slug)}
				<li use:reveal={Math.min(i, 8) * 40} data-group={item.group}>
					<span class="group flex w-full items-center gap-3.5">
						<!-- Neutral tiles. The colours here were approximations of other
						     companies' brands, invented and applied to monograms we drew
						     ourselves — two dozen borrowed hues on a page that has one. A
						     real logo, when there is one, brings its own colour. -->
						<span
							class="grid size-10 flex-none place-items-center rounded-mk-control bg-mk-shell mk-display text-[13px] text-mk-ink transition-transform duration-200 group-hover:-translate-y-0.5"
						>
							{#if withLogo.has(item.slug)}
								<img
									src="/logos/{item.slug}.svg"
									alt=""
									class="size-5 object-contain"
									loading="lazy"
								/>
							{:else}
								{monogram(item.name)}
							{/if}
						</span>
						<span class="min-w-0">
							<span class="block truncate text-[14px] font-medium text-mk-ink">{item.name}</span>
							<span class="block font-mk-mono text-[9px] tracking-[0.14em] text-mk-faint uppercase"
								>{item.group}</span
							>
						</span>
					</span>
				</li>
			{/each}
		</ul>
	</div>
</section>

<style>
	@media (hover: hover) {
		.tiles li {
			transition:
				opacity 300ms ease,
				filter 300ms ease;
		}

		/* Anything not in the hovered tile's category recedes. */
		.tiles:has(li:hover) li {
			opacity: 0.25;
			filter: grayscale(1);
		}

		.tiles:has(li[data-group='Wallets']:hover) li[data-group='Wallets'],
		.tiles:has(li[data-group='Cards']:hover) li[data-group='Cards'],
		.tiles:has(li[data-group='Pay later']:hover) li[data-group='Pay later'],
		.tiles:has(li[data-group='Shipping']:hover) li[data-group='Shipping'],
		.tiles:has(li[data-group='Channels']:hover) li[data-group='Channels'],
		.tiles:has(li[data-group='Finance']:hover) li[data-group='Finance'] {
			opacity: 1;
			filter: none;
		}
	}
</style>
