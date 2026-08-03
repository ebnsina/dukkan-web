<script lang="ts">
	import type { Snippet } from 'svelte';
	import Frame from './Frame.svelte';

	interface Props {
		/** The wide panel's mock gets more room than the half-width ones. */
		tall?: boolean;
		children: Snippet;
	}

	let { tall = false, children }: Props = $props();
</script>

<!--
	Same treatment as the hero: the mock is a screen that carries on past the
	frame. It sits oversized and offset inside a clipped surface, leans six
	degrees off true about its own centre, and straightens under the pointer.
	Square and flat — no radius, no drop shadow.

	Every mock must run off the bottom edge, otherwise one short panel ends
	inside its frame and the row stops reading as a set. Frames are sized under
	the shortest mock, and each mock carries enough content to overflow.
-->
<Frame clip class="group {tall ? 'h-[clamp(320px,32vw,420px)]' : 'h-[clamp(230px,23vw,290px)]'}">
	<!--
		`h-full` + `min-h-full` on the mock is what guarantees the bleed: the mock
		is forced to at least the frame's height and then sits 13% down it, so it
		always runs off the bottom no matter how little content it carries. Short
		mocks keep their content top-aligned and simply extend their own surface.
	-->
	<div
		class="absolute top-[13%] left-[8%] h-full w-[104%] origin-center rotate-[-6deg] transition-[rotate] duration-300 ease-in-out group-hover:rotate-[-3deg] motion-reduce:transition-none [&>*]:min-h-full"
	>
		{@render children()}
	</div>
</Frame>
