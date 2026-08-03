<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		description?: string;
		actions?: Snippet;
	}

	let { title, description, actions }: Props = $props();
</script>

<div class="empty">
	<p class="t-sub">{title}</p>
	{#if description}<p class="desc">{description}</p>{/if}
	{#if actions}<div class="actions">{@render actions()}</div>{/if}
</div>

<style>
	/* Space marks this block, not a dashed box. */
	.empty {
		padding-block: 72px;
		border-top: 1px solid var(--rule);
		border-bottom: 1px solid var(--rule);
	}

	.desc {
		margin-top: 12px;
		font-size: var(--size-body);
		line-height: 1.6;
		color: var(--muted);
		max-width: 48ch;
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		margin-top: 28px;
	}
</style>
