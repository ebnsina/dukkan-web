<script lang="ts">
	import { lineMask, reveal, scramble } from './motion';
	import MkButton from './ui/MkButton.svelte';
	import StorefrontPreview from './StorefrontPreview.svelte';

	// Shopkeepers, named rather than illustrated with stock faces.
	const faces = ['NC', 'SM', 'AS', 'OF'];
</script>

<section class="pt-[clamp(48px,7vw,88px)] pb-[clamp(56px,7vw,96px)]">
	<div
		class="mk-wrap grid grid-cols-1 items-center gap-[clamp(32px,3.6vw,56px)] lg:grid-cols-[1.02fr_0.98fr]"
	>
		<div>
			<p use:reveal use:scramble class="mb-5 block mk-kicker text-mk-brand-type">
				Storefront &middot; Payments &middot; Inventory &middot; Shipping
			</p>

			<!--
				Two masked lines, one colour each. Neither may wrap — a wrapped line is a
				clipped line inside the mask, which is what caps the size.
			-->
			<h1 class="text-mk-h1 md:max-lg:text-[clamp(40px,5.2vw,58px)]">
				<span use:lineMask class="block overflow-hidden"
					><span>Everything your store needs.</span></span
				>
				<span use:lineMask={130} class="block overflow-hidden"
					><span class="text-mk-brand-type">Nothing it doesn't.</span></span
				>
			</h1>

			<p
				class="my-[26px] border-l-2 border-mk-brand pl-3 font-mk-mono text-[12px] tracking-[0.04em] text-mk-muted"
			>
				dukk&agrave;n &mdash; "shop". The word your customers already use.
			</p>

			<p use:reveal={100} class="max-w-[46ch] text-[clamp(16px,1.35vw,18px)] text-mk-muted">
				Sell online, take any payment, ship the order and read the numbers &mdash; from one login.
				Money settles in 24 hours.
			</p>

			<!-- Auto columns at 1fr keep both buttons the width of the longer label. -->
			<div
				use:reveal={180}
				class="mt-8 grid w-full gap-3 sm:w-fit sm:auto-cols-fr sm:grid-flow-col"
			>
				<MkButton href="#cta" variant="brand">Start free</MkButton>
				<MkButton href="/shop">See live stores</MkButton>
			</div>

			<div use:reveal={260} class="mt-9 flex items-center gap-3.5">
				<div aria-hidden="true" class="flex">
					{#each faces as initials, i (initials)}
						<span
							class="grid size-[34px] place-items-center rounded-full border-2 border-mk-paper bg-mk-shell-deep mk-display text-[11px] text-mk-ink {i >
							0
								? '-ml-2.5'
								: ''}">{initials}</span
						>
					{/each}
				</div>
				<p class="text-[13px] text-mk-muted">
					<b class="mk-num text-mk-ink">48,000+</b> merchants,
					<b class="mk-num text-mk-ink">64</b> districts
				</p>
			</div>
		</div>

		<StorefrontPreview />
	</div>
</section>
