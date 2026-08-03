<script lang="ts">
	import MkPulse from './ui/MkPulse.svelte';

	const columns = [
		{
			title: 'Product',
			links: [
				['Storefront Studio', '#product'],
				['Payments', '#product'],
				['Inventory', '#product'],
				['Logistics', '#product'],
				['Insights', '#product'],
				['Capital', '#pricing']
			]
		},
		{
			title: 'Merchants',
			links: [
				['Themes', '#themes'],
				['Pricing', '#pricing'],
				['Stories', '#stories'],
				['Fee calculator', '#calc'],
				['Migration', '#faq'],
				['Partner program', '#cta']
			]
		},
		{
			title: 'Company',
			links: [
				['About', '#top'],
				['Careers', '#top'],
				['Press', '#top'],
				['Status', '#top'],
				['Privacy', '#top'],
				['Terms', '#top']
			]
		}
	];
</script>

<footer class="border-t border-mk-rule-soft pt-15 pb-6.5">
	<div class="mk-wrap">
		<div class="grid grid-cols-1 gap-12 lg:grid-cols-[1.2fr_2fr]">
			<div>
				<a href="#top" class="flex items-center gap-[11px]">
					<span
						aria-hidden="true"
						class="grid size-[34px] flex-none place-items-center bg-mk-lime text-[19px] leading-none text-mk-ink"
						>&#1583;</span
					>
					<span class="block mk-display text-[21px] leading-tight">Dukk&agrave;n</span>
				</a>
				<p class="my-4 max-w-[40ch] text-[14px] text-mk-muted">
					Commerce infrastructure for independent shops — online, in person and everywhere the order
					still arrives in cash.
				</p>
				<span
					class="inline-flex items-center gap-2 border border-mk-rule-soft px-3 py-[7px] font-mk-mono text-[10px] tracking-[0.14em] text-mk-lime-ink uppercase"
				>
					<MkPulse />
					All systems operational
				</span>
			</div>

			<nav aria-label="Footer" class="grid grid-cols-2 gap-6 sm:grid-cols-3">
				{#each columns as column (column.title)}
					<div class="flex flex-col gap-2.5">
						<p class="mb-1 mk-mono text-mk-muted">{column.title}</p>
						{#each column.links as [label, href] (label)}
							<a
								{href}
								class="mk-underline w-fit text-[14px] text-mk-muted transition-colors duration-200 after:bg-mk-lime-ink hover:text-mk-ink"
								>{label}</a
							>
						{/each}
					</div>
				{/each}
			</nav>
		</div>

		<!-- A watermark, not a logo. No bold: Instrument Serif has one weight, and
			synthetic bold makes the stroke trace both edges of every stem. -->
		<p
			aria-hidden="true"
			class="wordmark mt-14 mb-4 text-center font-mk-serif text-[clamp(96px,22vw,300px)] leading-[0.8] tracking-[-0.03em]"
		>
			Dukk&agrave;n
		</p>

		<div
			class="flex flex-wrap items-center justify-between gap-5 border-t border-mk-rule-soft pt-5"
		>
			<p class="font-mk-mono text-[11px] tracking-[0.14em] text-mk-muted uppercase">
				&copy; 2026 Dukk&agrave;n Commerce Ltd
			</p>
			<p class="font-mk-mono text-[11px] tracking-[0.14em] text-mk-muted uppercase">
				A product of <span class="text-mk-ink">Fajr Labs</span>
			</p>
		</div>
	</div>
</footer>

<style>
	.wordmark {
		color: transparent;
		-webkit-text-stroke: 1.2px color-mix(in oklab, var(--color-mk-ink), transparent 84%);
	}
</style>
