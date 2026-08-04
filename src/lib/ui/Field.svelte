<script lang="ts">
	import type { Snippet } from 'svelte';

	export interface FieldControl {
		id: string;
		'aria-describedby': string | undefined;
		'aria-invalid': 'true' | undefined;
		invalid: boolean;
	}

	interface Props {
		label?: string;
		hint?: string;
		error?: string;
		required?: boolean;
		control: Snippet<[FieldControl]>;
	}

	let { label, hint, error, required = false, control }: Props = $props();

	const uid = $props.id();
	const id = `field-${uid}`;
	let describedBy = $derived(
		[hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(' ') ||
			undefined
	);
</script>

<div class="field">
	{#if label}
		<label class="t-label" for={id}>
			{label}{#if required}<span class="req">Required</span>{/if}
		</label>
	{/if}

	{@render control({
		id,
		'aria-describedby': describedBy,
		'aria-invalid': error ? 'true' : undefined,
		invalid: Boolean(error)
	})}

	{#if hint && !error}
		<p id="{id}-hint" class="note">{hint}</p>
	{/if}
	{#if error}
		<p id="{id}-error" class="error">{error}</p>
	{/if}
</div>

<style>
	.field {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	label {
		color: var(--faint);
	}

	.req {
		margin-left: 10px;
		opacity: 0.6;
	}

	.note {
		font-size: 13px;
		line-height: 1.5;
		color: var(--faint);
	}

	/* An error is a sentence telling someone what to do next, not an alarm.
	   The colour is enough — the field above it is already outlined in the
	   same hue, and a rule beside the words marks that edge twice. */
	.error {
		font-size: 12.5px;
		line-height: 1.5;
		color: var(--danger);
	}
</style>
