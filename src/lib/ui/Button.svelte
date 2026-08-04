<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { ArrowRight02Icon } from '@hugeicons/core-free-icons';
	import { cn } from '$lib/utils/cn';

	type Variant = 'solid' | 'ghost';

	interface Props extends Omit<HTMLButtonAttributes & HTMLAnchorAttributes, 'size'> {
		variant?: Variant;
		arrow?: boolean;
		loading?: boolean;
		href?: string;
		children: Snippet;
	}

	let {
		variant = 'solid',
		arrow = false,
		loading = false,
		href,
		disabled,
		type = 'button',
		class: className,
		children,
		...rest
	}: Props = $props();

	let classes = $derived(cn('btn', variant === 'solid' ? 'btn-solid' : 'btn-ghost', className));
	let isDisabled = $derived(Boolean(disabled) || loading);
</script>

{#snippet inner()}
	<span class="label">{@render children()}</span>
	{#if arrow}
		<span class="arrow" aria-hidden="true">
			<HugeiconsIcon icon={ArrowRight02Icon} size={14} strokeWidth={1.8} />
		</span>
	{/if}
	{#if loading}
		<span class="dots" aria-hidden="true"><i></i><i></i><i></i></span>
	{/if}
{/snippet}

{#if href}
	<a
		{href}
		class={classes}
		aria-disabled={isDisabled || undefined}
		tabindex={isDisabled ? -1 : undefined}
		{...rest}
	>
		{@render inner()}
	</a>
{:else}
	<button {type} class={classes} disabled={isDisabled} aria-busy={loading || undefined} {...rest}>
		{@render inner()}
	</button>
{/if}

<style>
	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		height: 46px;
		padding-inline: 22px;
		border-radius: var(--r-control);
		border: 1px solid transparent;
		font-family: var(--font-mono);
		font-size: 11px;
		line-height: 1;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		text-decoration: none;
		white-space: nowrap;
		cursor: pointer;
		transition:
			background-color var(--dur-hover) var(--ease-out),
			color var(--dur-hover) var(--ease-out),
			border-color var(--dur-hover) var(--ease-out);
	}

	.btn:disabled,
	.btn[aria-disabled='true'] {
		opacity: 0.4;
		pointer-events: none;
	}

	.btn-solid {
		background-color: var(--inverse-paper);
		color: var(--inverse-ink);
	}

	.btn-solid:hover {
		background-color: var(--muted);
	}

	.btn-ghost {
		background-color: var(--paper);
		color: var(--ink);
		border-color: var(--rule-strong);
	}

	.btn-ghost:hover {
		border-color: var(--ink);
	}

	.arrow {
		display: inline-flex;
		transition: transform var(--dur-hover) var(--ease-out);
	}

	.btn:hover .arrow {
		transform: translateX(4px);
	}

	.dots {
		display: inline-flex;
		gap: 3px;
	}

	.dots i {
		width: 3px;
		height: 3px;
		background: currentColor;
		animation: pulse 900ms ease-in-out infinite;
	}

	.dots i:nth-child(2) {
		animation-delay: 150ms;
	}

	.dots i:nth-child(3) {
		animation-delay: 300ms;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 0.25;
		}
		50% {
			opacity: 1;
		}
	}
</style>
