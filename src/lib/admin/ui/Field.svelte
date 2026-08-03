<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		label: string;
		/** Passed to the control so the label, hint and error all point at it. */
		id: string;
		required?: boolean;
		hint?: string;
		error?: string;
		children: Snippet<[{ id: string; 'aria-describedby'?: string; 'aria-invalid'?: 'true' }]>;
	}

	let { label, id, required = false, hint, error, children }: Props = $props();

	const describedBy = $derived(
		[hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(' ') ||
			undefined
	);
</script>

<div class="dk-field">
	<label class="dk-label" for={id}>
		{label}{#if required}<span class="dk-req" aria-hidden="true"> *</span>{/if}
	</label>
	{@render children({
		id,
		'aria-describedby': describedBy,
		'aria-invalid': error ? 'true' : undefined
	})}
	{#if hint}<span class="dk-hint" id="{id}-hint">{hint}</span>{/if}
	{#if error}<span class="dk-error" id="{id}-error">{error}</span>{/if}
</div>
