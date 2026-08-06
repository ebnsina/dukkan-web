<script lang="ts" generics="Row">
	/* One shape for every list in the admin, so a shop owner learns it once.
	 *
	 * Header:  what this is on the left, the things that narrow it on the right.
	 * Body:    the rows, with whatever can be done to a row at the end of it.
	 * Footer:  how many to show on the left, where you are and how to move on
	 *          the right.
	 *
	 * Paging is done here rather than by each page asking the API for a slice.
	 * Every admin list is a few hundred rows at most, they are already loaded,
	 * and a shop owner clicking "next" should not wait for a round trip. When a
	 * list outgrows that, the server takes over and this keeps its shape.
	 */
	import type { Snippet } from 'svelte';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { ArrowLeft01Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons';
	import { Empty, Frame } from '$lib/ui';
	import { formatNumber } from '$lib/utils/format';

	interface Props {
		/** Only for a page carrying more than one table, where the h1 cannot say
		    which is which. A single-table page names itself and passes nothing. */
		title?: string;
		rows: Row[];
		/** The `<th>` cells, so every table's header reads the same way. */
		head: Snippet;
		/** One `<tr>` per row. Put actions in the last cell. */
		row: Snippet<[Row, number]>;
		/** Shown instead of the table when there is nothing at all. */
		emptyTitle?: string;
		emptyBody?: string;
		emptyAction?: Snippet;
		/** Names the rows for a screen reader. Not printed — "1–5 of 5" is
		    already under a table whose columns say what it holds. */
		noun?: string;
		nounPlural?: string;
		/** Off for a short fixed list — a five-row table needs no paging. */
		paged?: boolean;
		perPage?: number;
	}

	let {
		title,
		rows,
		head,
		row,
		emptyTitle = 'Nothing here yet',
		emptyBody = 'When there is something to show, it appears here.',
		emptyAction,
		noun = 'row',
		nounPlural,
		paged = true,
		perPage = $bindable(25)
	}: Props = $props();

	const plural = $derived(nounPlural ?? `${noun}s`);

	let page = $state(1);
	const pageCount = $derived(paged ? Math.max(1, Math.ceil(rows.length / perPage)) : 1);

	// Filtering down to fewer pages must not strand the reader on page 9 of 3.
	$effect(() => {
		if (page > pageCount) page = pageCount;
	});

	const from = $derived(rows.length === 0 ? 0 : (page - 1) * perPage + 1);
	const to = $derived(paged ? Math.min(page * perPage, rows.length) : rows.length);
	const shown = $derived(paged ? rows.slice((page - 1) * perPage, page * perPage) : rows);

	const SIZES = [10, 25, 50, 100];
</script>

<Frame {title} variant="flush">
	{#if rows.length === 0}
		<div class="hollow">
			<Empty title={emptyTitle} description={emptyBody} actions={emptyAction} />
		</div>
	{:else}
		<div class="dk-scroll">
			<table class="dk-table">
				<thead>
					<tr>{@render head()}</tr>
				</thead>
				<tbody>
					{#each shown as item, index (index)}
						{@render row(item, index)}
					{/each}
				</tbody>
			</table>
		</div>
	{/if}

	{#snippet footer()}
		{#if rows.length > 0}
			<div class="bar">
				<label class="size">
					<span>Show</span>
					<select class="dk-select" bind:value={perPage} aria-label="How many {plural} to show">
						{#each SIZES as size (size)}
							<option value={size}>{size}</option>
						{/each}
					</select>
				</label>

				<div class="where">
					<span aria-live="polite">
						{formatNumber(from)}–{formatNumber(to)} of {formatNumber(rows.length)}
					</span>
					{#if pageCount > 1}
						<div class="steps">
							<button
								type="button"
								class="step"
								disabled={page <= 1}
								onclick={() => (page = Math.max(1, page - 1))}
								aria-label="Previous page"
							>
								<HugeiconsIcon icon={ArrowLeft01Icon} size={15} strokeWidth={1.8} />
							</button>
							<button
								type="button"
								class="step"
								disabled={page >= pageCount}
								onclick={() => (page = Math.min(pageCount, page + 1))}
								aria-label="Next page"
							>
								<HugeiconsIcon icon={ArrowRight01Icon} size={15} strokeWidth={1.8} />
							</button>
						</div>
					{/if}
				</div>
			</div>
		{/if}
	{/snippet}
</Frame>

<style>
	.hollow {
		padding: 8px;
	}

	.bar {
		display: flex;
		flex: 1;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
	}

	/* Frame's footer is one row; these two sit at its ends. */
	.size {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.size .dk-select {
		width: auto;
		height: 28px;
		padding-block: 0;
		font-size: 12.5px;
	}

	.where {
		display: flex;
		align-items: center;
		gap: 12px;
		font-variant-numeric: tabular-nums;
	}

	.steps {
		display: flex;
		gap: 4px;
	}

	.step {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		border: 1px solid var(--d-edge);
		border-radius: 6px;
		background: var(--d-sheet);
		color: var(--d-ink);
		cursor: pointer;
	}

	.step:hover:not(:disabled) {
		background: var(--d-hover);
	}

	.step:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}
</style>
