<script lang="ts">
	import type { Tone } from './state';

	interface Props {
		tone?: Tone;
		label: string;
		/** A dot instead of a filled chip, for dense rows where a chip is loud. */
		quiet?: boolean;
	}

	let { tone = 'neutral', label, quiet = false }: Props = $props();
</script>

<span class="chip" class:is-quiet={quiet} data-tone={tone}>
	{#if quiet}<span class="dot" aria-hidden="true"></span>{/if}
	{label}
</span>

<style>
	/* Square, flat, no shadow: the wash and the rule carry the state. */
	.chip {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		padding: 3px 8px;
		font-family: var(--font-mono);
		font-size: 10.5px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		white-space: nowrap;
		border: 1px solid transparent;
		background: var(--surface);
		color: var(--muted);
	}

	.chip[data-tone='accent'] {
		background: var(--accent-soft);
		border-color: color-mix(in srgb, var(--accent) 26%, transparent);
		color: var(--accent);
	}

	.chip[data-tone='success'] {
		background: var(--success-soft);
		border-color: color-mix(in srgb, var(--success) 26%, transparent);
		color: var(--success);
	}

	.chip[data-tone='warning'] {
		background: var(--warning-soft);
		border-color: color-mix(in srgb, var(--warning) 26%, transparent);
		color: var(--warning);
	}

	.chip[data-tone='danger'] {
		background: var(--danger-soft);
		border-color: color-mix(in srgb, var(--danger) 26%, transparent);
		color: var(--danger);
	}

	.chip[data-tone='info'] {
		background: var(--info-soft);
		border-color: color-mix(in srgb, var(--info) 26%, transparent);
		color: var(--info);
	}

	/* In a dense table a row of chips is louder than the data. The quiet form
	   keeps the wording plain and lets a single dot carry the state. */
	.is-quiet {
		padding: 0;
		background: none;
		border-color: transparent;
		font-family: var(--font-display);
		font-size: 13px;
		letter-spacing: 0;
		text-transform: none;
	}

	.dot {
		width: 7px;
		height: 7px;
		flex-shrink: 0;
		background: currentColor;
	}

	.is-quiet[data-tone] {
		color: var(--ink);
	}

	.is-quiet .dot {
		background: var(--faint);
	}

	.is-quiet[data-tone='accent'] .dot {
		background: var(--accent);
	}
	.is-quiet[data-tone='success'] .dot {
		background: var(--success);
	}
	.is-quiet[data-tone='warning'] .dot {
		background: var(--warning);
	}
	.is-quiet[data-tone='danger'] .dot {
		background: var(--danger);
	}
	.is-quiet[data-tone='info'] .dot {
		background: var(--info);
	}
</style>
