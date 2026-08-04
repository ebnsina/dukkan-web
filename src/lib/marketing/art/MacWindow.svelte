<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		url: string;
		/** Panel aspect ratio, e.g. '4/3'. Sized from its own width, not a height. */
		ratio?: string;
		class?: string;
		children: Snippet;
	}

	let { url, ratio, class: className = '', children }: Props = $props();
</script>

<!--
	A macOS window, drawn to look like one: rounded shell, traffic lights, centred
	address. Device chrome is the one place this surface allows a radius.
-->
<div
	class="overflow-hidden rounded-[11px] border border-mk-ink/12 bg-mk-paper shadow-[0_24px_50px_-30px_rgba(16,20,16,0.45)] {className}"
>
	<div class="flex items-center gap-3 border-b border-mk-ink/8 bg-mk-shell px-3.5 py-2.5">
		<span class="flex flex-none gap-[6px]">
			<i class="size-[11px] rounded-full bg-[#ff5f57]"></i>
			<i class="size-[11px] rounded-full bg-[#febc2e]"></i>
			<i class="size-[11px] rounded-full bg-[#28c840]"></i>
		</span>

		<span
			class="min-w-0 flex-1 truncate rounded-[5px] bg-mk-paper px-3 py-[3px] text-center font-mk-mono text-[10px] tracking-[0.04em] text-mk-muted"
			>{url}</span
		>

		<!-- Balances the lights so the address sits on the window's centre line. -->
		<span aria-hidden="true" class="w-[45px] flex-none"></span>
	</div>

	<div
		style={ratio ? `aspect-ratio:${ratio}` : undefined}
		class="relative overflow-hidden bg-mk-paper"
	>
		{@render children()}
	</div>
</div>
