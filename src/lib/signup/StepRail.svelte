<script lang="ts">
	/* The rail names every step, so nobody is guessing how long this is. */
	let { steps, current }: { steps: string[]; current: number } = $props();
</script>

<ol class="mt-8 flex flex-wrap gap-x-6 gap-y-2">
	{#each steps as label, index (label)}
		<li class="flex items-center gap-2">
			<!-- A number in a box is a mark, not a control: the smallest step on
			     the radius scale, because anything larger on 20px is a pill. -->
			<span
				class="grid h-5 w-5 place-items-center rounded-mk-mark font-mk-mono text-[10px] {index <=
				current
					? 'bg-mk-brand text-mk-on-brand'
					: 'bg-mk-shell-deep text-mk-faint'}">{index + 1}</span
			>
			<span
				class="font-mk-mono text-[11px] tracking-[0.14em] uppercase {index === current
					? 'text-mk-ink'
					: 'text-mk-faint'}">{label}</span
			>
		</li>
	{/each}
</ol>
