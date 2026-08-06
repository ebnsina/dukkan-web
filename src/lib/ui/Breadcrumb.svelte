<script lang="ts">
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { ArrowRight01Icon } from '@hugeicons/core-free-icons';

	export interface Crumb {
		label: string;
		href?: string;
	}

	interface Props {
		items: Crumb[];
		/** How many crumbs may show before the middle collapses to an ellipsis. */
		max?: number;
	}

	let { items, max = 4 }: Props = $props();

	/* A long trail collapses in the middle rather than wrapping or truncating.
	 *
	 * The first crumb is where everything starts and the last two are where you
	 * are and what you came from — those are the ones anybody uses. What falls
	 * out is the stretch in between, and it is replaced by an ellipsis rather
	 * than silently dropped, so the trail never lies about its own depth. */
	const shown = $derived.by(() => {
		if (items.length <= max) return items.map((item) => ({ item, gap: false }));
		return [
			{ item: items[0], gap: false },
			{ item: items[items.length - 2], gap: true },
			{ item: items[items.length - 1], gap: false }
		];
	});
</script>

<nav aria-label="Breadcrumb">
	<ol>
		{#each shown as entry, index (entry.item.label)}
			<li>
				{#if index > 0}
					<span class="sep" aria-hidden="true">
						<HugeiconsIcon icon={ArrowRight01Icon} size={14} strokeWidth={2} />
					</span>
				{/if}

				{#if entry.gap}
					<!-- Says the trail is deeper than it looks; not a control, because
					     there is nothing useful to expand to on a page this shallow. -->
					<span class="gap" aria-hidden="true">…</span>
					<span class="sep" aria-hidden="true">
						<HugeiconsIcon icon={ArrowRight01Icon} size={14} strokeWidth={2} />
					</span>
				{/if}

				{#if entry.item.href && index < shown.length - 1}
					<a href={entry.item.href}>{entry.item.label}</a>
				{:else}
					<span aria-current="page" class="current">{entry.item.label}</span>
				{/if}
			</li>
		{/each}
	</ol>
</nav>

<style>
	ol {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		font-size: 13px;
	}

	li {
		display: flex;
		align-items: center;
	}

	.sep,
	.gap {
		display: inline-flex;
		align-items: center;
		color: var(--faint);
		padding-inline: 6px;
	}

	a {
		color: var(--faint);
		text-decoration: none;
		transition: color var(--dur-hover) var(--ease-out);
	}

	a:hover {
		color: var(--ink);
	}

	/* Where you are, in the reading face and darker than the way back. */
	.current {
		color: var(--ink);
		font-weight: 550;
	}
</style>
