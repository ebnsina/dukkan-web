<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';

	interface Props {
		id?: string;
		eyebrow?: string;
		heading?: string;
		lead?: string;
		rule?: boolean;
		surface?: boolean;
		class?: string;
		children: Snippet;
	}

	let {
		id,
		eyebrow,
		heading,
		lead,
		rule = false,
		surface = false,
		class: className,
		children
	}: Props = $props();
</script>

<section {id} class={cn('section', surface && 'on-surface', className)} class:has-rule={rule}>
	<div class="container-page">
		{#if eyebrow || heading || lead}
			<div class="head">
				{#if eyebrow}<span class="eyebrow t-label">{eyebrow}</span>{/if}
				{#if heading}<h2 class="t-heading">{heading}</h2>{/if}
				{#if lead}<p class="lead t-lead">{lead}</p>{/if}
			</div>
		{/if}
		{@render children()}
	</div>
</section>

<style>
	.section {
		padding-block: var(--section-y);
		scroll-margin-top: 80px;
	}

	/* A boundary is marked once: a hairline, or a surface change, never both. */
	.has-rule:not(.on-surface) {
		border-top: 1px solid var(--rule);
	}

	.on-surface {
		background-color: var(--surface);
	}

	.head {
		margin-bottom: 56px;
	}

	.eyebrow {
		display: block;
		margin-bottom: 20px;
		color: var(--faint);
	}

	.lead {
		margin-top: 24px;
		color: var(--muted);
	}
</style>
