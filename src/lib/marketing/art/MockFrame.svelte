<script lang="ts">
	import { Frame } from '$lib/ui';
	import type { Snippet } from 'svelte';

	interface Props {
		/** The wide panel's mock gets more room than the half-width ones. */
		tall?: boolean;
		children: Snippet;
	}

	let { tall = false, children }: Props = $props();
</script>

<!--
	A screen carrying on past its frame: oversized, offset, tilted, straightening
	under the pointer.
-->
<Frame clip class="group {tall ? 'h-[clamp(320px,32vw,420px)]' : 'h-[clamp(230px,23vw,290px)]'}">
	<!-- h-full + min-h-full is what guarantees the bleed, whatever the content. -->
	<div
		class="absolute top-[13%] left-[8%] h-full w-[104%] origin-center rotate-[-6deg] transition-[rotate] duration-300 ease-in-out group-hover:rotate-[-3deg] motion-reduce:transition-none [&>*]:min-h-full"
	>
		{@render children()}
	</div>
</Frame>
