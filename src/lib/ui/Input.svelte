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
		font-size: var(--size-body);
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
		cursor: not-allowed;
	}

	.is-invalid {
		border-color: var(--ink);
		border-left-width: 2px;
	}
</style>
