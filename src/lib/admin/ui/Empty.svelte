<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		description?: string;
		actions?: Snippet;
	}

	let { title, description, actions }: Props = $props();
</script>

<div class="dk-empty">
	<p class="dk-empty-title">{title}</p>
	{#if description}<p class="dk-empty-desc">{description}</p>{/if}
	{#if actions}<div class="dk-acts dk-empty-acts">{@render actions()}</div>{/if}
</div>
