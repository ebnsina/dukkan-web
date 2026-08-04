<script lang="ts">
	/* A figure that rolls to its new value instead of blinking to it.
	 *
	 * Each digit is a column of 0–9 behind a one-digit window; changing the
	 * number slides the column. Everything that is not a digit — the taka sign,
	 * the separators — is drawn once and stays put, so the money never reflows
	 * while the digits move.
	 *
	 * A price that changes without moving looks like a different price for the
	 * same thing. Rolling it says: same figure, new number. */
	import { prefersReducedMotion } from 'svelte/motion';
	import { cn } from '$lib/utils/cn';

	interface Props {
		value: number;
		/** How the number is written — money goes through `$lib/utils/money`. */
		format: (value: number) => string;
		class?: string;
	}

	let { value, format, class: className }: Props = $props();

	const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

	let text = $derived(format(value));
	let parts = $derived([...text]);
</script>

<!-- The label carries the whole figure; the columns are decoration to a
     reader, which is why every one of them is hidden. -->
<span class={cn('ticker', className)} aria-label={text} role="img">
	{#each parts as char, i (i)}
		{#if /\d/.test(char)}
			<span class="window" aria-hidden="true">
				<span
					class="strip"
					class:is-still={prefersReducedMotion.current}
					style="transform: translateY({-Number(char) * 10}%)"
				>
					{#each DIGITS as digit (digit)}
						<span class="digit">{digit}</span>
					{/each}
				</span>
			</span>
		{:else}
			<span aria-hidden="true">{char}</span>
		{/if}
	{/each}
</span>

<style>
	.ticker {
		display: inline-flex;
		align-items: baseline;
		/* Fixed-width digits, or the columns change width as they roll and the
		   whole figure jitters. */
		font-variant-numeric: tabular-nums;
	}

	.window {
		display: inline-block;
		height: 1em;
		overflow: hidden;
		/* The strip is 10 lines tall, so the window has to sit on the first
		   one's baseline rather than on the block's. */
		vertical-align: bottom;
	}

	.strip {
		display: flex;
		flex-direction: column;
		transition: transform 620ms cubic-bezier(0.22, 1, 0.28, 1);
	}

	.digit {
		height: 1em;
		line-height: 1;
	}

	/* Reduced motion still gets the right number, just without the travel. */
	.is-still {
		transition: none;
	}
</style>
