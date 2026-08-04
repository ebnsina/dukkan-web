<script lang="ts">
	import { Avatar, SectionHead } from '$lib/ui';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { ArrowLeft02Icon, ArrowRight02Icon } from '@hugeicons/core-free-icons';

	const stories = [
		{
			quote:
				'We turned on wallet checkout on a Thursday. By Sunday our conversion had doubled — people had been abandoning at the card form the whole time and we never knew.',
			stat: '+164% orders',
			period: 'first quarter',
			name: 'Nusrat Chowdhury',
			shop: 'Jamdani House · Fashion',
			lock: 301
		},
		{
			quote:
				'Cash-on-delivery returns were eating the margin. Address validation and the confirmation step cut them by a third without losing a single order.',
			stat: '−38% returns',
			period: 'six months',
			name: 'Sara Mansour',
			shop: 'Maison Dattes · Grocery',
			lock: 302
		},
		{
			quote:
				'Two storefronts in two languages that look nothing alike, and I still open one admin in the morning.',
			stat: '2 storefronts',
			period: '1 admin',
			name: 'Ayesha Siddiqui',
			shop: 'Mehndi Beauty · Beauty',
			lock: 303
		},
		{
			quote:
				'Three warehouses used to mean three spreadsheets and an apology email every week. We have not oversold a unit since we moved.',
			stat: '3 warehouses',
			period: '0 oversells',
			name: 'Omar Al-Farsi',
			shop: 'Atlas Threads · Apparel',
			lock: 304
		}
	];

	let row = $state<HTMLDivElement>();

	function scrollBy(direction: 1 | -1) {
		if (!row) return;
		row.scrollBy({ left: direction * (row.clientWidth * 0.8), behavior: 'smooth' });
	}
</script>

<section id="stories" class="py-mk-section">
	<div class="mk-wrap">
		<SectionHead kicker="Stories" heading="Shopkeepers, not case studies.">
			{#snippet aside()}
				<!-- HugeIcons, not `&larr;` — an entity arrow is a glyph from the
				     text font, so it changed weight and alignment with the type
				     around it while every other arrow on the page is an icon. -->
				<div class="flex gap-2">
					<button
						type="button"
						onclick={() => scrollBy(-1)}
						aria-label="Previous story"
						class="mk-arrow-btn"
					>
						<HugeiconsIcon icon={ArrowLeft02Icon} size={18} strokeWidth={1.8} />
					</button>
					<button
						type="button"
						onclick={() => scrollBy(1)}
						aria-label="Next story"
						class="mk-arrow-btn"
					>
						<HugeiconsIcon icon={ArrowRight02Icon} size={18} strokeWidth={1.8} />
					</button>
				</div>
			{/snippet}
		</SectionHead>

		<div
			bind:this={row}
			class="flex snap-x snap-mandatory [scrollbar-width:none] gap-5 overflow-x-auto pb-1.5 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
		>
			{#each stories as story (story.name)}
				<!-- A card, like everything else that holds a self-contained thing.
				     A top rule alone left each quote floating with no edge on three
				     sides, which is why the row read as columns of text. -->
				<article
					class="flex flex-[0_0_min(400px,84vw)] snap-start flex-col gap-5 rounded-mk-card border border-mk-rule-soft bg-mk-paper p-7"
				>
					<p class="flex-1 mk-display text-[19px] leading-[1.35] font-bold">
						&ldquo;{story.quote}&rdquo;
					</p>
					<div class="mk-num text-[16px] text-mk-brand-type">
						{story.stat}
						<span
							class="font-mk-mono text-[10px] font-normal tracking-[0.12em] text-mk-muted uppercase"
							>&middot; {story.period}</span
						>
					</div>
					<div class="flex items-center gap-3">
						<!-- The library's Avatar rather than initials worked out here: same
						     corner, same rules for a name with no Latin letters in it. -->
						<Avatar name={story.name} size="md" />
						<div>
							<p class="text-[14px] font-semibold">{story.name}</p>
							<p class="font-mk-mono text-[10px] tracking-[0.12em] text-mk-muted uppercase">
								{story.shop}
							</p>
						</div>
					</div>
				</article>
			{/each}
		</div>
	</div>
</section>
