<script lang="ts">
	/* One modal for everything that interrupts.
	 *
	 * A native <dialog> brings the focus trap, the backdrop and Escape with it,
	 * and renders in the top layer — outside every surface wrapper — so it reads
	 * the ramp from :root rather than a rebound name. */
	import type { Snippet } from 'svelte';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { Cancel01Icon } from '@hugeicons/core-free-icons';
	import { cn } from '$lib/utils/cn';
	import { lockScroll } from './scroll-lock';

	interface Props {
		open: boolean;
		title: string;
		/** One line under the title. */
		description?: string;
		size?: 'sm' | 'md' | 'lg';
		/** A decision that must be answered drops the close control — Escape
		 * still works, because a modal with no way out is a trap. */
		dismissible?: boolean;
		/** The buttons, right-aligned under the body. */
		footer?: Snippet;
		class?: string;
		children?: Snippet;
	}

	let {
		open = $bindable(),
		title,
		description,
		size = 'md',
		dismissible = true,
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

	// The backdrop covers the page but does not stop it scrolling behind.
	$effect(() => {
		if (!open) return;
		return lockScroll();
	});

	/* A click on the backdrop is a click outside, and that closes — the way
	   every other modal on the web behaves. The backdrop is the dialog's own
	   box, so the test is whether the point landed outside the panel rather
	   than what the event target was; a <select> dropped open over the panel
	   reports the dialog as its target and would otherwise dismiss it. */
	function onpointerdown(event: PointerEvent) {
		if (!dismissible || !node) return;
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
	class={cn('dialog', `is-${size}`, className)}
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
		{#if dismissible}
			<button type="button" class="close" aria-label="Close" onclick={() => (open = false)}>
				<HugeiconsIcon icon={Cancel01Icon} size={16} strokeWidth={1.8} />
			</button>
		{/if}
	</div>

	{#if children}<div class="body">{@render children()}</div>{/if}
	{#if footer}<div class="acts">{@render footer()}</div>{/if}
</dialog>

<style>
	.dialog {
		margin: auto;
		max-height: calc(100dvh - 48px);
		padding: 22px;
		border: 1px solid var(--rule-strong);
		border-radius: var(--r-card);
		background: var(--paper);
		color: var(--ink);
		font-size: 14px;
		line-height: 1.55;
		animation: dialog-in var(--dur-enter) var(--ease-out);
	}

	/* A modal is not summoned by any one control, so it grows from its own
	   centre — and from 0.96 rather than from nothing, because nothing in the
	   real world appears out of zero size. */
	@keyframes dialog-in {
		from {
			transform: scale(0.96);
			opacity: 0;
		}
	}

	.dialog::backdrop {
		animation: backdrop-in var(--dur-enter) var(--ease-out);
	}

	@keyframes backdrop-in {
		from {
			opacity: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.dialog,
		.dialog::backdrop {
			animation: none;
		}
	}

	.is-sm {
		width: min(380px, calc(100vw - 32px));
	}
	.is-md {
		width: min(480px, calc(100vw - 32px));
	}
	.is-lg {
		width: min(720px, calc(100vw - 32px));
	}

	.dialog::backdrop {
		background: rgba(12, 13, 16, 0.55);
	}

	.head {
		display: flex;
		align-items: flex-start;
		gap: 12px;
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
		margin-top: 18px;
	}

	.acts {
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-end;
		gap: 10px;
		margin-top: 22px;
	}
</style>
