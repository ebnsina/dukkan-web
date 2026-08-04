<script lang="ts">
	/* Rows that open: an FAQ on the landing page, a long form broken into
	   stages in the admin. The content is closed, never absent — every panel is
	   in the DOM so the page is searchable and printable. */
	import type { Snippet } from 'svelte';
	import { slide } from 'svelte/transition';
	import { prefersReducedMotion } from 'svelte/motion';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { ArrowDown01Icon } from '@hugeicons/core-free-icons';
	import { cn } from '$lib/utils/cn';

	export interface AccordionItem {
		value: string;
		label: string;
		/** A line under the label, for a row whose title is not enough. */
		meta?: string;
	}

	interface Props {
		items: AccordionItem[];
		/** Only one row open at a time. */
		single?: boolean;
		/** The rows open on load. */
		open?: string[];
		/** Where these rows sit in the page's outline — a heading that skips a
		 * level breaks the document's structure for a screen reader. */
		headingLevel?: 2 | 3 | 4 | 5;
		/** `lg` is for a page where the rows are the content — an FAQ — rather
		 * than a section of a form. The face comes from the surface's own
		 * heading rule, so it is the display type on the marketing page. */
		size?: 'md' | 'lg';
		panel: Snippet<[string]>;
		class?: string;
	}

	let {
		items,
		single = false,
		open = $bindable([]),
		headingLevel = 3,
		size = 'md',
		panel,
		class: className
	}: Props = $props();

	const uid = $props.id();

	function toggle(value: string) {
		if (open.includes(value)) open = open.filter((v) => v !== value);
		else open = single ? [value] : [...open, value];
	}
</script>

<div class={cn('accordion', `is-${size}`, className)}>
	{#each items as item (item.value)}
		{@const isOpen = open.includes(item.value)}
		<div class="row">
			<svelte:element this={`h${headingLevel}`} class="rowhead">
				<button
					type="button"
					id="{uid}-{item.value}-trigger"
					class="trigger"
					aria-expanded={isOpen}
					aria-controls="{uid}-{item.value}-panel"
					onclick={() => toggle(item.value)}
				>
					<span class="text">
						<span class="label">{item.label}</span>
						{#if item.meta}<span class="meta">{item.meta}</span>{/if}
					</span>
					<span class="mark" class:is-open={isOpen} aria-hidden="true">
						<HugeiconsIcon icon={ArrowDown01Icon} size={16} strokeWidth={1.8} />
					</span>
				</button>
			</svelte:element>

			{#if isOpen}
				<div
					id="{uid}-{item.value}-panel"
					role="region"
					aria-labelledby="{uid}-{item.value}-trigger"
					class="panel"
					transition:slide={{ duration: prefersReducedMotion.current ? 0 : 180 }}
				>
					{@render panel(item.value)}
				</div>
			{/if}
		</div>
	{/each}
</div>

<style>
	/* The rows touch, so the rules between them are structure — keep them. */
	.row + .row {
		border-top: 1px solid var(--rule);
	}

	.rowhead {
		margin: 0;
	}

	.trigger {
		display: flex;
		align-items: center;
		gap: 16px;
		width: 100%;
		padding: 16px 2px;
		border: 0;
		background: none;
		color: var(--ink);
		text-align: left;
		cursor: pointer;
	}

	.text {
		flex: 1;
		min-width: 0;
	}

	.label {
		display: block;
		font-size: 14.5px;
		font-weight: 600;
	}

	/* The heading element is the parent, so the family and weight are whatever
	   that surface gives a heading — display type on the marketing page. */
	.is-lg .trigger {
		padding-block: 24px;
	}

	.is-lg .label {
		font: inherit;
		font-size: clamp(17px, 1.7vw, 21px);
	}

	.is-lg .panel {
		padding-bottom: 26px;
		font-size: 15px;
	}

	.meta {
		display: block;
		margin-top: 3px;
		font-size: 12.5px;
		color: var(--faint);
	}

	.mark {
		display: grid;
		place-items: center;
		flex: none;
		color: var(--faint);
		transition: transform var(--dur-hover) var(--ease-out);
	}

	.trigger:hover .mark {
		color: var(--ink);
	}

	.is-open {
		transform: rotate(180deg);
	}

	.panel {
		padding: 0 2px 18px;
		font-size: 14px;
		line-height: 1.65;
		color: var(--muted);
	}

	@media (prefers-reduced-motion: reduce) {
		.mark {
			transition: none;
		}
	}
</style>
