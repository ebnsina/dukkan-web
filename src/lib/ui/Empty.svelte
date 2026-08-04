<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		description?: string;
		actions?: Snippet;
	}

	let { title, description, actions }: Props = $props();
</script>

<!-- Space marks this block, not a dashed box. -->
<div class="empty">
	<p class="title">{title}</p>
	{#if description}<p class="desc">{description}</p>{/if}
	{#if actions}<div class="actions">{@render actions()}</div>{/if}
</div>

<style>
	.empty {
		display: flex;
		flex: 1;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 8px;
		padding: 48px 24px;
		text-align: center;
	}

	.title {
		margin: 0;
		font-size: 15px;
		font-weight: 650;
		color: var(--ink);
	}

	.desc {
		margin: 0;
		max-width: 44ch;
		font-size: 13.5px;
		line-height: 1.6;
		color: var(--muted);
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		margin-top: 8px;
	}
</style>
