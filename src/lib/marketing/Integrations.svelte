<script lang="ts">
	import { reveal } from './motion';
	import MkSectionHead from './ui/MkSectionHead.svelte';

	/**
	 * Tiles show a monogram in the provider's brand colour until a real mark is
	 * available. Drop the SVG into `static/logos/<slug>.svg` and add its slug to
	 * `withLogo` — we don't ship third-party trademarks in the repo, and probing
	 * for missing files would just spray 404s.
	 *
	 * `tint` values are approximations taken from each brand's public identity.
	 * Replace them from the official brand guidelines before launch; `onTint`
	 * says which text colour keeps the monogram legible.
	 *
	 * Each tile mixes its own colour into a two-light aurora rather than sitting
	 * flat, so two dozen solid squares don't read as a colour chart.
	 */
	const withLogo = new Set<string>();

	interface Integration {
		name: string;
		slug: string;
		group: string;
		tint: string;
		onTint: 'light' | 'dark';
	}

	const integrations: Integration[] = [
		{ name: 'bKash', slug: 'bkash', group: 'Wallets', tint: '#e2136e', onTint: 'light' },
		{ name: 'Nagad', slug: 'nagad', group: 'Wallets', tint: '#ee1c25', onTint: 'light' },
		{ name: 'Rocket', slug: 'rocket', group: 'Wallets', tint: '#8c3494', onTint: 'light' },
		{ name: 'JazzCash', slug: 'jazzcash', group: 'Wallets', tint: '#c8102e', onTint: 'light' },
		{ name: 'Easypaisa', slug: 'easypaisa', group: 'Wallets', tint: '#00a651', onTint: 'light' },
		{ name: 'UPI', slug: 'upi', group: 'Wallets', tint: '#097939', onTint: 'light' },
		{ name: 'mada', slug: 'mada', group: 'Cards', tint: '#00953b', onTint: 'light' },
		{ name: 'KNET', slug: 'knet', group: 'Cards', tint: '#0069b4', onTint: 'light' },
		{ name: 'Fawry', slug: 'fawry', group: 'Cards', tint: '#ffcc00', onTint: 'dark' },
		{ name: 'Visa', slug: 'visa', group: 'Cards', tint: '#1a1f71', onTint: 'light' },
		{ name: 'Mastercard', slug: 'mastercard', group: 'Cards', tint: '#eb001b', onTint: 'light' },
		{ name: 'Apple Pay', slug: 'apple-pay', group: 'Cards', tint: '#101410', onTint: 'light' },
		{ name: 'Tabby', slug: 'tabby', group: 'Pay later', tint: '#3eedbf', onTint: 'dark' },
		{ name: 'Tamara', slug: 'tamara', group: 'Pay later', tint: '#2b0a3d', onTint: 'light' },
		{ name: 'Pathao', slug: 'pathao', group: 'Shipping', tint: '#e63946', onTint: 'light' },
		{ name: 'Steadfast', slug: 'steadfast', group: 'Shipping', tint: '#0d3b66', onTint: 'light' },
		{ name: 'RedX', slug: 'redx', group: 'Shipping', tint: '#d32027', onTint: 'light' },
		{ name: 'Aramex', slug: 'aramex', group: 'Shipping', tint: '#c8102e', onTint: 'light' },
		{ name: 'DHL', slug: 'dhl', group: 'Shipping', tint: '#ffcc00', onTint: 'dark' },
		{ name: 'WhatsApp', slug: 'whatsapp', group: 'Channels', tint: '#25d366', onTint: 'dark' },
		{ name: 'Meta Ads', slug: 'meta-ads', group: 'Channels', tint: '#0866ff', onTint: 'light' },
		{
			name: 'TikTok Shop',
			slug: 'tiktok-shop',
			group: 'Channels',
			tint: '#fe2c55',
			onTint: 'light'
		},
		{ name: 'QuickBooks', slug: 'quickbooks', group: 'Finance', tint: '#2ca01c', onTint: 'light' },
		{ name: 'Xero', slug: 'xero', group: 'Finance', tint: '#13b5ea', onTint: 'light' }
	];

	// Lit from the top-left, shadowed bottom-right, in the brand's own hue.
	const aurora = (tint: string) =>
		[
			`radial-gradient(140% 140% at 18% 0%, color-mix(in oklab, ${tint}, white 26%) 0%, transparent 66%)`,
			`radial-gradient(150% 150% at 100% 100%, color-mix(in oklab, ${tint}, black 22%) 0%, transparent 70%)`,
			`linear-gradient(${tint}, ${tint})`
		].join(',');

	const monogram = (name: string) =>
		name
			.replace(/[^A-Za-z ]/g, '')
			.split(' ')
			.slice(0, 2)
			.map((word) => word[0])
			.join('')
			.toUpperCase();
</script>

<section class="pb-mk-section">
	<div class="mk-wrap">
		<MkSectionHead
			kicker="Integrations"
			heading="Already connected to how you get paid."
			sub="Payments, couriers, channels and books — connected in a click, not a quarter."
		/>

		<!--
			Hovering a tile isolates its category and dims the rest. Done with
			:has() rather than JS: nothing here is focusable or clickable, so a
			hover handler on a static element would only earn a bogus ARIA role.
		-->
		<ul class="tiles grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
			{#each integrations as item, i (item.slug)}
				<li use:reveal={Math.min(i, 8) * 40} data-group={item.group}>
					<span class="group flex w-full items-center gap-3.5">
						<span
							style="background-image:{aurora(item.tint)}"
							class="grid size-10 flex-none place-items-center mk-display text-[13px] transition-transform duration-200 group-hover:-translate-y-0.5 {item.onTint ===
							'light'
								? 'text-white'
								: 'text-mk-ink'}"
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
