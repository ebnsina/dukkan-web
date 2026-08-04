<script lang="ts">
	/* A hairline where space alone is not enough — and a label on it when the
	   break is a change of subject rather than a pause. */
	import { cn } from '$lib/utils/cn';

	interface Props {
		label?: string;
		class?: string;
	}

	let { label, class: className }: Props = $props();
</script>

{#if label}
	<div class={cn('divider is-labelled', className)} role="separator" aria-label={label}>
		<span class="line"></span>
		<span class="label" aria-hidden="true">{label}</span>
		<span class="line"></span>
	</div>
{:else}
	<hr class={cn('divider', className)} />
{/if}

<style>
	/* Dashed, because this line divides content inside a box. A solid rule is
	   structure — the edge of the box itself, or two cells that touch — and
	   using the same stroke for both makes a pause look like a boundary. */
	hr.divider {
		height: 0;
		margin: 0;
		border: 0;
		border-top: 1px dashed var(--rule-strong);
	}

	.is-labelled {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.line {
		flex: 1;
		height: 0;
		border-top: 1px dashed var(--rule-strong);
	}

	.label {
		font-family: var(--font-mono);
		font-size: 10.5px;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--faint);
	}
</style>
