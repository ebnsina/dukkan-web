<script lang="ts">
	/* The shop exists. Everything here is a way into it. */
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { CheckmarkBadge01Icon } from '@hugeicons/core-free-icons';
	import { Button, Frame } from '$lib/ui';
	import type { SignupResult } from '$lib/api/types';

	let { shop, shopName }: { shop: SignupResult; shopName: string } = $props();
</script>

<div class="text-center">
	<p class="mb-3 flex items-center justify-center gap-2 mk-kicker text-mk-brand-type">
		<HugeiconsIcon icon={CheckmarkBadge01Icon} size={16} strokeWidth={1.8} />
		Your shop is open
	</p>
	<h1 class="text-mk-h2">{shopName}</h1>
	<p class="mx-auto mt-4 max-w-[46ch] text-[17px] text-mk-muted">
		It is live now, with a few sample items so it does not look empty. Sign in to put your own things
		in it.
	</p>

	<Frame eyebrow="Your address" class="mt-9 text-left">
		<div class="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
			<a
				href={shop.storefront}
				class="font-mk-mono text-[clamp(15px,2vw,20px)] break-all text-mk-ink underline decoration-mk-brand-type underline-offset-4"
			>
				{shop.storefront}
			</a>
			<span class="shrink-0 font-mk-mono text-[11px] tracking-[0.14em] text-mk-faint uppercase"
				>{shop.theme_code} · {shop.preset_code}</span
			>
		</div>
	</Frame>

	<div class="mt-8 flex flex-wrap justify-center gap-3">
		<Button href={shop.storefront} variant="solid" arrow>Open my shop</Button>
		<Button href="/admin">Go to the dashboard</Button>
	</div>
</div>
