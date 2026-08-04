<script lang="ts">
	import type { HTMLSelectAttributes } from 'svelte/elements';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { ArrowDown01Icon } from '@hugeicons/core-free-icons';
	import { cn } from '$lib/utils/cn';

	export interface SelectOption {
		value: string;
		label: string;
		disabled?: boolean;
	}

	interface Props extends Omit<HTMLSelectAttributes, 'size'> {
		options: SelectOption[];
		invalid?: boolean;
		placeholder?: string;
		value?: string;
	}

	let {
		options,
		invalid = false,
		placeholder,
		class: className,
		value = $bindable(''),
		...rest
	}: Props = $props();
</script>

<div class="wrap">
	<select bind:value class={cn('control', invalid && 'is-invalid', className)} {...rest}>
		{#if placeholder}<option value="" disabled>{placeholder}</option>{/if}
		{#each options as option (option.value)}
			<option value={option.value} disabled={option.disabled}>{option.label}</option>
		{/each}
	</select>
	<span class="chevron" aria-hidden="true">
		<HugeiconsIcon icon={ArrowDown01Icon} size={16} strokeWidth={1.6} />
	</span>
</div>

<style>
	.wrap {
		position: relative;
	}

	.control {
		width: 100%;
		height: 46px;
		padding-inline: 14px 40px;
		background-color: var(--paper);
		color: var(--ink);
		border: 1px solid var(--rule-strong);
		border-radius: var(--r-control);
		font-family: var(--font-display);
		font-size: var(--size-body);
		appearance: none;
		cursor: pointer;
		transition: border-color var(--dur-hover) var(--ease-out);
	}

	.control:hover {
		border-color: var(--rule-hover);
	}

	.control:focus {
		border-color: var(--rule-strong);
		outline: 1.5px dashed var(--accent);
		outline-offset: 3px;
	}

	.control:disabled {
		background-color: var(--surface);
		color: var(--faint);
	}

	.is-invalid {
		border-color: var(--danger);
	}

	.chevron {
		position: absolute;
		right: 13px;
		top: 50%;
		transform: translateY(-50%);
		color: var(--muted);
		pointer-events: none;
	}
</style>
