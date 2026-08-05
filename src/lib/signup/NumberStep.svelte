<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import BackLink from './BackLink.svelte';
	import NextButton from './NextButton.svelte';

	/* Sending the code must not clear the number.
	 *
	 * The default `enhance` resets the form element on a successful post, and a
	 * reset field takes its binding down with it — so the number was gone by the
	 * time the form below posted it, and creating the shop failed on a phone the
	 * merchant had plainly typed. This form is a step in a flow, not a thing to
	 * be emptied once sent. */
	const keepTheNumber: SubmitFunction =
		() =>
		async ({ result }) => {
			await applyAction(result);
		};

	interface Props {
		/** Carried into the completing form, which is the one that creates the shop. */
		shopName: string;
		slug: string;
		industry: string;
		themeCode: string;
		presetCode: string;
		/* Owned by the page, not by this step. `enhance` resets the form element
		   on a successful post, so a number kept here would be wiped by the very
		   request that sends the code — and the form that creates the shop would
		   post an empty phone. */
		phone: string;
		/** True once a code has gone out, which is what reveals the second form. */
		sent: boolean;
		fields: Record<string, string>;
		onback: () => void;
	}

	let {
		shopName,
		slug,
		industry,
		themeCode,
		presetCode,
		phone = $bindable(),
		sent,
		fields,
		onback
	}: Props = $props();

	let ownerName = $state('');
	let code = $state('');

	let ready = $derived(/^(\+?88)?01[3-9]\d{8}$/.test(phone.trim()));
</script>

<section class="mt-9">
	<h2 class="mk-display text-[22px]">Your mobile number.</h2>
	<p class="mt-2 max-w-[52ch] text-[15px] text-mk-muted">
		This is how you sign in, and where we send the code. No password to forget.
	</p>

	<!-- Sending the code is its own post so a wrong number costs one message,
	     not a whole form. -->
	<form method="POST" action="?/start" use:enhance={keepTheNumber} class="mt-6 max-w-[440px]">
		<label
			class="block font-mk-mono text-[11px] tracking-[0.14em] text-mk-faint uppercase"
			for="signup-phone">Mobile number</label
		>
		<div class="mt-2 flex flex-col gap-2 sm:flex-row">
			<input
				id="signup-phone"
				name="phone"
				bind:value={phone}
				inputmode="tel"
				autocomplete="tel"
				placeholder="01712345678"
				aria-invalid={Boolean(fields.phone)}
				class="min-w-0 flex-1 rounded-mk-control border border-mk-ink/25 bg-transparent px-4 py-[15px] font-mk-mono text-[15px] text-mk-ink placeholder:text-mk-faint focus:border-mk-ink focus:outline-none"
			/>
			<button
				type="submit"
				disabled={!ready}
				class="cursor-pointer rounded-mk-control border border-mk-ink/25 px-6 py-[15px] font-mk-mono text-[12px] tracking-[0.12em] text-mk-ink uppercase hover:border-mk-ink hover:bg-mk-ink hover:text-mk-paper disabled:cursor-not-allowed disabled:border-mk-ink/10 disabled:text-mk-faint disabled:hover:bg-transparent"
			>
				{sent ? 'Send again' : 'Send the code'}
			</button>
		</div>
		{#if fields.phone}
			<p class="mt-2 font-mk-mono text-[11px] tracking-[0.12em] text-mk-ink uppercase">
				{fields.phone}
			</p>
		{/if}
	</form>

	{#if sent}
		<form
			method="POST"
			action="?/complete"
			use:enhance
			class="mt-7 max-w-[440px] border-t border-mk-rule pt-7"
		>
			<input type="hidden" name="shop_name" value={shopName} />
			<input type="hidden" name="slug" value={slug} />
			<input type="hidden" name="industry" value={industry} />
			<input type="hidden" name="theme_code" value={themeCode} />
			<input type="hidden" name="preset_code" value={presetCode} />
			<input type="hidden" name="phone" value={phone} />

			<label
				class="block font-mk-mono text-[11px] tracking-[0.14em] text-mk-faint uppercase"
				for="signup-owner">Your name</label
			>
			<input
				id="signup-owner"
				name="owner_name"
				bind:value={ownerName}
				autocomplete="name"
				placeholder="Rahim Uddin"
				class="mt-2 w-full rounded-mk-control border border-mk-ink/25 bg-transparent px-4 py-[15px] text-[15px] text-mk-ink placeholder:text-mk-faint focus:border-mk-ink focus:outline-none"
			/>

			<label
				class="mt-5 block font-mk-mono text-[11px] tracking-[0.14em] text-mk-faint uppercase"
				for="signup-code">The code we sent you</label
			>
			<input
				id="signup-code"
				name="code"
				bind:value={code}
				inputmode="numeric"
				autocomplete="one-time-code"
				placeholder="000000"
				aria-invalid={Boolean(fields.code)}
				class="mt-2 w-full rounded-mk-control border border-mk-ink/25 bg-transparent px-4 py-[15px] font-mk-mono text-[20px] tracking-[0.3em] text-mk-ink placeholder:text-mk-faint focus:border-mk-ink focus:outline-none"
			/>
			{#if fields.code}
				<p class="mt-2 font-mk-mono text-[11px] tracking-[0.12em] text-mk-ink uppercase">
					{fields.code}
				</p>
			{/if}
			{#if fields.slug}
				<p class="mt-2 font-mk-mono text-[11px] tracking-[0.12em] text-mk-ink uppercase">
					{fields.slug}
				</p>
			{/if}

			<div class="mt-6">
				<NextButton type="submit" full>Open my shop</NextButton>
			</div>
		</form>
	{/if}

	<div class="mt-8">
		<BackLink onclick={onback} />
	</div>
</section>
