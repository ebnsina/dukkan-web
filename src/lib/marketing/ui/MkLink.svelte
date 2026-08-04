<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		href: string;
		tone?: 'ink' | 'brand' | 'brand-bright';
		children: Snippet;
	}

	let { href, tone = 'ink', children }: Props = $props();

	const tones = {
		ink: 'text-mk-ink',
		brand: 'text-mk-brand-type',
		'brand-bright': 'text-mk-brand-lift'
	} as const;
</script>

<!-- Underline draws in left → right; the arrow nudges with it. -->
<a
	{href}
	class="group mk-underline inline-flex items-center gap-2 font-mk-mono text-[11px] tracking-[0.14em] whitespace-nowrap uppercase {tones[
		tone
	]}"
>
	{@render children()}
	<span aria-hidden="true" class="transition-transform duration-200 group-hover:translate-x-1"
		>&rarr;</span
	>
</a>
