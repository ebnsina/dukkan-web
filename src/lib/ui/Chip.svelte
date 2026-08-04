<script lang="ts">
	/* A badge is a small button that does nothing: same mono type, same radius
	   scale one step down because the box is smaller, and a wash rather than a
	   fill so a column of forty does not shout. */
	import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/svelte';
	import { cn } from '$lib/utils/cn';
	import type { Tone } from './tone';

	interface Props {
		tone?: Tone;
		label: string;
		/** Shape as well as colour, so a state is not carried by hue alone. */
		icon?: IconSvgElement;
		class?: string;
	}

	let { tone = 'neutral', label, icon, class: className }: Props = $props();
</script>

<span class={cn('chip', className)} data-tone={tone}>
	{#if icon}
		<span class="glyph" aria-hidden="true">
			<HugeiconsIcon {icon} size={13} strokeWidth={2} />
		</span>
	{/if}
	{label}
</span>

<style>
	.chip {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 5px 9px;
		border-radius: var(--r-chip);
		font-family: var(--font-mono);
		font-size: 11px;
		font-weight: 500;
		letter-spacing: 0.1em;
		line-height: 1.3;
		text-transform: uppercase;
		white-space: nowrap;
		background: var(--surface);
		color: var(--muted);
		box-shadow: inset 0 0 0 1px var(--rule);
	}

	.glyph {
		display: grid;
		place-items: center;
		margin-left: -1px;
	}

	.chip[data-tone='accent'] {
		background: var(--accent-soft);
		color: var(--accent);
		box-shadow: none;
	}
	.chip[data-tone='success'] {
		background: var(--success-soft);
		color: var(--success);
		box-shadow: none;
	}
	.chip[data-tone='warning'] {
		background: var(--warning-soft);
		color: var(--warning);
		box-shadow: none;
	}
	.chip[data-tone='danger'] {
		background: var(--danger-soft);
		color: var(--danger);
		box-shadow: none;
	}
	.chip[data-tone='info'] {
		background: var(--info-soft);
		color: var(--info);
		box-shadow: none;
	}
</style>
