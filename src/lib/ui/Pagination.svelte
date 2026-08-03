<script lang="ts">
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { ArrowLeft02Icon, ArrowRight02Icon } from '@hugeicons/core-free-icons';
	import { formatNumber } from '$lib/utils/format';

	interface Props {
		page?: number;
		pageCount: number;
		onchange?: (page: number) => void;
	}

	let { page = $bindable(1), pageCount, onchange }: Props = $props();

	let pages = $derived.by(() => {
		const result: Array<number | 'gap'> = [1];
		const from = Math.max(2, page - 1);
		const to = Math.min(pageCount - 1, page + 1);
		if (from > 2) result.push('gap');
		for (let i = from; i <= to; i++) result.push(i);
		if (to < pageCount - 1) result.push('gap');
		if (pageCount > 1) result.push(pageCount);
		return result;
	});

	function go(next: number) {
		const clamped = Math.min(Math.max(next, 1), pageCount);
		if (clamped === page) return;
		page = clamped;
		onchange?.(clamped);
	}
</script>

<nav aria-label="Pagination" class="pager">
	<button
		type="button"
		class="step"
		onclick={() => go(page - 1)}
		disabled={page <= 1}
		aria-label="Previous page"
	>
		<HugeiconsIcon icon={ArrowLeft02Icon} size={14} strokeWidth={1.6} />
	</button>

	{#each pages as item, index (index)}
		{#if item === 'gap'}
			<span class="gap" aria-hidden="true">&middot;&middot;&middot;</span>
		{:else}
			<button
				type="button"
				class="num t-mono"
				class:is-current={item === page}
				aria-current={item === page ? 'page' : undefined}
				onclick={() => go(item)}
			>
				{formatNumber(item)}
			</button>
		{/if}
	{/each}

	<button
		type="button"
		class="step"
		onclick={() => go(page + 1)}
		disabled={page >= pageCount}
		aria-label="Next page"
	>
		<HugeiconsIcon icon={ArrowRight02Icon} size={14} strokeWidth={1.6} />
	</button>
</nav>

<style>
	.pager {
		display: flex;
		align-items: center;
		gap: 4px;
	}

	button {
		min-width: 32px;
		height: 32px;
		display: grid;
		place-items: center;
		padding-inline: 8px;
		background: none;
		border: none;
		color: var(--faint);
		cursor: pointer;
		transition: color var(--dur-hover) var(--ease-out);
	}

	button:hover:not(:disabled) {
		color: var(--ink);
	}

	button:disabled {
		opacity: 0.3;
		cursor: not-allowed;
	}

	.num {
		font-size: 12px;
	}

	.is-current {
		color: var(--ink);
		font-weight: 600;
		border-bottom: 1px solid var(--ink);
	}

	.gap {
		color: var(--faint);
		font-size: 11px;
		padding-inline: 4px;
	}
</style>
