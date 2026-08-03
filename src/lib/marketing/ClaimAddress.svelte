<script lang="ts">
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { ArrowRight02Icon, CheckmarkBadge01Icon, Globe02Icon } from '@hugeicons/core-free-icons';
	import { reveal, scramble } from './motion';
	import Frame from './ui/Frame.svelte';

	/**
	 * Front-end only. It shapes the handle the way the real signup does and
	 * checks it against a short list of names already in use — the server is the
	 * authority, this only saves the visitor a round trip on obvious cases.
	 */
	const TAKEN = ['shop', 'store', 'dukkan', 'test', 'admin', 'demo', 'marigold'];
	const SUFFIX = '.dukkan.store';

	let raw = $state('fairyshop');
	let checking = $state(false);
	let timer = 0;

	// Lowercase, no spaces, no doubled or edge hyphens — same rule as signup.
	let handle = $derived(
		raw
			.toLowerCase()
			.replace(/[^a-z0-9-]+/g, '-')
			.replace(/-{2,}/g, '-')
			.replace(/^-|-$/g, '')
			.slice(0, 32)
	);

	let status = $derived(
		handle.length === 0
			? 'empty'
			: handle.length < 3
				? 'short'
				: TAKEN.includes(handle)
					? 'taken'
					: 'free'
	);

	// The field grows with what you type: a fixed-width input scrolls its own
	// start out of view, which hides the beginning of the address.
	let size = $derived(Math.min(Math.max(raw.length || 9, 9), 26));

	function onInput(event: Event) {
		raw = (event.currentTarget as HTMLInputElement).value;
		// A beat of "checking" so the answer reads as a lookup, not a guess.
		checking = true;
		clearTimeout(timer);
		timer = window.setTimeout(() => (checking = false), 420);
	}
</script>

<!--
	No tinted panel: a wash of the brand colour behind body text just muddies
	both. The section is the field — centred, on paper, with the domain set as
	one continuous line so it reads as an address rather than a form.
-->
<section class="py-[clamp(64px,8vw,104px)]">
	<div class="mk-wrap">
		<div use:reveal class="mx-auto max-w-[760px] text-center">
			<p use:scramble class="mb-4 block mk-kicker text-mk-lime-ink">Claim your address</p>
			<h2 class="text-mk-h2">Your shop is one name away.</h2>
			<p class="mx-auto mt-4 max-w-[46ch] text-[17px] text-mk-muted">
				Take a free address now, connect your own domain whenever you like.
			</p>

			<!--
				Input and action share one frame, the way a browser bar does. The
				button is inset by the same 2 units on every side rather than butting
				the panel edge — flush, it reads as a second panel welded on; inset, it
				reads as a control sitting in a field. Focus warms the panel edge
				rather than blackening it: a full-ink 1px rule around a wide field is
				a slab, and the keyboard cue is the focus-visible outline anyway.
			-->
			<Frame
				eyebrow="Your address"
				class="mt-9"
				bodyClass="transition-colors duration-200 group-focus-within/frame:border-mk-lime-ink/40"
			>
				<div class="relative flex flex-col gap-2 p-2 sm:flex-row sm:items-center">
					<!-- Marks the field as an address, and holds the left end of the row. -->
					<span
						aria-hidden="true"
						class="pointer-events-none absolute top-1/2 left-5 hidden -translate-y-1/2 text-mk-faint sm:block"
					>
						<HugeiconsIcon icon={Globe02Icon} size={18} strokeWidth={1.6} />
					</span>

					<div class="flex min-w-0 flex-1 items-baseline justify-center px-5 py-3 sm:py-5">
						<input
							value={raw}
							oninput={onInput}
							{size}
							aria-label="Shop address"
							spellcheck="false"
							autocomplete="off"
							placeholder="yourshop"
							class="min-w-0 bg-transparent text-right font-mk-mono text-[clamp(18px,2vw,24px)] text-mk-ink caret-mk-lime-ink placeholder:text-mk-faint focus:outline-none"
						/>
						<span class="font-mk-mono text-[clamp(18px,2vw,24px)] whitespace-nowrap text-mk-faint"
							>{SUFFIX}</span
						>
					</div>

					<button
						type="button"
						disabled={status !== 'free'}
						class="group/claim flex cursor-pointer items-center justify-center gap-2.5 self-stretch bg-mk-lime px-7 py-4 font-mk-mono text-[12px] font-medium tracking-[0.12em] text-mk-ink uppercase transition-colors duration-200 hover:bg-mk-lime-deep disabled:cursor-not-allowed disabled:bg-mk-shell-deep disabled:text-mk-faint"
					>
						Claim it
						<span
							class="transition-transform duration-200 group-hover/claim:translate-x-1 motion-reduce:transition-none"
						>
							<HugeiconsIcon icon={ArrowRight02Icon} size={16} strokeWidth={2} />
						</span>
					</button>
				</div>
			</Frame>

			<p
				aria-live="polite"
				class="mt-4 flex items-center justify-center gap-2 font-mk-mono text-[11px] tracking-[0.12em] uppercase"
			>
				{#if checking}
					<span class="text-mk-muted">Checking…</span>
				{:else if status === 'empty'}
					<span class="text-mk-muted">Type a name to check it</span>
				{:else if status === 'short'}
					<span class="text-mk-muted">Three characters or more</span>
				{:else if status === 'taken'}
					<span class="text-mk-muted">That one is taken — try another</span>
				{:else}
					<span class="text-mk-lime-ink">
						<HugeiconsIcon icon={CheckmarkBadge01Icon} size={16} strokeWidth={1.8} />
					</span>
					<span class="text-mk-lime-ink">{handle}{SUFFIX} is available</span>
				{/if}
			</p>
		</div>
	</div>
</section>
