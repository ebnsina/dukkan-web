<script lang="ts">
	/* The wizard's forward action. Three steps had this markup and its class
	   string written out in full, which is three places to change a colour. */
	import type { Snippet } from 'svelte';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { ArrowRight02Icon } from '@hugeicons/core-free-icons';

	interface Props {
		type?: 'button' | 'submit';
		disabled?: boolean;
		full?: boolean;
		onclick?: () => void;
		children: Snippet;
	}

	let { type = 'button', disabled = false, full = false, onclick, children }: Props = $props();
</script>

<button
	{type}
	{disabled}
	{onclick}
	class="group flex cursor-pointer items-center gap-2 rounded-mk-control border border-mk-brand bg-mk-brand px-6 py-[15px] font-mk-mono text-[12px] font-medium tracking-[0.12em] text-mk-on-brand uppercase transition-colors duration-200 hover:border-mk-brand-deep hover:bg-mk-brand-deep disabled:cursor-not-allowed disabled:border-mk-shell-deep disabled:bg-mk-shell-deep disabled:text-mk-faint {full
		? 'w-full justify-center'
		: ''}"
>
	{@render children()}
	<span class="transition-transform duration-200 group-hover:translate-x-1">
		<HugeiconsIcon icon={ArrowRight02Icon} size={16} strokeWidth={2} />
	</span>
</button>
