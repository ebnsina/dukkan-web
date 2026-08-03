<script lang="ts">
	import type { Snippet } from 'svelte';
	import { reveal } from '$lib/motion/reveal';

	interface Props {
		id?: string;
		heading: string;
		note?: string;
		actions: Snippet;
	}

	let { id, heading, note, actions }: Props = $props();
</script>

<!-- No border. The surface change is already the edge. -->
<section {id} class="band" {@attach reveal()}>
	<div class="inner container-page">
		<h2 class="t-heading">{heading}</h2>
		<div class="actions">{@render actions()}</div>
		{#if note}<p class="note t-label">{note}</p>{/if}
	</div>
</section>

<style>
	.band {
		background-color: var(--surface);
		padding-block: clamp(64px, 9vw, 112px);
		scroll-margin-top: 80px;
	}

	.inner {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 32px;
	}

	.t-heading {
		max-width: 20ch;
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
	}

	.note {
		color: var(--faint);
	}
</style>
