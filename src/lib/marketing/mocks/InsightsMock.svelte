<script lang="ts">
	import { taka } from '../money';

	const bars = [34, 52, 41, 66, 58, 79, 71, 88, 62, 94, 83, 100];
	const kpis = [
		{ label: 'AOV', value: taka(1240) },
		{ label: 'Repeat', value: '38%' },
		{ label: 'Returns', value: '6.2%' }
	];
</script>

<div class="flex flex-col gap-3.5 rounded-2xl border border-mk-rule-soft bg-mk-shell p-3.5">
	<div class="flex h-33 items-end gap-[5px]">
		{#each bars as height, i (i)}
			<i
				class="block flex-1 {i === bars.length - 1 ? 'bg-mk-brand' : 'bg-mk-rule-soft'}"
				style="height:{height}%"
			></i>
		{/each}
	</div>

	<div class="flex flex-wrap gap-2">
		{#each kpis as kpi (kpi.label)}
			<span
				class="flex items-center gap-1.5 border border-mk-rule-soft px-2.5 py-[7px] font-mk-mono text-[10px] tracking-[0.1em] text-mk-muted uppercase"
			>
				{kpi.label}
				<b class="mk-num text-[12px] text-mk-ink">{kpi.value}</b>
			</span>
		{/each}
	</div>
</div>
