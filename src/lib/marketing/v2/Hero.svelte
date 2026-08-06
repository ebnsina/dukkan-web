<script lang="ts">
	/* The opening entry.
	 *
	 * Two lines, because the product is two promises and the second is the one
	 * nobody else here keeps. The address field sits directly under them: the
	 * page asks for one thing and asks for it immediately.
	 */
	import Claim from './Claim.svelte';

	let { demoShop }: { demoShop: string } = $props();
</script>

<section id="top" class="pt-[clamp(56px,7vw,104px)] pb-lg-entry">
	<div class="grid grid-cols-[clamp(38px,5vw,72px)_1fr]">
		<p class="lg-num pt-2 text-[13px] text-lg-faint">01</p>

		<div class="min-w-0">
			<h1 class="text-lg-display">
				Sell online.<br />Count every taka.
			</h1>

			<p class="mt-8 max-w-[52ch] text-[clamp(17px,1.5vw,19px)] text-lg-muted">
				A shop at your own address, cash on delivery at the door, Steadfast carrying it &mdash; and
				a day that closes with nothing unexplained.
			</p>

			<Claim class="mt-12 max-w-[640px]" />

			<p class="mt-14 max-w-[60ch] border-t border-lg-rule-soft pt-5 text-[14px] text-lg-muted">
				Already selling? <a href={demoShop} class="text-lg-ink underline underline-offset-4"
					>Look at a shop</a
				>
				first, or read what the day's book does further down.
			</p>
		</div>
	</div>
</section>
