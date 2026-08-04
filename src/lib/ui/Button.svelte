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

	type Variant = 'solid' | 'quiet' | 'ghost' | 'danger' | 'link';
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
			border-color var(--dur-hover) var(--ease-out),
			transform var(--dur-press) var(--ease-out);
	}

	/* The press is the interface saying it heard you, before anything it does
	   about it has a chance to happen. */
	.btn:active:not(:disabled):not([aria-disabled='true']) {
		transform: scale(0.97);
	}

	@media (prefers-reduced-motion: reduce) {
		.btn {
			transition-property: background-color, color, border-color;
		}

		.btn:active {
			transform: none;
		}
	}

	/* Heights, not padding: a button beside a field has to match its height
	   exactly, and padding plus a line-height lands a pixel or two off. `md`
	   is 46px because that is what Input and Select are. */
	.btn-sm {
		height: 36px;
		padding-inline: 14px;
		font-size: 11px;
	}
	.btn-md {
		height: 46px;
		padding-inline: 20px;
		font-size: 11.5px;
	}
	.btn-lg {
		height: 52px;
		padding-inline: 24px;
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

	/* Every variant hovers within its own idea: the brand fill deepens, the
	   outlined one tints, the bare one gains a ground, the dangerous one
	   commits. None of them turns into another variant. */

	.btn-solid {
		background-color: var(--accent);
		border-color: var(--accent);
		color: var(--accent-ink);
	}

	.btn-solid:hover {
		background-color: var(--accent-hover);
		border-color: var(--accent-hover);
	}

	/* Quiet sits on paper and carries its own edge, since a fill would be the
	   colour of the panel behind it. */
	.btn-quiet {
		background-color: transparent;
		border-color: var(--rule-strong);
		color: var(--ink);
	}

	.btn-quiet:hover {
		background-color: var(--accent-soft);
		border-color: var(--accent);
		color: var(--accent);
	}

	/* Ghost is the neutral secondary: same outline as quiet, but it gains a
	   ground rather than the brand, so a pair of them beside a solid button
	   does not read as two competing offers. */
	.btn-ghost {
		background-color: transparent;
		border-color: var(--rule-strong);
		color: var(--ink);
	}

	.btn-ghost:hover {
		background-color: var(--surface);
		border-color: var(--muted);
	}

	/* Link is a button that has given up its box: no padding, no ground, and an
	   underline that only appears under the cursor. For an action that belongs
	   in a sentence or beside a heavier button without competing with it. */
	.btn-link {
		padding: 0;
		/* No box means no target, so it keeps the 24px minimum on its own. */
		height: auto;
		min-height: 24px;
		background-color: transparent;
		border-color: transparent;
		color: var(--accent);
		text-underline-offset: 4px;
	}

	.btn-link:hover {
		color: var(--accent-hover);
		text-decoration: underline;
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
		border-radius: var(--r-chip);
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
