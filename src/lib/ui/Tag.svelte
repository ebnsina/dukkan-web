<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';

	interface Props {
		variant?: 'outline' | 'solid' | 'bare';
		class?: string;
		children: Snippet;
	}

	let { variant = 'outline', class: className, children }: Props = $props();
</script>

<span class={cn('tag t-button', variant, className)}>{@render children()}</span>

<style>
	.tag {
		display: inline-flex;
		align-items: center;
		height: 24px;
		padding-inline: 9px;
	}

	.outline {
		border: 1px solid var(--rule-strong);
		color: var(--muted);
	}

	.solid {
		background: var(--inverse-paper);
		color: var(--inverse-ink);
	}

	.bare {
		padding-inline: 0;
		color: var(--faint);
	}
</style>
