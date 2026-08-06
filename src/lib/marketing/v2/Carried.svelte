<script lang="ts">
	/* The closing entry, on ink — the only place the page inverts, so it reads
	   as the bottom of the page rather than as another band. The same field as
	   the top, because the page only ever asked for one thing. */
	import Claim from './Claim.svelte';
</script>

<section class="bg-lg-ink py-[clamp(72px,9vw,128px)] text-lg-paper-inv">
	<div class="lg-wrap">
		<div class="grid grid-cols-[clamp(38px,5vw,72px)_1fr]">
			<p class="lg-num pt-2 text-[13px] text-lg-muted-inv">09</p>

			<div class="min-w-0">
				<h2 class="text-lg-head">Carried forward.</h2>
				<p class="mt-6 max-w-[50ch] text-lg-muted-inv">
					The first line in the book is the shop's name. Everything after it &mdash; the catalogue,
					the first order, the first day that closes at zero &mdash; follows from there.
				</p>

				<Claim tone="ink" label="Open the shop" class="mt-11 max-w-[640px]" />
			</div>
		</div>
	</div>
</section>
