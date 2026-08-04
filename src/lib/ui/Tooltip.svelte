<script lang="ts">
	/* A short gloss on a control that has no room for one.
	 *
	 * It is never the only place something is said: a tooltip is unreachable on
	 * a touch screen, so anything a merchant must read belongs in a hint. */
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import { track, type Side } from './position';

	interface Props {
		text: string;
		side?: Side;
		class?: string;
		children: Snippet;
	}

	let { text, side = 'top', class: className, children }: Props = $props();

	const id = $props.id();
	let open = $state(false);
	let anchor = $state<HTMLElement | null>(null);
	let tip = $state<HTMLElement | null>(null);

	// Measured on show, so it turns over near the top of the window and stays
	// inside the edges near a corner.
	$effect(() => {
		if (!open || !anchor || !tip) return;
		return track(anchor, tip, { side, align: 'center', gap: 7 });
	});
</script>

<span
	class={cn('tip-root', className)}
	onmouseenter={() => (open = true)}
	onmouseleave={() => (open = false)}
	onfocusin={() => (open = true)}
	onfocusout={() => (open = false)}
	onkeydown={(event) => {
		if (event.key === 'Escape') open = false;
	}}
	role="presentation"
>
	<!-- The description is only pointed at while it exists; a dangling
	     `aria-describedby` is an error, not an empty one. -->
	<span
		bind:this={anchor}
		class="tip-anchor"
		aria-describedby={open ? `${id}-tip` : undefined}
	>
		{@render children()}
	</span>
	{#if open}
		<span bind:this={tip} id="{id}-tip" role="tooltip" class="tip">{text}</span>
	{/if}
</span>

<style>
	.tip-root {
		display: inline-flex;
	}

	.tip-anchor {
		display: inline-flex;
	}

	.tip {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 300;
		width: max-content;
		max-width: 240px;
		padding: 7px 10px;
		border-radius: var(--r-chip);
		background: var(--inverse-paper);
		color: var(--inverse-ink);
		font-size: 12px;
		line-height: 1.45;
		text-align: center;
		pointer-events: none;
		animation: appear var(--dur-hover) var(--ease-out);
	}

	@keyframes appear {
		from {
			opacity: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.tip {
			animation: none;
		}
	}
</style>
