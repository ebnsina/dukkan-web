<script lang="ts">
	/* The page's one action: write the shop's name on the line.
	 *
	 * Set as a rule you write on rather than a boxed field, because that is what
	 * the rest of the page is — and because the address is the whole commitment
	 * being asked for here. Signup asks again; the server is the authority on
	 * whether a handle is free.
	 */
	import { PUBLIC_SHOP_DOMAIN } from '$env/static/public';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { ArrowRight02Icon } from '@hugeicons/core-free-icons';
	import * as v from 'valibot';

	interface Props {
		/** The closing entry sits on ink and needs the reversed palette. */
		tone?: 'paper' | 'ink';
		label?: string;
		class?: string;
	}

	let { tone = 'paper', label = 'Open the shop', class: className = '' }: Props = $props();

	// A courtesy check only, so the field can answer before the server can.
	const TAKEN = ['shop', 'store', 'dukkan', 'admin', 'test', 'demo'];
	/* The domain is configuration. Written into the markup it becomes a promise
	   the product breaks the day the name changes. */
	const SUFFIX = `.${PUBLIC_SHOP_DOMAIN}`;

	let raw = $state('');
	let checking = $state(false);
	let timer = 0;

	// The same rule signup applies, so the address offered here is the one granted.
	let handle = $derived(
		raw
			.toLowerCase()
			.replace(/[^a-z0-9-]+/g, '-')
			.replace(/-{2,}/g, '-')
			.replace(/^-|-$/g, '')
			.slice(0, 32)
	);

	const HandleSchema = v.pipe(
		v.string(),
		v.nonEmpty('Write a name to check it'),
		v.minLength(3, 'Three characters or more'),
		v.check((value) => !TAKEN.includes(value), 'Taken — try another')
	);

	let result = $derived(v.safeParse(HandleSchema, handle));
	let problem = $derived(result.success ? '' : result.issues[0].message);

	function onInput(event: Event) {
		raw = (event.currentTarget as HTMLInputElement).value;
		// A beat, so the answer reads as a lookup rather than a guess.
		checking = true;
		clearTimeout(timer);
		timer = window.setTimeout(() => (checking = false), 380);
	}

	/* Carried through to signup, so the address is typed once rather than
	   twice to reach the same shop. */
	let href = $derived(handle ? `/signup?shop=${encodeURIComponent(handle)}` : '/signup');

	let ink = $derived(tone === 'ink');

	/* The field grows with what is written in it, so the name and the domain
	   stay one address. Fixed width, they read as two things with a gap. */
	let size = $derived(Math.min(Math.max(raw.length || 8, 8), 26));
</script>

<div class={className}>
	<div class="flex flex-col gap-4 sm:flex-row sm:items-end">
		<label class="min-w-0 flex-1">
			<span class="lg-label block {ink ? 'text-lg-muted-inv' : 'text-lg-muted'}">Shop address</span>

			<span
				class="mt-2 flex items-baseline border-b-2 pb-2 transition-colors duration-200 {ink
					? 'border-lg-rule-inv focus-within:border-lg-paper-inv'
					: 'border-lg-rule focus-within:border-lg-ink'}"
			>
				<input
					value={raw}
					oninput={onInput}
					{size}
					aria-label="Your shop address"
					spellcheck="false"
					autocomplete="off"
					placeholder="yourshop"
					class="min-w-0 bg-transparent [field-sizing:content] font-lg-num text-[clamp(17px,2vw,22px)] tracking-tight focus:outline-none {ink
						? 'text-lg-paper-inv caret-lg-paper-inv placeholder:text-lg-muted-inv'
						: 'text-lg-ink caret-lg-brand placeholder:text-lg-faint'}"
				/>
				<span
					class="font-lg-num text-[clamp(17px,2vw,22px)] tracking-tight whitespace-nowrap {ink
						? 'text-lg-muted-inv'
						: 'text-lg-faint'}"
				>
					{SUFFIX}
				</span>
			</span>
		</label>

		<a
			{href}
			class="group/claim flex shrink-0 cursor-pointer items-center justify-center gap-2.5 rounded-[3px] bg-lg-brand px-7 py-4 font-lg-num text-[12px] font-medium tracking-[0.1em] whitespace-nowrap text-lg-on-brand uppercase transition-colors duration-200 hover:bg-lg-brand-deep"
		>
			{label}
			<span
				class="transition-transform duration-200 group-hover/claim:translate-x-1 motion-reduce:transition-none"
			>
				<HugeiconsIcon icon={ArrowRight02Icon} size={15} strokeWidth={2} />
			</span>
		</a>
	</div>

	<!-- Before anything is written the line answers what the button costs,
	     rather than reporting an error about an empty field. -->
	<p
		aria-live="polite"
		class="lg-label mt-4 {ink ? 'text-lg-muted-inv' : 'text-lg-muted'}"
	>
		{#if !raw}
			Free to start &middot; no card &middot; open today
		{:else if checking}
			Checking&hellip;
		{:else if problem}
			{problem}
		{:else}
			<span class={ink ? 'text-lg-paper-inv' : 'text-lg-credit'}>
				{handle}{SUFFIX} is free
			</span>
		{/if}
	</p>
</div>
