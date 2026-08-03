<script lang="ts">
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { PlusSignIcon } from '@hugeicons/core-free-icons';

	interface Props {
		question: string;
		answer: string;
	}

	let { question, answer }: Props = $props();
</script>

<details>
	<summary>
		<span class="q">{question}</span>
		<span class="marker" aria-hidden="true">
			<HugeiconsIcon icon={PlusSignIcon} size={14} strokeWidth={1.6} />
		</span>
	</summary>
	<p class="a">{answer}</p>
</details>

<style>
	details {
		border-bottom: 1px solid var(--rule);
	}

	summary {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 24px;
		padding-block: 22px;
		cursor: pointer;
		list-style: none;
	}

	summary::-webkit-details-marker {
		display: none;
	}

	.q {
		font-size: var(--size-body-lg);
		font-weight: 600;
		line-height: 1.35;
		letter-spacing: -0.012em;
	}

	/* A bordered box means a control. */
	.marker {
		display: grid;
		place-items: center;
		width: 26px;
		height: 26px;
		flex-shrink: 0;
		border: 1px solid var(--rule);
		color: var(--muted);
		transition: transform var(--dur-hover) var(--ease-out);
	}

	details[open] .marker {
		transform: rotate(45deg);
	}

	.a {
		padding-bottom: 24px;
		font-size: var(--size-body);
		line-height: 1.65;
		color: var(--muted);
		max-width: var(--measure);
	}
</style>
