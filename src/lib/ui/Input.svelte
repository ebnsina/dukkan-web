<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils/cn';

	interface Props extends Omit<HTMLInputAttributes, 'size'> {
		invalid?: boolean;
		numeric?: boolean;
		value?: string | number;
	}

	let {
		invalid = false,
		numeric = false,
		class: className,
		value = $bindable(''),
		...rest
	}: Props = $props();
</script>

<input
	bind:value
	class={cn('control', invalid && 'is-invalid', numeric && 't-mono', className)}
	{...rest}
/>

<style>
	.control {
		width: 100%;
		height: 46px;
		padding-inline: 14px;
		background-color: var(--paper);
		color: var(--ink);
		border: 1px solid var(--rule-strong);
		border-radius: var(--r-control);
		font-size: var(--size-body);
		transition: border-color var(--dur-hover) var(--ease-out);
	}

	.control::placeholder {
		color: var(--faint);
	}

	.control:hover {
		border-color: var(--rule-hover);
	}

	/* The border stays the border; focus is a ring outside it, offset so the
	   two read as separate things rather than one thick edge. */
	.control:focus {
		border-color: var(--rule-strong);
		outline: 1.5px dashed var(--accent);
		outline-offset: 3px;
	}

	.control:disabled {
		background-color: var(--surface);
		color: var(--faint);
		cursor: not-allowed;
	}

	.is-invalid {
		border-color: var(--danger);
	}
</style>
