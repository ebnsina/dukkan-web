<script lang="ts">
	import { taka } from '../money';

	const route = [
		{ stop: 'Picked up from store', done: true },
		{ stop: 'Sorted at hub', done: true },
		{ stop: 'Out for delivery', done: false }
	];
</script>

<div class="flex flex-col gap-3 rounded-mk-nested border border-mk-rule-soft bg-mk-shell p-3.5">
	<div class="flex justify-between">
		<span class="mk-mono text-mk-muted">Waybill</span>
		<span class="mk-mono text-mk-muted">Courier partner</span>
	</div>

	<!-- Barcode drawn with a repeating gradient — no image, no font hack. -->
	<div
		aria-hidden="true"
		class="h-11 bg-[repeating-linear-gradient(90deg,var(--color-mk-ink)_0_2px,transparent_2px_4px,var(--color-mk-ink)_4px_7px,transparent_7px_12px,var(--color-mk-ink)_12px_13px,transparent_13px_17px)]"
	></div>
	<p class="text-center mk-num text-[15px] tracking-[0.16em]">7741 0928 5510</p>

	<div class="flex items-center justify-between bg-mk-dark px-3 py-2.5 text-mk-cream">
		<span class="mk-mono">Cash to collect</span>
		<span class="mk-num text-mk-brand-lift">{taka(3640)}</span>
	</div>

	<ol>
		{#each route as leg, i (leg.stop)}
			<li
				class="relative pl-[22px] font-mk-mono text-[12px] tracking-[0.02em] {i === route.length - 1
					? 'pb-0'
					: 'pb-4'} {leg.done ? 'text-mk-ink' : 'text-mk-muted'}"
			>
				<span
					class="absolute top-[5px] left-0 size-2 rounded-full border-[1.5px] {leg.done
						? 'border-mk-brand bg-mk-brand'
						: 'border-mk-rule-soft bg-mk-paper'}"
				></span>
				{#if i < route.length - 1}
					<span class="absolute top-3.5 bottom-0 left-[3.5px] w-px bg-mk-rule"></span>
				{/if}
				{leg.stop}
			</li>
		{/each}
	</ol>
</div>
