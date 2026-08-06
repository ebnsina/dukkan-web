<script lang="ts">
	let { demoShop }: { demoShop: string } = $props();

	/* Two columns, and a headline that is no longer sized by the column.
	 *
	 * On one line "Everything your store needs." needed 10.8px of width per
	 * pixel of type, which capped it at 59px in this row — and a wrapped line
	 * is a clipped line inside the mask. Broken where the sentence already
	 * breaks, the longest line costs 6.9px per pixel of type, so the same
	 * column carries 76px. The text side also takes a little more of the row;
	 * the devices lose nothing that matters, being art rather than a diagram. */
	import { Avatar, Button } from '$lib/ui';
	import { lineMask, reveal } from './motion';
	import StorefrontPreview from './StorefrontPreview.svelte';

	/* Real shopkeepers, so the mark is their initials until there are photographs
	   of them. `photo` takes a path under static/ and the component swaps the
	   initials for the picture — one field per person, nothing else to change.
	   Stock faces are not an option: this row claims these people use Dukkàn. */
	// The four who give the stories further down the page, so the faces at the
	// top and the quotes below belong to the same people.
	const shopkeepers = [
		{ name: 'Nusrat Chowdhury', photo: undefined },
		{ name: 'Sara Mansour', photo: undefined },
		{ name: 'Ayesha Siddiqui', photo: undefined },
		{ name: 'Omar Al-Farsi', photo: undefined }
	];
</script>

<section class="pt-[clamp(44px,6vw,88px)] pb-[clamp(64px,8vw,112px)]">
	<div
		class="mk-wrap grid grid-cols-1 items-center gap-[clamp(40px,4.4vw,72px)] lg:grid-cols-[1.15fr_0.85fr]"
	>
		<div>
			<!-- The vw term is what keeps the longest line inside the column in the
			     narrow two-column band around 1024; the floor is free to be
			     generous, because on a phone the column is the whole page. -->
			<h1 class="text-[clamp(38px,5.4vw,76px)]">
				<span use:lineMask class="block overflow-hidden"><span>Everything your</span></span>
				<span use:lineMask={90} class="block overflow-hidden"><span>store needs.</span></span>
				<span use:lineMask={180} class="block overflow-hidden"
					><span class="text-mk-brand-type">Nothing it doesn't.</span></span
				>
			</h1>

			<p
				use:reveal={100}
				class="mt-[clamp(24px,2.4vw,36px)] max-w-[46ch] text-[clamp(16px,1.35vw,18px)] text-mk-muted"
			>
				Sell online, take any payment, ship the order and read the numbers &mdash; from one login.
				Money settles in 24 hours.
			</p>

			<!-- Auto columns at 1fr keep both buttons the width of the longer label. -->
			<div
				use:reveal={180}
				class="mt-[clamp(28px,2.8vw,40px)] grid w-full gap-3 sm:w-fit sm:auto-cols-fr sm:grid-flow-col"
			>
				<Button href="/signup" size="lg">Start free</Button>
				<Button href={demoShop} size="lg" variant="ghost">See live stores</Button>
			</div>

			<div use:reveal={260} class="mt-[clamp(28px,2.8vw,40px)] flex items-center gap-3.5">
				<div class="flex">
					{#each shopkeepers as person, i (person.name)}
						<Avatar
							name={person.name}
							src={person.photo}
							size="sm"
							class="ring-2 ring-mk-paper {i > 0 ? '-ml-2.5' : ''}"
						/>
					{/each}
				</div>
				<p class="text-[13px] text-mk-muted">
					<b class="mk-num text-mk-ink">48,000+</b> merchants,
					<b class="mk-num text-mk-ink">64</b> districts
				</p>
			</div>
		</div>

		<StorefrontPreview />
	</div>
</section>
