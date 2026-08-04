<script lang="ts">
	import * as v from 'valibot';
	import { reveal, scramble } from './motion';
	import WordmarkCycle from './ui/WordmarkCycle.svelte';

	// The server is the real validator; this only catches typos before a round trip.
	const EmailSchema = v.pipe(
		v.string(),
		v.trim(),
		v.nonEmpty('Enter your email address.'),
		v.email('That does not look like an email address.')
	);

	let email = $state('');
	let done = $state(false);
	let error = $state('');

	function submit(event: SubmitEvent) {
		event.preventDefault();
		const result = v.safeParse(EmailSchema, email);

		if (!result.success) {
			error = result.issues[0].message;
			return;
		}

		error = '';
		done = true;
	}
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
			Fourteen days, the full platform, no card.
		</p>

		{#if done}
			<p class="mt-8 text-[16px] text-mk-brand-lift">
				Check your inbox &mdash; your shop is waiting.
				&#2471;&#2472;&#2509;&#2479;&#2476;&#2494;&#2470; &middot;
				&#1588;&#1603;&#1585;&#1575;&#1611;
			</p>
		{:else}
			<form
				use:reveal={140}
				onsubmit={submit}
				class="mx-auto mt-8 flex max-w-[480px] flex-col gap-2.5 sm:flex-row"
			>
				<input
					type="email"
					bind:value={email}
					placeholder="you@yourshop.com"
					aria-label="Email address"
					aria-invalid={Boolean(error)}
					aria-describedby={error ? 'mk-signup-error' : undefined}
					class="flex-1 rounded-mk-control border bg-transparent px-4 py-[15px] text-[15px] text-mk-cream placeholder:text-mk-cream/35 focus:border-mk-brand focus:outline-none {error
						? 'border-mk-brand'
						: 'border-mk-cream/30'}"
				/>
				<button
					type="submit"
					class="cursor-pointer rounded-mk-control border border-mk-brand bg-mk-brand px-6 py-[15px] font-mk-mono text-[12px] font-medium tracking-[0.12em] text-mk-on-brand uppercase transition-colors duration-200 hover:border-mk-brand-deep hover:bg-mk-brand-deep"
					>Start free</button
				>
			</form>

			{#if error}
				<p
					id="mk-signup-error"
					aria-live="polite"
					class="mt-3 font-mk-mono text-[11px] tracking-[0.12em] text-mk-brand-lift uppercase"
				>
					{error}
				</p>
			{/if}
		{/if}

		<p
			use:reveal={200}
			class="mt-[18px] font-mk-mono text-[11px] tracking-[0.14em] text-mk-cream/40 uppercase"
		>
			14-day trial &middot; Cancel anytime
		</p>
	</div>
</section>
