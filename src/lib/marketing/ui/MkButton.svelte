<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		href?: string;
		variant?: 'brand' | 'ghost';
		full?: boolean;
		arrow?: boolean;
		type?: 'button' | 'submit';
		children: Snippet;
	}

	let {
		href,
		variant = 'ghost',
		full = false,
		arrow = false,
		type = 'button',
		children
	}: Props = $props();

	// Sharp corners, flat fills. The hover swaps colour — never a shadow.
	const base =
		'group inline-flex items-center justify-center gap-2 border px-6 py-[15px] font-mk-mono text-[12px] font-medium tracking-[0.12em] uppercase cursor-pointer transition-colors duration-200';

	const variants = {
		brand:
			'border-mk-brand bg-mk-brand text-mk-on-brand hover:border-mk-brand-deep hover:bg-mk-brand-deep',
		ghost:
			'border-mk-ink/25 bg-transparent text-mk-ink hover:border-mk-ink hover:bg-mk-ink hover:text-mk-paper'
	} as const;

	let cls = $derived(`${base} ${variants[variant]} ${full ? 'w-full' : ''}`);
</script>

{#snippet inner()}
	{@render children()}
	{#if arrow}
		<span aria-hidden="true" class="transition-transform duration-200 group-hover:translate-x-1"
			>&rarr;</span
		>
	{/if}
{/snippet}

{#if href}
	<a {href} class={cls}>{@render inner()}</a>
{:else}
	<button {type} class={cls}>{@render inner()}</button>
{/if}
