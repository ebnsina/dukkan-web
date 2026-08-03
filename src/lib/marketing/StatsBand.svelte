<script lang="ts">
	import { countUp, reveal } from './motion';

	// Read as one sentence: figure, then what it is, then the next.
	const stats = [
		{ to: 1200, prefix: '৳', suffix: ' cr', label: 'processed last year' },
		{ to: 48000, suffix: '+', label: 'shops trading' },
		{ to: 64, label: 'districts delivered to' },
		{ to: 99.99, decimals: 2, suffix: '%', label: 'checkout uptime' }
	];
</script>

<!-- No cells, no rules: one typographic run where the figures carry it. -->
<section class="bg-mk-dark py-[clamp(80px,10vw,136px)] text-mk-cream">
	<div class="mk-wrap">
		<p class="flex flex-wrap items-baseline gap-x-6 gap-y-7">
			{#each stats as stat, i (stat.label)}
				<span use:reveal={i * 110} class="flex items-baseline gap-3">
					<span
						use:countUp={{
							to: stat.to,
							decimals: stat.decimals,
							prefix: stat.prefix,
							suffix: stat.suffix
						}}
						class="mk-num text-[clamp(38px,4.4vw,58px)] leading-[0.95] tracking-[-0.05em]"
					></span>
					<span class="text-[15px] text-mk-cream/55">{stat.label}</span>
					{#if i < stats.length - 1}
						<!-- Trailing, so a wrapped line never opens with a stray mark. -->
						<span aria-hidden="true" class="ml-1 text-[clamp(24px,2.4vw,36px)] text-mk-lime">/</span
						>
					{/if}
				</span>
			{/each}
		</p>

		<p
			use:reveal={200}
			class="mt-14 font-mk-mono text-[11px] tracking-[0.1em] text-mk-cream/30 uppercase"
		>
			SOC 2 Type II &middot; PCI-DSS Level 1 &middot; Licensed payment operations in every market we
			serve.
		</p>
	</div>
</section>
