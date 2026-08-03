<script lang="ts">
	interface Props {
		checked?: boolean;
		disabled?: boolean;
		label?: string;
		description?: string;
		onchange?: (checked: boolean) => void;
	}

	let {
		checked = $bindable(false),
		disabled = false,
		label,
		description,
		onchange
	}: Props = $props();

	const uid = $props.id();

	function toggle() {
		if (disabled) return;
		checked = !checked;
		onchange?.(checked);
	}
</script>

<div class="row" class:is-disabled={disabled}>
	<button
		id={uid}
		type="button"
		role="switch"
		aria-checked={checked}
		aria-label={label ? undefined : 'Toggle'}
		{disabled}
		onclick={toggle}
		class="track"
	>
		<span class="knob"></span>
	</button>

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

	.track {
		position: relative;
		width: 38px;
		height: 20px;
		flex-shrink: 0;
		margin-top: 1px;
		border: 1px solid var(--rule-strong);
		background: var(--paper);
		cursor: pointer;
		transition:
			background-color var(--dur-hover) var(--ease-out),
			border-color var(--dur-hover) var(--ease-out);
	}

	.track[aria-checked='true'] {
		background: var(--inverse-paper);
		border-color: var(--inverse-paper);
	}

	.knob {
		position: absolute;
		top: 2px;
		left: 2px;
		width: 14px;
		height: 14px;
		background: var(--muted);
		transition:
			transform var(--dur-hover) var(--ease-out),
			background-color var(--dur-hover) var(--ease-out);
	}

	.track[aria-checked='true'] .knob {
		transform: translateX(18px);
		background: var(--inverse-ink);
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
