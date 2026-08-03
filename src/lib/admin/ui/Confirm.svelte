<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		open: boolean;
		title: string;
		/** The buttons: whatever confirms, and whatever backs out. */
		actions: Snippet;
		children?: Snippet;
	}

	let { open = $bindable(), title, actions, children }: Props = $props();

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
	class="dk-dialog"
	bind:this={node}
	aria-labelledby="{id}-title"
	aria-describedby={children ? `${id}-body` : undefined}
	onclose={() => (open = false)}
>
	<h2 id="{id}-title">{title}</h2>
	{#if children}<p id="{id}-body">{@render children()}</p>{/if}
	<div class="dk-dialog-acts">{@render actions()}</div>
</dialog>
