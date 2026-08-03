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
			{label}{#if required}<span aria-hidden="true"> — required</span>{/if}
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

	.note {
		font-size: 13px;
		line-height: 1.5;
		color: var(--faint);
	}

	/* No hue for errors. Weight and a heavier rule carry the state. */
	.error {
		font-size: 13px;
		line-height: 1.5;
		font-weight: 600;
		color: var(--ink);
		padding-left: 10px;
		border-left: 2px solid var(--ink);
	}
</style>
