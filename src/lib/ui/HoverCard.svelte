<script lang="ts">
	/* A preview that opens on hover: who a customer is, what a product looks
	   like, without leaving the list to find out.
	 *
	 * Unlike a Tooltip it holds real content, so the pointer can travel into
	 * it — hence the closing delay, and hence nothing in here may be the only
	 * way to reach something. A hover is not available on a phone. */
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import { track, type Align, type Side } from './position';

	interface Props {
		side?: Side;
		align?: Align;
		/** Long enough that crossing the trigger on the way somewhere else
		 * does not open it. */
		openDelay?: number;
		closeDelay?: number;
		class?: string;
		trigger: Snippet;
		children: Snippet;
	}

	let {
		side = 'bottom',
		align = 'start',
		openDelay = 300,
		closeDelay = 180,
		class: className,
		trigger,
		children
	}: Props = $props();

	const id = $props.id();
	let open = $state(false);
	let anchor = $state<HTMLElement | null>(null);
	let card = $state<HTMLElement | null>(null);
	let timer: ReturnType<typeof setTimeout>;

	function show(delay: number) {
		clearTimeout(timer);
		timer = setTimeout(() => (open = true), delay);
	}

	function hide() {
		clearTimeout(timer);
		timer = setTimeout(() => (open = false), closeDelay);
	}

	$effect(() => {
		if (!open || !anchor || !card) return;
		return track(anchor, card, { side, align, gap: 8 });
	});

	$effect(() => () => clearTimeout(timer));
</script>

<!-- The group owns both the trigger and the card, so the pointer moving from
     one to the other never counts as leaving. -->
<span
	class={cn('hc-root', className)}
	onpointerenter={() => show(openDelay)}
	onpointerleave={hide}
	onfocusin={() => show(0)}
	onfocusout={hide}
	onkeydown={(event) => {
		if (event.key === 'Escape') {
			clearTimeout(timer);
			open = false;
		}
	}}
	role="presentation"
>
	<span bind:this={anchor} class="hc-anchor" aria-describedby={open ? `${id}-card` : undefined}>
		{@render trigger()}
	</span>

	{#if open}
		<div bind:this={card} id="{id}-card" class="hc-card">
			{@render children()}
		</div>
	{/if}
</span>

<style>
	.hc-root {
		display: inline-flex;
	}

	.hc-anchor {
		display: inline-flex;
	}

	.hc-card {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 250;
		width: max-content;
		max-width: min(320px, calc(100vw - 24px));
		padding: 14px;
		border: 1px solid var(--rule-strong);
		border-radius: var(--r-nested);
		background: var(--paper);
		color: var(--ink);
		font-size: 13.5px;
		line-height: 1.55;
		animation: hc-in var(--dur-enter) var(--ease-out);
	}

	/* From 0.97 and 4px out of the trigger — the origin is set by
	   `position.ts`, so it grows from the side it opened on. */
	@keyframes hc-in {
		from {
			transform: scale(0.97) translateY(4px);
			opacity: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.hc-card {
			animation: none;
		}
	}
</style>
