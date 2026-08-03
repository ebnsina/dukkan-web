<script lang="ts">
	import { cn } from '$lib/utils/cn';

	interface Props {
		href?: string | null;
		class?: string;
	}

	let { href = '/', class: className }: Props = $props();
</script>

{#snippet mark()}
	<span class="stack" aria-hidden="true">
		<span class="latin">Dukkan</span>
		<span class="arabic">دُكان</span>
	</span>
	<span class="sr-only">Dukkan</span>
{/snippet}

{#if href}
	<a {href} class={cn('wordmark', className)} aria-label="Dukkan, home">{@render mark()}</a>
{:else}
	<span class={cn('wordmark', className)}>{@render mark()}</span>
{/if}

<style>
	.wordmark {
		display: inline-flex;
		align-items: baseline;
		color: var(--ink);
		font-weight: 700;
		font-size: 17px;
		letter-spacing: -0.03em;
		font-variation-settings: 'wdth' 92;
		text-decoration: none;
	}

	/* Both readings occupy one grid cell, so the swap moves nothing. */
	.stack {
		display: grid;
		grid-template-areas: 'mark';
	}

	.stack > * {
		grid-area: mark;
		transition: opacity var(--dur-hover) var(--ease-out);
	}

	.arabic {
		font-family: var(--font-arabic);
		font-weight: 600;
		letter-spacing: 0;
		opacity: 0;
	}

	.wordmark:hover .latin,
	.wordmark:focus-visible .latin {
		opacity: 0;
	}

	.wordmark:hover .arabic,
	.wordmark:focus-visible .arabic {
		opacity: 1;
	}
</style>
