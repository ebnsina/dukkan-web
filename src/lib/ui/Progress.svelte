<script lang="ts">
	/* How far along something is: a stock level, an upload, a payout window.
	   Determinate only — a bar that cannot say how far along it is should be a
	   Spinner instead. */
	import { cn } from '$lib/utils/cn';
	import type { Tone } from './tone';

	interface Props {
		value: number;
		max?: number;
		/** Named for a reader; the bar alone says nothing out loud. */
		label: string;
		/** The figure on the right — already formatted, since money is not a
		 * percentage. Pass nothing for the percentage. */
		valueLabel?: string;
		tone?: Tone;
		class?: string;
	}

	let { value, max = 100, label, valueLabel, tone = 'neutral', class: className }: Props = $props();

	let pct = $derived(Math.min(100, Math.max(0, max > 0 ? (value / max) * 100 : 0)));
	let text = $derived(valueLabel ?? `${Math.round(pct)}%`);
</script>

<div class={cn('progress', className)} data-tone={tone}>
	<div class="top">
		<span class="label">{label}</span>
		<span class="value">{text}</span>
	</div>
	<div
		class="track"
		role="progressbar"
		aria-label={label}
		aria-valuenow={value}
		aria-valuemin={0}
		aria-valuemax={max}
		aria-valuetext={text}
	>
		<span class="bar" style="width:{pct}%"></span>
	</div>
</div>

<style>
	.top {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 12px;
		margin-bottom: 8px;
	}

	.label {
		font-size: 13px;
		color: var(--muted);
	}

	.value {
		font-family: var(--font-mono);
		font-size: 12px;
		font-variant-numeric: tabular-nums;
		color: var(--ink);
	}

	.track {
		height: 6px;
		border-radius: var(--r-round);
		background: var(--surface);
		overflow: hidden;
	}

	.bar {
		display: block;
		height: 100%;
		border-radius: var(--r-round);
		background: var(--accent);
		transition: width var(--dur-enter, 220ms) var(--ease-out);
	}

	[data-tone='accent'] .bar {
		background: var(--accent);
	}
	[data-tone='success'] .bar {
		background: var(--success);
	}
	[data-tone='warning'] .bar {
		background: var(--warning);
	}
	[data-tone='danger'] .bar {
		background: var(--danger);
	}
	[data-tone='info'] .bar {
		background: var(--info);
	}

	@media (prefers-reduced-motion: reduce) {
		.bar {
			transition: none;
		}
	}
</style>
