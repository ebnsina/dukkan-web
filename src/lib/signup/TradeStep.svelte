<script lang="ts">
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import BackLink from './BackLink.svelte';
	import { industryIcon, industryLabel } from './industries';
	import type { Industry } from '$lib/api/types';

	interface Props {
		industries: Industry[];
		chosen: string;
		onpick: (code: string) => void;
		onback: () => void;
	}

	let { industries, chosen, onpick, onback }: Props = $props();
</script>

<section class="mt-9">
	<h2 class="mk-display text-[22px]">What do you sell?</h2>
	<p class="mt-2 max-w-[52ch] text-[15px] text-mk-muted">
		This picks the design that suits your shop, and the sample items we start you with.
	</p>

	<div class="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
		{#each industries as trade (trade.code)}
			<button
				type="button"
				onclick={() => onpick(trade.code)}
				class="flex cursor-pointer flex-col items-start gap-3 rounded-mk-control border p-4 text-left transition-colors duration-200 {chosen ===
				trade.code
					? 'border-mk-ink bg-mk-shell'
					: 'border-mk-ink/15 hover:border-mk-ink'}"
			>
				<span class="text-mk-brand-type">
					<HugeiconsIcon icon={industryIcon(trade.code)} size={20} strokeWidth={1.6} />
				</span>
				<span class="text-[14px] text-mk-ink">{industryLabel(trade.code)}</span>
			</button>
		{/each}
	</div>

	<div class="mt-8 flex gap-3">
		<BackLink onclick={onback} />
	</div>
</section>
