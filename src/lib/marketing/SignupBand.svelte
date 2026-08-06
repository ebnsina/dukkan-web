<script lang="ts">
	import WordmarkCycle from '$lib/marketing/art/WordmarkCycle.svelte';
	import { Button } from '$lib/ui';
	import { reveal, scramble } from './motion';
</script>

<section
	id="cta"
	class="relative overflow-hidden bg-mk-dark py-[clamp(70px,9vw,120px)] text-center text-mk-cream"
>
	<WordmarkCycle class="text-mk-cream/4" />

	<div class="relative mk-wrap max-w-[760px]">
		<p use:reveal use:scramble class="mb-1.5 block mk-kicker text-mk-brand-lift">Get started</p>
		<h2 use:reveal class="text-mk-h2">Open your dukk&agrave;n today.</h2>
		<p use:reveal={80} class="mt-[18px] text-[17px] text-mk-cream/60">
			The full platform. No card, and nothing to cancel.
		</p>

		<!-- Signup asks for a phone number, not an email: the code arrives by SMS.
		     Collecting an address here would be a second, different question. -->
		<div use:reveal={140} class="mt-8 flex justify-center">
			<Button href="/signup" size="lg" arrow>Start free</Button>
		</div>

		<p
			use:reveal={200}
			class="mt-[18px] font-mk-mono text-[11px] tracking-[0.14em] text-mk-cream/40 uppercase"
		>
			Free while we are in beta
		</p>
	</div>
</section>
