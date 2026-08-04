<script lang="ts">
	/* One button for every surface.
	 *
	 * The storefront, the admin and the marketing site all want a mono uppercase
	 * label on a brand fill — they only ever differed in padding, which is what
	 * `size` is for. Anything one surface needs beyond that is passed as `class`
	 * at the call site; it is never forked into a second component. */
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
	import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/svelte';
	import { ArrowRight02Icon } from '@hugeicons/core-free-icons';
	import { cn } from '$lib/utils/cn';

	type Variant = 'solid' | 'quiet' | 'ghost' | 'danger';
	type Size = 'sm' | 'md' | 'lg';

	interface Props extends Omit<HTMLButtonAttributes & HTMLAnchorAttributes, 'size'> {
		variant?: Variant;
		size?: Size;
		/** Leads the label. Decoration — the label is the accessible name. */
		icon?: IconSvgElement;
		arrow?: boolean;
		loading?: boolean;
		full?: boolean;
		href?: string;
		children: Snippet;
	}

	let {
		variant = 'solid',
		size = 'md',
		icon,
		arrow = false,
		loading = false,
		full = false,
		href,
		disabled,
		type = 'button',
		class: className,
		children,
		...rest
	}: Props = $props();

	let classes = $derived(cn('btn', `btn-${variant}`, `btn-${size}`, full && 'btn-full', className));
	let isDisabled = $derived(Boolean(disabled) || loading);
</script>

{#snippet inner()}
	{#if icon}
		<span class="glyph" aria-hidden="true">
			<HugeiconsIcon {icon} size={size === 'sm' ? 14 : 15} strokeWidth={1.8} />
		</span>
	{/if}
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
		gap: 9px;
		border: 1px solid transparent;
		border-radius: var(--r-control);
		font-family: var(--font-mono);
		font-weight: 500;
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

	.btn-sm {
		padding: 10px 14px;
		font-size: 11px;
	}
	.btn-md {
		padding: 14px 20px;
		font-size: 11.5px;
	}
	.btn-lg {
		padding: 16px 24px;
		font-size: 12px;
	}

	.btn-full {
		width: 100%;
	}

	.btn:disabled,
	.btn[aria-disabled='true'] {
		opacity: 0.4;
		pointer-events: none;
	}

	/* Solid reads as the brand on every surface, because `--inverse-paper` is
	   ours on ours and the shop's own accent on theirs. */
	.btn-solid {
		background-color: var(--inverse-paper);
		border-color: var(--inverse-paper);
		color: var(--inverse-ink);
	}

	.btn-solid:hover {
		background-color: var(--accent);
		border-color: var(--accent);
		color: var(--accent-ink);
	}

	/* Quiet sits on paper and carries its own edge, since a fill would be the
	   colour of the panel behind it. */
	.btn-quiet {
		background-color: transparent;
		border-color: var(--rule-strong);
		color: var(--ink);
	}

	.btn-quiet:hover {
		background-color: var(--surface);
		border-color: var(--ink);
	}

	.btn-ghost {
		background-color: transparent;
		border-color: var(--rule-strong);
		color: var(--ink);
	}

	.btn-ghost:hover {
		background-color: var(--ink);
		border-color: var(--ink);
		color: var(--paper);
	}

	.btn-danger {
		background-color: var(--danger-soft);
		border-color: transparent;
		color: var(--danger);
	}

	.btn-danger:hover {
		background-color: var(--danger);
		color: var(--paper);
	}

	.glyph,
	.arrow {
		display: grid;
		place-items: center;
	}

	.arrow {
		transition: transform var(--dur-hover) var(--ease-out);
	}

	.btn:hover .arrow {
		transform: translateX(3px);
	}

	.dots {
		display: inline-flex;
		gap: 3px;
	}

	.dots i {
		width: 3px;
		height: 3px;
		border-radius: var(--r-round);
		background: currentColor;
		animation: pulse 1s infinite ease-in-out;
	}

	.dots i:nth-child(2) {
		animation-delay: 0.15s;
	}
	.dots i:nth-child(3) {
		animation-delay: 0.3s;
	}

	@keyframes pulse {
		0%,
		80%,
		100% {
			opacity: 0.25;
		}
		40% {
			opacity: 1;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.arrow,
		.dots i {
			transition: none;
			animation: none;
		}
	}
</style>
