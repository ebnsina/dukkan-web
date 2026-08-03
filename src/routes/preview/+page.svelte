<script lang="ts">
	/* A design study, not a screen of the product: six dashboards on the same
	   data, so the choice is made by looking rather than by describing. */
	import DirectionA from '$lib/admin/preview/DirectionA.svelte';
	import DirectionB from '$lib/admin/preview/DirectionB.svelte';
	import DirectionC from '$lib/admin/preview/DirectionC.svelte';
	import DirectionD from '$lib/admin/preview/DirectionD.svelte';
	import DirectionE from '$lib/admin/preview/DirectionE.svelte';
	import DirectionF from '$lib/admin/preview/DirectionF.svelte';
	import { theme } from '$lib/theme/theme.svelte';

	const directions = [
		{
			key: 'a',
			name: 'Product console',
			note: 'Left rail, compact type, bordered cards. Quiet enough to live in.'
		},
		{
			key: 'b',
			name: 'Workspace',
			note: 'Roomier, softer, with a chart. Reads as a place, not a queue.'
		},
		{
			key: 'c',
			name: 'Operations console',
			note: 'Everything on one screen. Built for someone who never closes it.'
		},
		{
			key: 'd',
			name: 'Soft cards',
			note: 'White cards on warm grey, round arrows, grouped nav. The friendliest of the six.'
		},
		{
			key: 'e',
			name: 'Ambient',
			note: 'A tinted wash behind glass, a greeting, and the day offered as things to tap.'
		},
		{
			key: 'f',
			name: 'Terminal',
			note: 'Dark, icon rail, movement against last week, and a chart you read a value off.'
		}
	];

	let picked = $state('a');
</script>

<svelte:head>
	<title>Dashboard directions</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="study">
	<header class="bar">
		<div class="lead">
			<h1>Dashboard directions</h1>
			<p>Same shop, same data, six design languages.</p>
		</div>

		<div class="picker" role="tablist" aria-label="Design directions">
			{#each directions as d (d.key)}
				<button
					role="tab"
					aria-selected={picked === d.key}
					class:on={picked === d.key}
					onclick={() => (picked = d.key)}
				>
					<span class="letter">{d.key.toUpperCase()}</span>
					{d.name}
				</button>
			{/each}
		</div>

		<button class="mode" onclick={() => theme.toggle()}>
			{theme.resolved === 'dark' ? 'Light' : 'Dark'}
		</button>
	</header>

	<p class="note">{directions.find((d) => d.key === picked)?.note}</p>

	<div class="frame">
		{#if picked === 'a'}
			<DirectionA />
		{:else if picked === 'b'}
			<DirectionB />
		{:else if picked === 'c'}
			<DirectionC />
		{:else if picked === 'd'}
			<DirectionD />
		{:else if picked === 'e'}
			<DirectionE />
		{:else}
			<DirectionF />
		{/if}
	</div>
</div>

<style>
	.study {
		min-height: 100dvh;
		background: var(--surface);
		padding: 18px;
	}

	.bar {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 18px;
		margin-bottom: 6px;
	}

	.lead {
		flex: 1;
		min-width: 200px;
	}

	h1 {
		margin: 0;
		font-size: 17px;
		font-weight: 600;
		letter-spacing: -0.015em;
		color: var(--ink);
	}

	.lead p {
		margin: 2px 0 0;
		font-size: 13px;
		color: var(--muted);
	}

	.picker {
		display: flex;
		flex-wrap: wrap;
		gap: 2px;
		padding: 3px;
		border-radius: 9px;
		background: var(--paper);
		border: 1px solid var(--rule-strong);
	}

	.picker button {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 7px 13px;
		border: 0;
		border-radius: 6px;
		background: transparent;
		color: var(--muted);
		font: inherit;
		font-size: 13px;
		cursor: pointer;
	}

	.picker button.on {
		background: var(--ink);
		color: var(--paper);
		font-weight: 600;
	}

	.letter {
		font-family: var(--font-mono);
		font-size: 11px;
		opacity: 0.6;
	}

	.mode {
		padding: 7px 13px;
		border: 1px solid var(--rule-strong);
		border-radius: 8px;
		background: var(--paper);
		color: var(--ink);
		font: inherit;
		font-size: 13px;
		cursor: pointer;
	}

	.note {
		margin: 0 0 12px;
		font-size: 13px;
		color: var(--muted);
	}

	/* The frame is a window onto the design, so its own chrome stays out of
	   the way of the thing being judged. */
	.frame {
		border-radius: 10px;
		border: 1px solid var(--rule-strong);
		overflow: hidden;
		background: var(--paper);
	}
</style>
