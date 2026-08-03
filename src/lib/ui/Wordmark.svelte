<script lang="ts">
	import { cn } from '$lib/utils/cn';

	interface Props {
		href?: string | null;
		class?: string;
	}

	let { href = '/', class: className }: Props = $props();
</script>

{#if href}
	<a {href} class={cn('wordmark', className)}>Dukkan</a>
{:else}
	<span class={cn('wordmark', className)}>Dukkan</span>
{/if}

<style>
	.wordmark {
		display: inline-block;
		color: var(--ink);
		font-weight: 700;
		font-size: 17px;
		letter-spacing: -0.03em;
		font-variation-settings: 'wdth' 92;
		text-decoration: none;
	}
</style>
