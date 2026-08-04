<script lang="ts">
	/* A stack, not a list.
	 *
	 * Three notices arriving together should read as one thing in the corner
	 * with more behind it, so they sit on top of each other with the newest in
	 * front and the rest peeking out. Pointing at the stack fans it out, which
	 * is the only way to reach the close control on the ones underneath. */
	import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/svelte';
	import {
		Alert02Icon,
		Cancel01Icon,
		CheckmarkCircle02Icon,
		InformationCircleIcon
	} from '@hugeicons/core-free-icons';
	import { toasts } from './toast.svelte';
	import type { Tone } from './tone';

	// Neutral keeps the plain mark; the rest say what kind of news they are
	// with a shape, since the ground is dark and a tint alone would not read.
	const glyphs: Partial<Record<Tone, IconSvgElement>> = {
		success: CheckmarkCircle02Icon,
		warning: Alert02Icon,
		danger: Alert02Icon,
		info: InformationCircleIcon,
		accent: InformationCircleIcon
	};

	/** How far each toast behind the front one shows above it. */
	const PEEK = 10;
	/** How many are drawn before the rest are stacked invisibly. */
	const DEPTH = 3;
	const GAP = 10;

	let expanded = $state(false);
	let heights = $state<Record<string, number>>({});

	// Newest first: index 0 is the front of the stack, nearest the corner.
	let stack = $derived([...toasts.items].reverse());

	function height(id: string) {
		return heights[id] ?? 68;
	}

	function offset(index: number) {
		if (!expanded) return Math.min(index, DEPTH) * PEEK;
		let sum = 0;
		for (let i = 0; i < index; i++) sum += height(stack[i].id) + GAP;
		return sum;
	}

	// The wrapper has to own the whole fanned-out area, or the pointer leaves it
	// in the gap between two toasts and the stack collapses under the cursor.
	let extent = $derived(
		stack.length === 0
			? 0
			: expanded
				? stack.reduce((sum, toast) => sum + height(toast.id) + GAP, -GAP)
				: height(stack[0].id) + Math.min(stack.length - 1, DEPTH) * PEEK
	);
</script>

<div class="deck" aria-live="polite" aria-atomic="false">
	<div
		class="stack"
		style="height:{extent}px"
		style:pointer-events={stack.length ? 'auto' : 'none'}
		onpointerenter={() => (expanded = true)}
		onpointerleave={() => (expanded = false)}
		onfocusin={() => (expanded = true)}
		onfocusout={() => (expanded = false)}
		role="presentation"
	>
		{#each stack as toast, index (toast.id)}
			{@const glyph = glyphs[toast.tone]}
			<div
				class="slot"
				style="transform: translateY({-offset(index)}px) scale({expanded
					? 1
					: 1 - Math.min(index, DEPTH) * 0.05}); z-index: {stack.length - index}"
				style:opacity={index > DEPTH ? 0 : 1}
			>
				<div
					class="toast"
					role="status"
					data-tone={toast.tone}
					bind:clientHeight={heights[toast.id]}
				>
					{#if toast.loading}
						<span class="spin" aria-hidden="true"></span>
					{:else if glyph}
						<span class="glyph" aria-hidden="true">
							<HugeiconsIcon icon={glyph} size={16} strokeWidth={1.8} />
						</span>
					{:else}
						<span class="mark" aria-hidden="true"></span>
					{/if}

					<div class="body">
						<p class="title">{toast.title}</p>
						{#if toast.description}<p class="desc">{toast.description}</p>{/if}
						{#if toast.action}
							<button
								type="button"
								class="act"
								onclick={() => {
									toast.action?.onclick();
									toasts.dismiss(toast.id);
								}}
							>
								{toast.action.label}
							</button>
						{/if}
					</div>

					{#if !toast.loading}
						<button
							type="button"
							class="close"
							onclick={() => toasts.dismiss(toast.id)}
							aria-label="Dismiss"
						>
							<HugeiconsIcon icon={Cancel01Icon} size={13} strokeWidth={1.8} />
						</button>
					{/if}
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.deck {
		position: fixed;
		right: 0;
		bottom: 0;
		z-index: 600;
		padding: 20px;
		pointer-events: none;
	}

	.stack {
		position: relative;
		width: min(360px, calc(100vw - 40px));
		transition: height var(--dur-enter, 220ms) var(--ease-out);
	}

	/* The slot carries the stack's arithmetic; the toast inside carries its own
	   arrival. Two elements, so neither transform fights the other. */
	.slot {
		position: absolute;
		right: 0;
		bottom: 0;
		width: 100%;
		transform-origin: bottom center;
		transition:
			transform var(--dur-enter, 220ms) var(--ease-out),
			opacity var(--dur-enter, 220ms) var(--ease-out);
	}

	/* The same tones a Banner uses, so a warning means one thing wherever it
	   appears. A Banner sits inside a panel and can go without an edge; a toast
	   floats over whatever happens to be under it, so it carries one. */
	.toast {
		display: flex;
		align-items: flex-start;
		gap: 12px;
		padding: 14px 14px 14px 16px;
		border: 1px solid var(--rule-strong);
		border-radius: var(--r-panel);
		background: var(--surface);
		color: var(--muted);
		pointer-events: auto;
		animation: arrive var(--dur-enter) var(--ease-out);
	}

	.toast[data-tone='accent'] {
		background: var(--accent-soft);
		color: var(--accent);
	}
	.toast[data-tone='success'] {
		background: var(--success-soft);
		color: var(--success);
	}
	.toast[data-tone='warning'] {
		background: var(--warning-soft);
		color: var(--warning);
	}
	.toast[data-tone='danger'] {
		background: var(--danger-soft);
		color: var(--danger);
	}
	.toast[data-tone='info'] {
		background: var(--info-soft);
		color: var(--info);
	}

	.toast:not([data-tone='neutral']) {
		border-color: color-mix(in oklab, currentColor 22%, transparent);
	}

	@keyframes arrive {
		from {
			transform: translateY(16px);
			opacity: 0;
		}
	}

	.mark {
		flex: none;
		width: 6px;
		height: 6px;
		margin-top: 6px;
		border-radius: var(--r-chip);
		background: var(--accent);
	}

	/* The glyph takes the tone's colour from the toast itself. */
	.glyph {
		display: grid;
		place-items: center;
		flex: none;
		margin-top: 1px;
		color: inherit;
	}

	/* Work still running: one revolution, linear, because a spinner that eases
	   reads as stuttering. */
	.spin {
		flex: none;
		width: 14px;
		height: 14px;
		margin-top: 2px;
		border: 2px solid currentColor;
		border-right-color: transparent;
		border-radius: var(--r-round);
		opacity: 0.7;
		animation: spin 700ms linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.act {
		margin-top: 10px;
		padding: 6px 10px;
		border: 0;
		border-radius: var(--r-chip);
		background: color-mix(in oklab, currentColor 14%, transparent);
		color: inherit;
		font-family: var(--font-mono);
		font-size: 10.5px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		cursor: pointer;
		transition: background-color var(--dur-hover) var(--ease-out);
	}

	.act:hover {
		background: color-mix(in oklab, currentColor 24%, transparent);
	}

	.body {
		flex: 1;
		min-width: 0;
	}

	.title {
		font-size: 14px;
		font-weight: 650;
		line-height: 1.4;
		color: inherit;
	}

	.desc {
		margin-top: 3px;
		font-size: 13px;
		line-height: 1.5;
		opacity: 0.85;
	}

	.close {
		margin-left: auto;
		padding: 5px;
		min-width: 24px;
		min-height: 24px;
		border-radius: var(--r-chip);
		background: none;
		border: none;
		color: inherit;
		opacity: 0.6;
		cursor: pointer;
	}

	.close:hover {
		opacity: 1;
	}

	@media (prefers-reduced-motion: reduce) {
		.stack,
		.slot {
			transition: none;
		}

		.toast {
			animation: none;
		}

		.spin {
			animation-duration: 1400ms;
		}
	}
</style>
