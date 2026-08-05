<script lang="ts">
	import { takaExact } from '../money';

	/* The arithmetic holds: 1.9% of ৳3,640 is ৳69.16, leaving ৳3,570.84. A mock
	   that does not add up is the one thing a merchant will check. */
	const lines = [
		{ label: 'bKash', value: takaExact(3640), highlight: true },
		{ label: 'Platform fee 1.9%', value: `− ${takaExact(69.16)}`, highlight: false },
		{ label: 'Per-order fee', value: takaExact(0), highlight: false }
	];
</script>

<div class="rounded-mk-nested border border-mk-dark-2 bg-mk-dark p-[18px] text-mk-cream">
	<div class="flex justify-between">
		<span class="mk-mono text-mk-faint">Receipt</span>
		<span class="mk-mono text-mk-faint">#91442</span>
	</div>

	<p class="mt-3 mb-4 mk-num text-[32px] tracking-[-0.03em]">{takaExact(3640)}</p>

	<ul>
		{#each lines as line (line.label)}
			<li
				class="flex justify-between border-b border-dashed border-mk-cream/15 py-2.5 text-[13px] {line.highlight
					? 'relative pl-3 text-mk-cream before:absolute before:top-3 before:bottom-3 before:left-0 before:w-[3px] before:bg-mk-brand before:content-[""]'
					: 'text-mk-cream/60'}"
			>
				<span>{line.label}</span>
				<span class="mk-num">{line.value}</span>
			</li>
		{/each}
	</ul>

	<div class="mt-3.5 flex items-center justify-between pt-3.5 text-[13px] text-mk-brand-lift">
		<span>Payout &middot; tomorrow</span>
		<span class="mk-num">{takaExact(3570.84)}</span>
	</div>
</div>
