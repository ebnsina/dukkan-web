<script lang="ts">
	import type { HTMLTextareaAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils/cn';

	interface Props extends HTMLTextareaAttributes {
		invalid?: boolean;
		value?: string;
	}

	let {
		invalid = false,
		rows = 4,
		class: className,
		value = $bindable(''),
		...rest
	}: Props = $props();
</script>

<textarea bind:value {rows} class={cn('control', invalid && 'is-invalid', className)} {...rest}
></textarea>

<style>
	.control {
		width: 100%;
		padding: 12px 14px;
		background-color: var(--paper);
		color: var(--ink);
		border: 1px solid var(--rule-strong);
		border-radius: var(--r-control);
		font-family: var(--font-display);
		font-size: var(--size-body);
		line-height: 1.6;
		resize: vertical;
		transition: border-color var(--dur-hover) var(--ease-out);
	}

	.control::placeholder {
		color: var(--faint);
	}

	.control:hover {
		border-color: var(--muted);
	}

	.control:focus {
		outline: none;
		border-color: var(--ink);
	}

	.control:disabled {
		background-color: var(--surface);
		color: var(--faint);
	}

	.is-invalid {
		border-color: var(--ink);
		border-left-width: 2px;
	}
</style>
