<script lang="ts">
	// The list runs past the frame on purpose — a stock table always has more.
	const rows = [
		{ sku: 'JH-SAR-TEAL', pct: 72, stock: 144, low: false },
		{ sku: 'JH-SCF-MUSL', pct: 46, stock: 92, low: false },
		{ sku: 'JH-KUR-GOLD', pct: 8, stock: 6, low: true },
		{ sku: 'JH-DUP-IVRY', pct: 88, stock: 210, low: false },
		{ sku: 'JH-THR-CLAY', pct: 61, stock: 118, low: false },
		{ sku: 'JH-NAP-LINN', pct: 34, stock: 47, low: false },
		{ sku: 'JH-RUG-JUTE', pct: 12, stock: 9, low: true },
		{ sku: 'JH-CSH-SAGE', pct: 79, stock: 186, low: false }
	];
</script>

<div class="rounded-mk-nested border border-mk-rule-soft bg-mk-shell p-3.5">
	<div
		class="grid grid-cols-[1fr_70px_44px_42px] items-center gap-2.5 border-b border-mk-rule-soft py-2.5 font-mk-mono text-[11px] tracking-[0.14em] text-mk-muted uppercase"
	>
		<span>SKU</span>
		<span></span>
		<span class="text-right">Stock</span>
		<!-- Every row reserves the flag column, so the header and all rows share one
			 template — an `auto` track here made each row measure its own columns. -->
		<span></span>
	</div>

	{#each rows as row (row.sku)}
		<div
			class="grid grid-cols-[1fr_70px_44px_42px] items-center gap-2.5 border-b border-mk-rule-soft py-2.5 font-mk-mono text-[12px]"
		>
			<span>{row.sku}</span>
			<div class="h-1.5 bg-mk-rule-soft">
				<i class="block h-full {row.low ? 'bg-mk-alert' : 'bg-mk-brand'}" style="width:{row.pct}%"
				></i>
			</div>
			<span class="text-right mk-num">{row.stock}</span>
			{#if row.low}
				<em
					class="bg-mk-alert px-1.5 py-0.5 text-[9px] tracking-[0.12em] text-white uppercase not-italic"
					>Low</em
				>
			{:else}
				<em></em>
			{/if}
		</div>
	{/each}
</div>
