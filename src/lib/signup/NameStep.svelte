<script lang="ts">
	import { PUBLIC_SHOP_DOMAIN } from '$env/static/public';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { Globe02Icon } from '@hugeicons/core-free-icons';
	import { Frame } from '$lib/ui';
	import NextButton from './NextButton.svelte';
	import type { AddressCheck } from './address.svelte';

	interface Props {
		shopName: string;
		address: AddressCheck;
		onnext: () => void;
	}

	let { shopName = $bindable(), address, onnext }: Props = $props();

	// Once the address has been typed by hand it stops following the name —
	// otherwise the next keystroke in the name would undo the edit.
	let edited = $state(false);
	let wanted = $state('');

	let ready = $derived(shopName.trim().length >= 2 && Boolean(address.found?.available));

	function onName(event: Event) {
		shopName = (event.currentTarget as HTMLInputElement).value;
		if (!edited) address.check(shopName);
	}

	function onAddress(event: Event) {
		wanted = (event.currentTarget as HTMLInputElement).value;
		edited = true;
		address.check(wanted);
	}
</script>

<section class="mt-9">
	<h2 class="mk-display text-[22px]">What is your shop called?</h2>
	<p class="mt-2 max-w-[52ch] text-[15px] text-mk-muted">
		Bangla is fine. The web address follows the name, and you can change it below.
	</p>

	<Frame eyebrow="Shop name" class="mt-6">
		<input
			value={shopName}
			oninput={onName}
			placeholder="রহিম স্টোর"
			aria-label="Shop name"
			autocomplete="organization"
			class="w-full bg-transparent px-5 py-4 text-[clamp(18px,2.4vw,26px)] text-mk-ink placeholder:text-mk-faint focus:outline-none"
		/>
	</Frame>

	<Frame eyebrow="Web address" class="mt-4">
		<div class="flex items-center gap-3 px-5 py-4">
			<span aria-hidden="true" class="shrink-0 text-mk-faint">
				<HugeiconsIcon icon={Globe02Icon} size={18} strokeWidth={1.6} />
			</span>
			<input
				value={edited ? wanted : (address.found?.slug ?? '')}
				oninput={onAddress}
				placeholder="your-shop"
				aria-label="Web address"
				spellcheck="false"
				autocomplete="off"
				class="min-w-0 flex-1 bg-transparent font-mk-mono text-[clamp(14px,1.7vw,18px)] text-mk-ink placeholder:text-mk-faint focus:outline-none"
			/>
			<span class="shrink-0 font-mk-mono text-[clamp(14px,1.7vw,18px)] text-mk-faint"
				>.{PUBLIC_SHOP_DOMAIN}</span
			>
		</div>
	</Frame>

	<p
		aria-live="polite"
		class="mt-3 min-h-[18px] font-mk-mono text-[11px] tracking-[0.12em] uppercase"
	>
		{#if address.checking}
			<span class="text-mk-muted">Checking…</span>
		{:else if address.failed}
			<span class="text-mk-muted">{address.failed}</span>
		{:else if address.found?.available}
			<span class="text-mk-brand-type">{address.found.slug}.{PUBLIC_SHOP_DOMAIN} is free</span>
		{:else if address.found?.reason}
			<span class="text-mk-muted">{address.found.reason}</span>
		{/if}
	</p>

	<div class="mt-8">
		<NextButton disabled={!ready} onclick={onnext}>Next</NextButton>
	</div>
</section>
