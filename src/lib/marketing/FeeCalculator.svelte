<script lang="ts">
	import { reveal } from './motion';
	import MkSectionHead from './ui/MkSectionHead.svelte';
	import Frame from './ui/Frame.svelte';
	import { taka } from './money';

	/* Local figures, not converted ones — and still placeholders. Confirm against
	   real gateway and platform pricing before launch. */
	const AVERAGE_ORDER = 1200;
	const LEGACY_RATE = 0.03;
	const LEGACY_PER_ORDER = 5;
	const DUKKAN_RATE = 0.019;
	const DUKKAN_FLAT = 2900;

	/* A flat fee only wins above a certain volume, so the range starts above
	   break-even and says so rather than showing a loss. */
	const BREAK_EVEN = DUKKAN_FLAT / (LEGACY_RATE + LEGACY_PER_ORDER / AVERAGE_ORDER - DUKKAN_RATE);
	const STEP = 10000;
	const FLOOR = Math.ceil(BREAK_EVEN / STEP) * STEP;
	const CEILING = 3000000;

	let sales = $state(600000);

	let transactions = $derived(Math.round(sales / AVERAGE_ORDER));
	let legacy = $derived(sales * LEGACY_RATE + transactions * LEGACY_PER_ORDER);
	let dukkan = $derived(sales * DUKKAN_RATE + DUKKAN_FLAT);
	// Never negative: the floor is above break-even, and this is the backstop.
	let saved = $derived(Math.max(0, (legacy - dukkan) * 12));

	const money = (value: number) => taka(Math.round(value));

	// Both bars share one scale, so the taller cost is always the full width.
	let peak = $derived(Math.max(legacy, dukkan));
	let legacyWidth = $derived(Math.max(4, Math.round((legacy / peak) * 100)));
	let dukkanWidth = $derived(Math.max(4, Math.round((dukkan / peak) * 100)));
</script>

<section id="calc" class="py-mk-section">
	<div class="mk-wrap">
		<MkSectionHead
			kicker="The math"
			heading="Legacy platforms charge per transaction. We charge once."
			sub="Drag your monthly sales. Assumes a {money(AVERAGE_ORDER)} average order."
		/>

		<div use:reveal class="grid grid-cols-1 gap-5 lg:grid-cols-[0.85fr_1.15fr]">
			<!-- The control gets its own frame: it is an instrument, not a caption. -->
			<Frame eyebrow="Monthly sales" bodyClass="p-7">
				<p class="mk-num text-[clamp(40px,4.8vw,58px)] leading-none tracking-[-0.045em]">
					{money(sales)}
				</p>
				<label class="sr-only" for="mk-sales">Monthly sales</label>
				<input
					id="mk-sales"
					type="range"
					min={FLOOR}
					max={CEILING}
					step={STEP}
					bind:value={sales}
					class="mk-range mt-7"
				/>
				<div
					class="mt-3 flex justify-between font-mk-mono text-[10px] tracking-[0.14em] text-mk-faint uppercase"
				>
					<span>{money(FLOOR)}</span>
					<span>{money(CEILING)}</span>
				</div>

				<dl class="mt-8 flex flex-col gap-3 border-t border-mk-ink/10 pt-5 text-[13px]">
					<div class="flex items-baseline justify-between">
						<dt class="text-mk-muted">Orders a month</dt>
						<dd class="mk-num">{transactions.toLocaleString('en-US')}</dd>
					</div>
					<div class="flex items-baseline justify-between">
						<dt class="text-mk-muted">Average order</dt>
						<dd class="mk-num">{money(AVERAGE_ORDER)}</dd>
					</div>
				</dl>
			</Frame>

			<Frame eyebrow="Cost a month" bodyClass="p-7">
				<!-- Both bars share one scale, so the taller cost is the full width. -->
				<div class="flex flex-col gap-7">
					{#each [{ label: 'Legacy platform', value: legacy, width: legacyWidth, fill: 'bg-mk-ink/30', note: `3% + ${money(LEGACY_PER_ORDER)} an order` }, { label: 'Dukkàn', value: dukkan, width: dukkanWidth, fill: 'bg-mk-brand', note: `1.9% + ${money(DUKKAN_FLAT)} flat, per month` }] as row (row.label)}
						<div>
							<div class="mb-2.5 flex items-baseline justify-between gap-4">
								<span class="mk-mono text-mk-muted">{row.label}</span>
								<span class="mk-num text-[22px]">{money(row.value)}</span>
							</div>
							<div class="h-2 bg-mk-shell-deep">
								<i
									class="block h-full transition-[width] duration-300 ease-mk {row.fill}"
									style="width:{row.width}%"
								></i>
							</div>
							<p class="mt-2 font-mk-mono text-[10px] tracking-[0.14em] text-mk-faint uppercase">
								{row.note}
							</p>
						</div>
					{/each}
				</div>

				{#snippet footer()}
					<div class="flex flex-wrap items-baseline justify-between gap-4">
						<p class="mk-mono text-mk-muted">You keep, per year</p>
						<p
							class="mk-num text-[clamp(30px,3.6vw,44px)] leading-none tracking-[-0.045em] text-mk-brand-type"
						>
							{money(saved)}
						</p>
					</div>
					<p class="mt-2 max-w-[56ch] text-[13px] text-mk-muted">
						A flat fee starts paying for itself above {money(BREAK_EVEN)} a month, which is where this
						range begins.
					</p>
				{/snippet}
			</Frame>
		</div>
	</div>
</section>

<style>
	/* Range thumbs can't be styled with utilities, so they are drawn by hand. */
	.mk-range {
		appearance: none;
		width: 100%;
		height: 2px;
		background: var(--color-mk-rule);
		outline: none;
	}

	.mk-range::-webkit-slider-thumb {
		appearance: none;
		width: 20px;
		height: 20px;
		border: 0;
		border-radius: 999px;
		background: var(--color-mk-brand-deep);
		cursor: pointer;
	}

	.mk-range::-moz-range-thumb {
		width: 20px;
		height: 20px;
		border: 0;
		border-radius: 999px;
		background: var(--color-mk-brand-deep);
		cursor: pointer;
	}
</style>
