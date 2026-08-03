<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface Props extends Omit<HTMLInputAttributes, 'type' | 'size'> {
		label?: string;
		description?: string;
		value: string;
		group?: string;
	}

	let { label, description, value, group = $bindable(''), disabled, ...rest }: Props = $props();

	const uid = $props.id();
</script>

<div class="row" class:is-disabled={disabled}>
	<input id={uid} type="radio" {value} bind:group {disabled} {...rest} />
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

	/* Square, like everything else. Selection is a filled centre, not a dot. */
	input {
		width: 18px;
		height: 18px;
		flex-shrink: 0;
		margin-top: 2px;
		appearance: none;
		border: 1px solid var(--rule-strong);
		background: var(--paper);
		cursor: pointer;
		transition: border-color var(--dur-hover) var(--ease-out);
	}

	input:hover {
		border-color: var(--muted);
	}

	input:checked {
		border-color: var(--inverse-paper);
		border-width: 5px;
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
