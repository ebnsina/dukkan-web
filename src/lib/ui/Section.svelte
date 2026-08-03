<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import { reveal } from '$lib/motion/reveal';

	interface Props {
		id?: string;
		label?: string;
		rule?: boolean;
		surface?: boolean;
		class?: string;
		children: Snippet;
	}

	let { id, label, rule = false, surface = false, class: className, children }: Props = $props();
</script>

<section
	{id}
	class={cn('section', surface && 'on-surface', className)}
	class:has-rule={rule}
	{@attach reveal()}
>
	<div class="container-page">
		<div class="rail-grid">
			<div class="rail">
				{#if label}<span class="rail-label t-label">{label}</span>{/if}
			</div>
			<div class="content">
				{@render children()}
			</div>
		</div>
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

	.rail {
		padding-top: 5px;
	}

	.rail-label {
		display: block;
		color: var(--faint);
		opacity: 0;
		transition: opacity var(--dur-hover) var(--ease-out);
	}

	.section:hover .rail-label,
	.section:focus-within .rail-label {
		opacity: 1;
	}

	/* Touch has no hover, so the labels simply stay. */
	@media (hover: none) {
		.rail-label {
			opacity: 1;
		}
	}

	@media (max-width: 899px) {
		.rail-label {
			opacity: 1;
		}
	}
</style>
