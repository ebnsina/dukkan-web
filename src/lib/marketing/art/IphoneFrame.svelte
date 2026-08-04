<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		/** Shown in the status bar. A phone always says what time it is. */
		time?: string;
		class?: string;
		children: Snippet;
	}

	let { time = '9:41', class: className = '', children }: Props = $props();
</script>

<!--
	An iPhone: 19.5:9 portrait, thin even bezel, dynamic island, side buttons.
	Device chrome is the one place this surface allows a radius or a shadow.
-->
<!-- The wrapper carries no position of its own, so a caller can place it. -->
<div class={className}>
	<div class="relative">
		<span
			aria-hidden="true"
			class="absolute top-[15%] -left-[1px] h-[3.2%] w-[2px] rounded-l-[2px] bg-mk-dark"
		></span>
		<span
			aria-hidden="true"
			class="absolute top-[21%] -left-[1px] h-[6.5%] w-[2px] rounded-l-[2px] bg-mk-dark"
		></span>
		<span
			aria-hidden="true"
			class="absolute top-[30%] -left-[1px] h-[6.5%] w-[2px] rounded-l-[2px] bg-mk-dark"
		></span>
		<span
			aria-hidden="true"
			class="absolute top-[25%] -right-[1px] h-[9%] w-[2px] rounded-r-[2px] bg-mk-dark"
		></span>

		<div class="rounded-[15%/7%] bg-mk-dark p-[5px] shadow-[0_30px_50px_-30px_rgba(16,20,16,0.55)]">
			<div class="relative aspect-[9/19.5] overflow-hidden rounded-[14%/6.4%] bg-mk-cream">
				<span
					aria-hidden="true"
					class="absolute top-[1.4%] left-1/2 z-20 h-[3.4%] w-[30%] -translate-x-1/2 rounded-full bg-mk-dark"
				></span>

				<div
					class="flex items-center justify-between px-4 pt-[10px] font-mk-mono text-[8px] font-medium text-mk-ink"
				>
					<span>{time}</span>
					<span class="flex items-center gap-[3px]" aria-hidden="true">
						<i class="h-[6px] w-[2px] bg-mk-ink/70"></i>
						<i class="h-[6px] w-[2px] bg-mk-ink/70"></i>
						<i class="h-[7px] w-[12px] rounded-[2px] border border-mk-ink/70"></i>
					</span>
				</div>

				<div class="px-2 pt-4">
					{@render children()}
				</div>

				<!-- Home indicator: the one bar every iPhone screen ends with. -->
				<span
					aria-hidden="true"
					class="absolute bottom-[1.4%] left-1/2 h-[3px] w-[32%] -translate-x-1/2 rounded-full bg-mk-ink/25"
				></span>
			</div>
		</div>
	</div>
</div>
