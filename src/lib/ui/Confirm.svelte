<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		open: boolean;
		title: string;
		/** One line under the title. */
		description?: string;
		/** The buttons: whatever confirms, and whatever backs out. */
		footer?: Snippet;
		actions?: Snippet;
		children?: Snippet;
	}

	let { open = $bindable(), title, description, footer, actions, children }: Props = $props();

	let node = $state<HTMLDialogElement>();
	const id = $props.id();

	// A modal <dialog> gives us the focus trap, the backdrop and Escape for free.
	$effect(() => {
		if (!node) return;
		if (open && !node.open) node.showModal();
		if (!open && node.open) node.close();
	});
</script>

<dialog
	class="dialog"
	bind:this={node}
	aria-labelledby="{id}-title"
	aria-describedby={children ? `${id}-body` : undefined}
	onclose={() => (open = false)}
>
	<h2 id="{id}-title">{title}</h2>
	{#if description}<p id="{id}-body">{description}</p>{/if}
	{#if children}<div class="dialog-body">{@render children()}</div>{/if}
	<div class="dialog-acts">{@render (footer ?? actions)?.()}</div>
</dialog>

<style>
	/* A modal <dialog> renders in the top layer, outside any surface wrapper,
	   so it reads the ramp from :root rather than a rebound name. */
	.dialog {
		width: min(420px, calc(100vw - 32px));
		padding: 22px;
		border: 0;
		border-radius: var(--r-card);
		background: var(--n-0);
		color: var(--n-950);
		font-size: 14px;
		line-height: 1.55;
	}

	:global([data-theme='dark']) .dialog {
		background: var(--nd-900);
		color: var(--nd-50);
	}

	.dialog::backdrop {
		background: rgba(16, 17, 19, 0.55);
	}

	.dialog h2 {
		margin: 0 0 8px;
		font-size: 16px;
		font-weight: 650;
		letter-spacing: -0.02em;
	}

	.dialog p {
		margin: 0 0 20px;
		color: var(--n-600);
	}

	:global([data-theme='dark']) .dialog p {
		color: var(--nd-200);
	}

	.dialog-body {
		margin-bottom: 20px;
	}

	.dialog-acts {
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-end;
		gap: 10px;
	}
</style>
