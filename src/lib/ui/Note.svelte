<script lang="ts">
	import type { Snippet } from 'svelte';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { Cancel01Icon } from '@hugeicons/core-free-icons';

	interface Props {
		title?: string;
		tone?: 'quiet' | 'firm';
		dismissible?: boolean;
		children: Snippet;
		actions?: Snippet;
		ondismiss?: () => void;
	}

	let {
		title,
		tone = 'quiet',
		dismissible = false,
		children,
		actions,
		ondismiss
	}: Props = $props();
</script>

<!-- No hue, ever. A firm note is heavier and sits behind a thicker rule. -->
<div class="note" class:firm={tone === 'firm'} role={tone === 'firm' ? 'alert' : 'status'}>
	<div class="body">
		{#if title}<p class="title">{title}</p>{/if}
		<div class="copy">{@render children()}</div>
		{#if actions}<div class="actions">{@render actions()}</div>{/if}
	</div>
	{#if dismissible}
		<button type="button" class="close" onclick={ondismiss} aria-label="Dismiss">
			<HugeiconsIcon icon={Cancel01Icon} size={14} strokeWidth={1.8} />
		</button>
	{/if}
</div>

<style>
	/* Quiet: the surface change is the edge, so there is no rule.
	   Firm: the rule is the edge, so there is no surface change. */
	.note {
		display: flex;
		align-items: flex-start;
		gap: 16px;
		padding: 16px 18px;
		background: var(--surface);
	}

	.firm {
		background: var(--paper);
		border-left: 3px solid var(--ink);
		padding-left: 15px;
	}

	.title {
		font-size: var(--size-body);
		font-weight: 600;
		line-height: 1.4;
		margin-bottom: 4px;
	}

	.firm .title {
		font-weight: 700;
	}

	.copy {
		font-size: 14px;
		line-height: 1.6;
		color: var(--muted);
		max-width: 60ch;
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		margin-top: 14px;
	}

	.close {
		margin-left: auto;
		padding: 6px;
		color: var(--faint);
		cursor: pointer;
		background: none;
		border: none;
		min-width: 24px;
		min-height: 24px;
	}

	.close:hover {
		color: var(--ink);
	}
</style>
