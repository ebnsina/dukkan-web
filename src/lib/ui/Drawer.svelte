<script lang="ts">
	/* The side panel: navigation on a phone, a record beside the list on a desk.
	   A <dialog> again, so the focus trap and Escape are the browser's job. */
	import type { Snippet } from 'svelte';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { Cancel01Icon } from '@hugeicons/core-free-icons';
	import { cn } from '$lib/utils/cn';
	import { lockScroll } from './scroll-lock';

	interface Props {
		open: boolean;
		title: string;
		description?: string;
		side?: 'start' | 'end';
		/** `wide` is for a sheet holding a form: a form at 420px is a column of
		    cramped fields, and a shop owner filling one wants room. */
		size?: 'md' | 'wide';
		/** Sits on the floor of the panel, out of the scrolling body. */
		footer?: Snippet;
		class?: string;
		children: Snippet;
	}

	let {
		open = $bindable(),
		title,
		description,
		side = 'end',
		size = 'md',
		footer,
		class: className,
		children
	}: Props = $props();

	let node = $state<HTMLDialogElement>();
	const id = $props.id();

	$effect(() => {
		if (!node) return;
		if (open && !node.open) node.showModal();
		if (!open && node.open) node.close();
	});

	$effect(() => {
		if (!open) return;
		return lockScroll();
	});

	// A click on the backdrop closes it. The panel fills one edge of the
	// screen, so anything outside its box is the backdrop.
	function onpointerdown(event: PointerEvent) {
		if (!node) return;
		const box = node.getBoundingClientRect();
		const outside =
			event.clientX < box.left ||
			event.clientX > box.right ||
			event.clientY < box.top ||
			event.clientY > box.bottom;
		if (outside) open = false;
	}
</script>

<dialog
	bind:this={node}
	class={cn('drawer', `is-${side}`, `is-${size}`, className)}
	aria-labelledby="{id}-title"
	aria-describedby={description ? `${id}-desc` : undefined}
	{onpointerdown}
	onclose={() => (open = false)}
>
	<div class="head">
		<div class="heading">
			<h2 id="{id}-title">{title}</h2>
			{#if description}<p id="{id}-desc">{description}</p>{/if}
		</div>
		<button type="button" class="close" aria-label="Close" onclick={() => (open = false)}>
			<HugeiconsIcon icon={Cancel01Icon} size={16} strokeWidth={1.8} />
		</button>
	</div>

	<div class="body">{@render children()}</div>
	{#if footer}<div class="foot">{@render footer()}</div>{/if}
</dialog>

<style>
	/* Only the open state takes a display, or it would override the browser's
	   `dialog:not([open]) { display: none }` and sit in the page. */
	.drawer[open] {
		display: flex;
	}

	.drawer {
		flex-direction: column;
		width: min(420px, 100vw);
		max-width: 100vw;
		height: 100dvh;
		max-height: 100dvh;
		margin: 0;
		padding: 0;
		border: 0;
		background: var(--paper);
		color: var(--ink);
		font-size: 14px;
		line-height: 1.55;
	}

	/* A sheet holding a form. Sixty per cent of the window on anything wide
	   enough for that to be roomy, and never narrower than the standard drawer
	   on anything that is not. */
	.drawer.is-wide {
		width: min(max(420px, 60vw), 100vw);
	}

	/* A panel coming off an edge gets the drawer curve rather than the UI one:
	   it carries more distance, and the iOS shape is what stops that reading
	   as a slide rather than as a thing being pulled out. */
	.is-end {
		margin-left: auto;
		border-left: 1px solid var(--rule-strong);
		animation: in-end var(--dur-overlay) var(--ease-drawer);
	}

	.is-start {
		margin-right: auto;
		border-right: 1px solid var(--rule-strong);
		animation: in-start var(--dur-overlay) var(--ease-drawer);
	}

	.drawer::backdrop {
		background: rgba(12, 13, 16, 0.55);
		animation: backdrop-in var(--dur-overlay) var(--ease-out);
	}

	@keyframes backdrop-in {
		from {
			opacity: 0;
		}
	}

	@keyframes in-end {
		from {
			transform: translateX(100%);
		}
	}

	@keyframes in-start {
		from {
			transform: translateX(-100%);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.drawer,
		.drawer::backdrop {
			animation: none;
		}
	}

	.head {
		display: flex;
		align-items: flex-start;
		gap: 12px;
		padding: 18px 20px;
		border-bottom: 1px solid var(--rule);
	}

	.heading {
		flex: 1;
		min-width: 0;
	}

	h2 {
		margin: 0;
		font-size: 16px;
		font-weight: 650;
		letter-spacing: -0.02em;
	}

	p {
		margin: 6px 0 0;
		color: var(--muted);
	}

	.close {
		display: grid;
		place-items: center;
		width: 28px;
		height: 28px;
		border: 0;
		border-radius: var(--r-chip);
		background: none;
		color: var(--faint);
		cursor: pointer;
	}

	.close:hover {
		background: var(--surface);
		color: var(--ink);
	}

	.body {
		flex: 1;
		min-height: 0;
		overflow-y: auto;
		padding: 20px;
	}

	.foot {
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-end;
		gap: 10px;
		padding: 16px 20px;
		border-top: 1px solid var(--rule);
	}
</style>
