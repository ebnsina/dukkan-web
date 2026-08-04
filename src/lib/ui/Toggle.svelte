<script lang="ts">
	interface Props {
		checked: boolean;
		label: string;
		description?: string;
		disabled?: boolean;
	}

	let { checked = $bindable(), label, description, disabled = false }: Props = $props();
</script>

<label class="toggle">
	<input type="checkbox" bind:checked {disabled} />
	<span class="track"></span>
	<span class="text">
		<span class="label">{label}</span>
		{#if description}<span class="hint">{description}</span>{/if}
	</span>
</label>

<style>
	.toggle {
		display: flex;
		align-items: flex-start;
		gap: 12px;
		cursor: pointer;
	}

	.toggle:has(input:disabled) {
		opacity: 0.5;
		cursor: not-allowed;
	}

	input {
		position: absolute;
		opacity: 0;
		width: 0;
		height: 0;
	}

	.track {
		position: relative;
		flex: none;
		width: 40px;
		height: 23px;
		margin-top: 1px;
		border-radius: var(--r-round);
		background: var(--surface);
		box-shadow: inset 0 0 0 1px var(--rule-strong);
		transition:
			background-color var(--dur-hover) var(--ease-out),
			box-shadow var(--dur-hover) var(--ease-out);
	}

	.track::after {
		content: '';
		position: absolute;
		top: 3px;
		left: 3px;
		width: 17px;
		height: 17px;
		border-radius: var(--r-round);
		background: var(--paper);
		transition: transform var(--dur-hover) var(--ease-out);
	}

	input:checked + .track {
		background: var(--inverse-paper);
		box-shadow: inset 0 0 0 1px transparent;
	}

	input:checked + .track::after {
		transform: translateX(17px);
		background: var(--inverse-ink);
	}

	input:focus-visible + .track {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}

	.text {
		display: flex;
		flex-direction: column;
		gap: 3px;
	}

	.label {
		font-size: 13px;
		font-weight: 600;
		color: var(--ink);
	}

	.hint {
		font-size: 12.5px;
		color: var(--faint);
	}
</style>
