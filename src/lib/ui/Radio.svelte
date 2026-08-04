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
	<span class="box">
		<input id={uid} type="radio" {value} bind:group {disabled} {...rest} />
		<span class="mark" aria-hidden="true"></span>
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

	/* Round, because that is what a radio is. The square-everywhere rule is
	   about boxes the page draws; a control whose shape is how people know
	   only one can be chosen is not one of them. */
	input {
		position: absolute;
		inset: 0;
		appearance: none;
		border: 1px solid var(--rule-strong);
		border-radius: var(--r-round);
		background: var(--paper);
		cursor: pointer;
		transition:
			border-color var(--dur-hover) var(--ease-out),
			background-color var(--dur-hover) var(--ease-out);
	}

	input:hover {
		border-color: var(--rule-hover);
	}

	/* Chosen is an outline and a small centre, not a filled box — a checkbox is
	   the filled one, and two solid marks side by side read as the same
	   control. */
	input:checked {
		border-color: var(--accent);
		background: var(--paper);
	}

	input:focus-visible {
		outline: 1.5px dashed var(--accent);
		outline-offset: 3px;
	}

	/* The dot grows out of the middle as the outline lands. */
	.mark {
		position: relative;
		width: 8px;
		height: 8px;
		border-radius: var(--r-round);
		background: var(--accent);
		opacity: 0;
		transform: scale(0.3);
		pointer-events: none;
		transition:
			opacity var(--dur-hover) var(--ease-out),
			transform var(--dur-hover) var(--ease-out);
	}

	input:checked ~ .mark {
		opacity: 1;
		transform: scale(1);
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

	@media (prefers-reduced-motion: reduce) {
		.mark {
			transition: none;
			transform: none;
		}
	}
</style>
