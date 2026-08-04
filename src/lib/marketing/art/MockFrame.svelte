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
	A screen carrying on past its frame: oversized, offset, tilted. The angle is
	the point — a fragment of a working screen reads as a glimpse, where the
	whole thing squared up reads as a dense screenshot to study.

	It does not move under the pointer: there is nothing to click in a picture,
	so a hover response promises an interaction that is not there.
-->
<Frame clip class={tall ? 'h-[clamp(320px,32vw,420px)]' : 'h-[clamp(230px,23vw,290px)]'}>
	<!--
		h-full + min-h-full is what guarantees the bleed, whatever the content.
		The tilted screen carries its own corner: a square one cuts into the
		frame's rounded corner as a blade, which is the one place the angle looks
		like a mistake rather than a crop.
	-->
	<div
		class="absolute top-[13%] left-[8%] h-full w-[104%] origin-center overflow-hidden rounded-mk-panel rotate-[-6deg] [&>*]:min-h-full"
	>
		{@render children()}
	</div>
</Frame>
