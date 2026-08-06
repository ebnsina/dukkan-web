<script lang="ts">
	/* Everything you can do to a row, behind one button.
	 *
	 * Two or three buttons per row made a wall of chrome down the right of every
	 * table — loud, and it grew every time a row gained an action. One quiet
	 * mark opens a list where each action is a line with a glyph, which reads
	 * faster and stays the same width however many there are.
	 *
	 * An action that posts goes through `formId`: the row renders the form, the
	 * menu item names it, and `Menu` calls `requestSubmit()` — so these stay
	 * ordinary progressively-enhanced forms rather than fetch calls.
	 */
	import { MoreHorizontalIcon } from '@hugeicons/core-free-icons';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { Menu, type MenuItem } from '$lib/ui';

	interface Props {
		items: MenuItem[];
		/** Names the menu for a screen reader, e.g. the row's own name. */
		label: string;
	}

	let { items, label }: Props = $props();
</script>

<Menu {items} align="end" label="What you can do with {label}">
	{#snippet trigger({ open })}
		<span class="dots" class:is-open={open} aria-hidden="true">
			<HugeiconsIcon icon={MoreHorizontalIcon} size={17} strokeWidth={2} />
		</span>
	{/snippet}
</Menu>

<style>
	.dots {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 30px;
		height: 30px;
		border-radius: 8px;
		color: var(--d-faint);
	}

	:global(button:hover) > .dots,
	.is-open {
		background: var(--d-hover);
		color: var(--d-ink);
	}
</style>
