<script lang="ts">
	import MockFrame from '$lib/marketing/art/MockFrame.svelte';
	import { SectionHead } from '$lib/ui';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { CheckmarkBadge01Icon } from '@hugeicons/core-free-icons';
	import { reveal } from './motion';
	import StudioMock from './mocks/StudioMock.svelte';
	import ReceiptMock from './mocks/ReceiptMock.svelte';
	import InventoryMock from './mocks/InventoryMock.svelte';
	import WaybillMock from './mocks/WaybillMock.svelte';
	import InsightsMock from './mocks/InsightsMock.svelte';

	const panels = [
		{
			index: '01',
			name: 'Storefront Studio',
			heading: "Drag a section. It's live in your shop.",
			body: 'Build the page from real sections and watch the storefront render as you go. No theme code required — though the editor is there when you want it.',
			points: [
				'Sections you can reorder',
				'Live preview, no publish step',
				'Full theme code when you need it'
			],
			mock: StudioMock,
			wide: true
		},
		{
			index: '02',
			name: 'Payments',
			heading: 'Every way your customer wants to pay.',
			body: 'Cards, wallets, bank transfer, buy-now-pay-later and cash on delivery. One flat rate, one settlement, next-day payout.',
			points: undefined,
			mock: ReceiptMock,
			wide: false
		},
		{
			index: '03',
			name: 'Inventory',
			heading: 'One stock count. Every channel.',
			body: 'Shop floor, website, social and marketplace all decrement the same number, in real time, across warehouses.',
			points: undefined,
			mock: InventoryMock,
			wide: false
		},
		{
			index: '04',
			name: 'Logistics',
			heading: 'Print the label, track the cash.',
			body: 'Live courier rates at checkout, labels in one click, and cash collections reconciled against the courier automatically.',
			points: undefined,
			mock: WaybillMock,
			wide: false
		},
		{
			index: '05',
			name: 'Insights',
			heading: 'The numbers that decide tomorrow.',
			body: 'Cohorts, return rate, payment mix and per-product margin — the figures you act on, not a wall of charts.',
			points: undefined,
			mock: InsightsMock,
			wide: false
		}
	];
</script>

<section id="product" class="bg-mk-shell py-mk-section">
	<div class="mk-wrap">
		<SectionHead
			kicker="The product"
			heading="One login runs the whole operation."
			sub="Five systems most merchants stitch together from four vendors and a spreadsheet. Here they share one database, one order, one payout."
		/>

		<div class="grid grid-cols-1 gap-x-14 gap-y-16 md:grid-cols-2">
			{#each panels as panel, i (panel.index)}
				{@const Mock = panel.mock}
				<article
					use:reveal={i * 60}
					class="flex flex-col gap-7 {panel.wide
						? 'md:col-span-2 lg:flex-row lg:items-start lg:gap-14'
						: ''}"
				>
					<div class={panel.wide ? 'flex flex-col lg:basis-[38%]' : ''}>
						<p
							class="mb-4 flex items-center gap-2.5 font-mk-mono text-[11px] tracking-[0.14em] text-mk-muted uppercase"
						>
							<span class="rounded-mk-chip bg-mk-brand px-1.5 py-0.5 text-mk-on-brand"
								>{panel.index}</span
							>
							{panel.name}
						</p>
						<h3 class="text-mk-h3">{panel.heading}</h3>
						<p class="mt-3 max-w-[46ch] text-[15px] text-mk-muted">{panel.body}</p>

						{#if panel.points}
							<ul class="mt-7 flex flex-col gap-3.5 text-[15px] text-mk-ink">
								{#each panel.points as point (point)}
									<li class="flex items-start gap-3">
										<span class="mt-[1px] flex-none text-mk-brand-type">
											<HugeiconsIcon icon={CheckmarkBadge01Icon} size={18} strokeWidth={1.8} />
										</span>
										{point}
									</li>
								{/each}
							</ul>
						{/if}
					</div>

					<div class={panel.wide ? 'lg:flex-1' : ''}>
						<MockFrame tall={panel.wide}>
							<Mock />
						</MockFrame>
					</div>
				</article>
			{/each}
		</div>
	</div>
</section>
