<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		eyebrow?: string;
		title: string;
		standfirst?: string;
		actions?: Snippet;
	}

	let { eyebrow, title, standfirst, actions }: Props = $props();
</script>

<header class="page-header">
	<div class="container-page">
		{#if eyebrow}<span class="eyebrow t-label">{eyebrow}</span>{/if}
		<h1 class="t-title">{title}</h1>
		{#if standfirst}<p class="standfirst t-lead">{standfirst}</p>{/if}
		{#if actions}<div class="actions">{@render actions()}</div>{/if}
	</div>
</header>

<style>
	.page-header {
		padding-block: clamp(56px, 8vw, 96px) clamp(40px, 5vw, 64px);
	}

	.eyebrow {
		display: block;
		margin-bottom: 20px;
		color: var(--faint);
	}

	.standfirst {
		margin-top: 24px;
		color: var(--muted);
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		margin-top: 36px;
	}
</style>
