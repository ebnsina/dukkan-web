<script lang="ts">
	/* The wizard's way back, identical on all three steps that offer one. */
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { ArrowLeft02Icon } from '@hugeicons/core-free-icons';

	let { onclick }: { onclick: () => void } = $props();
</script>

<button
	type="button"
	{onclick}
	class="flex cursor-pointer items-center gap-2 font-mk-mono text-[12px] tracking-[0.12em] text-mk-muted uppercase hover:text-mk-ink"
>
	<HugeiconsIcon icon={ArrowLeft02Icon} size={16} strokeWidth={2} /> Back
</button>
