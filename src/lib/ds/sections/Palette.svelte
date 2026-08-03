<script lang="ts">
	import { Section } from '$lib/ui';
	import DsBlock from '../DsBlock.svelte';

	const tokens = [
		['paper', 'Page background'],
		['surface', 'Set-apart panels'],
		['ink', 'Primary text'],
		['muted', 'Secondary text'],
		['faint', 'Labels and metadata'],
		['rule', 'Hairline dividers'],
		['rule-strong', 'Borders with presence'],
		['inverse-paper', 'Solid button background'],
		['inverse-ink', 'Text on a solid button']
	];
</script>

<Section id="palette" label="01 / Palette">
	<h2 class="t-heading">One palette, and it is greyscale.</h2>
	<p class="lead t-lead">
		There is no accent colour, and no colour for state either. Nothing here carries a hue, including
		errors, warnings and success. When something has to stand out it gets more weight, more size, or
		more space around it.
	</p>

	<DsBlock
		label="Tokens"
		note="Every token flips once under :root[data-theme='dark']."
		flow="stack"
	>
		<ul class="swatches">
			{#each tokens as [token, use] (token)}
				<li>
					<span class="chip" style="background: var(--{token})"></span>
					<span class="meta">
						<span class="name t-mono">--{token}</span>
						<span class="use">{use}</span>
					</span>
				</li>
			{/each}
		</ul>
	</DsBlock>

	<DsBlock
		label="Depth"
		note="No shadows. Depth is a change of surface, and an edge is marked once."
	>
		<div class="depth on-paper"><span class="t-mono">--paper</span></div>
		<div class="depth on-surface"><span class="t-mono">--surface</span></div>
		<div class="depth on-inverse"><span class="t-mono">--inverse-paper</span></div>
	</DsBlock>
</Section>

<style>
	.lead {
		margin-top: 24px;
		color: var(--muted);
	}

	.swatches {
		display: grid;
		gap: 1px;
		background: var(--rule);
		border: 1px solid var(--rule);
	}

	.swatches li {
		display: flex;
		align-items: center;
		gap: 16px;
		padding: 14px 16px;
		background: var(--paper);
	}

	.chip {
		width: 44px;
		height: 30px;
		flex-shrink: 0;
		border: 1px solid var(--rule-strong);
	}

	.meta {
		display: flex;
		flex-direction: column;
		gap: 3px;
	}

	.name {
		font-size: 12px;
	}

	.use {
		font-size: 12px;
		color: var(--faint);
	}

	.depth {
		display: grid;
		place-items: center;
		width: 150px;
		height: 88px;
		font-size: 11px;
		letter-spacing: 0.08em;
	}

	.on-paper {
		background: var(--paper);
		border: 1px solid var(--rule);
		color: var(--muted);
	}

	.on-surface {
		background: var(--surface);
		color: var(--muted);
	}

	.on-inverse {
		background: var(--inverse-paper);
		color: var(--inverse-ink);
	}

	@media (min-width: 720px) {
		.swatches {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
</style>
