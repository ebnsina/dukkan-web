<script lang="ts">
	/* Everything you can do to the thing you are looking at, behind one button.
	 *
	 * Laid out in a row, the actions took the top-right of every detail page and
	 * shouted equally loudly whatever they did — "View in the shop" beside "Take
	 * the shop down". In a list each one gets a line saying what it does, which
	 * is where that warning belongs.
	 */
	import { ArrowDown01Icon } from '@hugeicons/core-free-icons';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { Button, Menu, type MenuItem } from '$lib/ui';

	interface Props {
		items: MenuItem[];
		/** What the actions act on, for a screen reader. */
		label: string;
	}

	let { items, label }: Props = $props();
</script>

<Menu {items} align="end" label="What you can do with {label}">
	{#snippet trigger({ open })}
		<Button variant="quiet" tabindex={-1}>
			Actions
			<span class="chev" class:is-open={open} aria-hidden="true">
				<HugeiconsIcon icon={ArrowDown01Icon} size={15} strokeWidth={1.8} />
			</span>
		</Button>
	{/snippet}
</Menu>

<style>
	.chev {
		display: inline-flex;
		margin-left: 6px;
		transition: transform var(--d-quick);
	}

	.is-open {
		transform: rotate(180deg);
	}
</style>
