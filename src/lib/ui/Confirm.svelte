<script lang="ts">
	/* A Dialog with the question already framed: a decision, and no way out of
	   it except through one of the two buttons. */
	import type { Snippet } from 'svelte';
	import Dialog from './Dialog.svelte';

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
</script>

<Dialog bind:open {title} {description} size="sm" dismissible={false} footer={footer ?? actions}>
	{#if children}{@render children()}{/if}
</Dialog>
