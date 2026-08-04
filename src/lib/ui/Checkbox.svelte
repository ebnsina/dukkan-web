<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { Tick02Icon, MinusSignIcon } from '@hugeicons/core-free-icons';

	interface Props extends Omit<HTMLInputAttributes, 'type' | 'size'> {
		label?: string;
		description?: string;
		indeterminate?: boolean;
		checked?: boolean;
	}

	let {
		label,
		description,
		indeterminate = $bindable(false),
		checked = $bindable(false),
		disabled,
		...rest
	}: Props = $props();

	const uid = $props.id();
</script>

<div class="row" class:is-disabled={disabled}>
	<span class="box">
		<input id={uid} type="checkbox" bind:checked {indeterminate} {disabled} {...rest} />
		<span class="glyph tick" aria-hidden="true">
			<HugeiconsIcon icon={Tick02Icon} size={12} strokeWidth={2.6} />
		</span>
		<span class="glyph dash" aria-hidden="true">
			<HugeiconsIcon icon={MinusSignIcon} size={12} strokeWidth={2.6} />
		</span>
	</span>

	{#if label || description}
		<label for={uid}>
			{#if label}<span class="name">{label}</span>{/if}
			{#if description}<span class="desc">{description}</span>{/if}
		</label>
	{/if}
</div>

<style>
	.row {
		display: flex;
		align-items: flex-start;
		gap: 12px;
	}

	.is-disabled {
		opacity: 0.4;
	}

	.box {
		position: relative;
		display: grid;
		place-items: center;
		width: 18px;
		height: 18px;
		flex-shrink: 0;
		margin-top: 2px;
	}

	input {
		position: absolute;
		inset: 0;
		appearance: none;
		border: 1px solid var(--rule-strong);
		border-radius: var(--r-chip);
		background: var(--paper);
		cursor: pointer;
		transition: border-color var(--dur-hover) var(--ease-out);
	}

	input:hover {
		border-color: var(--muted);
	}

	input:checked,
	input:indeterminate {
		background: var(--inverse-paper);
		border-color: var(--inverse-paper);
	}

	.glyph {
		position: relative;
		display: grid;
		place-items: center;
		color: var(--inverse-ink);
		opacity: 0;
		pointer-events: none;
	}

	input:checked ~ .tick {
		opacity: 1;
	}

	input:indeterminate ~ .tick {
		opacity: 0;
	}

	input:indeterminate ~ .dash {
		opacity: 1;
	}

	.dash {
		position: absolute;
	}

	label {
		cursor: pointer;
		user-select: none;
	}

	.name {
		display: block;
		font-size: var(--size-body);
		line-height: 1.4;
	}

	.desc {
		display: block;
		margin-top: 3px;
		font-size: 13px;
		line-height: 1.5;
		color: var(--faint);
	}
</style>
