<script lang="ts">
	import ArtSlot from '../ui/ArtSlot.svelte';
	const sections = ['Hero banner', 'Featured edit', 'Collection grid', 'Size guide', 'Reviews'];
</script>

<!-- Section list + live canvas, built from boxes rather than a screenshot. -->
<div
	class="grid grid-cols-1 gap-4 border border-mk-rule-soft bg-mk-paper p-3.5 sm:grid-cols-[160px_1fr]"
>
	<div
		class="flex flex-col gap-1 border-b border-mk-rule-soft pb-3 sm:border-r sm:border-b-0 sm:pr-3.5 sm:pb-0"
	>
		<p class="mb-1 mk-mono text-mk-faint">Sections</p>
		{#each sections as section, i (section)}
			<!-- The selected row is filled, the way a real sidebar marks itself. -->
			<span
				class="flex items-center gap-2 px-2.5 py-2 text-[12px] {i === 0
					? 'bg-mk-dark font-medium text-mk-cream'
					: 'text-mk-muted'}"
			>
				<span
					aria-hidden="true"
					class="grid size-3 flex-none grid-rows-3 gap-[2px] {i === 0
						? 'opacity-70'
						: 'opacity-35'}"
				>
					<i class="block bg-current"></i>
					<i class="block bg-current"></i>
					<i class="block bg-current"></i>
				</span>
				{section}
			</span>
		{/each}
		<span
			class="mt-1 border border-dashed border-mk-rule-soft px-2.5 py-2 text-center font-mk-mono text-[10px] tracking-[0.1em] text-mk-faint uppercase"
			>+ Add section</span
		>
	</div>

	<div class="flex flex-col gap-2">
		<ArtSlot
			seed={1}
			tone="var(--color-mk-brand)"
			base="var(--color-mk-paper)"
			class="aspect-2/1"
		/>
		<div class="flex gap-2">
			<span class="h-2.5 flex-[0.4] bg-mk-brand"></span>
			<span class="h-2.5 flex-1 bg-mk-rule-soft"></span>
			<span class="h-2.5 flex-1 bg-mk-rule-soft"></span>
		</div>
		<div class="grid grid-cols-3 gap-2">
			{#each { length: 6 }, i (i)}
				<i class="block aspect-4/3 bg-mk-rule-soft"></i>
			{/each}
		</div>
	</div>
</div>
