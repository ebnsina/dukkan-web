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
	<!-- A checkbox is on or off too, but a switch takes effect the moment it
	     moves rather than when a form is submitted, and the role says so. -->
	<input type="checkbox" role="switch" bind:checked {disabled} />
	<span class="track">
		<span class="knob"></span>
	</span>
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

	/* Disabled has to stay readable: at half strength an off switch on a pale
	   track disappeared into the card behind it. */
	.toggle:has(input:disabled) {
		opacity: 0.65;
		cursor: not-allowed;
	}

	input {
		position: absolute;
		opacity: 0;
		width: 0;
		height: 0;
	}

	/* Squared like every other control — the shape that says on or off is the
	   knob's position, not a pill. */
	.track {
		position: relative;
		flex: none;
		width: 42px;
		height: 24px;
		margin-top: 1px;
		border-radius: var(--r-tile);
		background: var(--surface);
		box-shadow: inset 0 0 0 1px var(--rule-strong);
		transition:
			background-color var(--dur-hover) var(--ease-out),
			box-shadow var(--dur-hover) var(--ease-out);
	}

	/* The knob is the whole story — where it sits is the state. A tick inside
	   it says the same thing twice and turns a switch into a checkbox. */
	.knob {
		position: absolute;
		top: 3px;
		left: 3px;
		width: 18px;
		height: 18px;
		border-radius: var(--r-chip);
		background: var(--paper);
		/* Off, the knob is paper on a near-paper track, so it carries its own
		   hairline. On the brand fill it needs none. */
		box-shadow: 0 0 0 1px var(--rule-strong);
		transition:
			transform var(--dur-enter) var(--ease-out),
			box-shadow var(--dur-hover) var(--ease-out);
	}

	input:checked + .track {
		background: var(--accent);
		box-shadow: inset 0 0 0 1px transparent;
	}

	input:checked + .track .knob {
		transform: translateX(18px);
		box-shadow: none;
	}

	input:focus-visible + .track {
		outline: 1.5px dashed var(--accent);
		outline-offset: 3px;
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

	@media (prefers-reduced-motion: reduce) {
		.knob {
			transition: none;
		}
	}
</style>
