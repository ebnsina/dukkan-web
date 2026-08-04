<script lang="ts">
	import { Section } from '$lib/ui';
	import DsBlock from '../DsBlock.svelte';

	const surfaces = [
		['paper', 'Page background'],
		['surface', 'Set-apart panels'],
		['ink', 'Primary text'],
		['muted', 'Secondary text'],
		['faint', 'Labels and metadata'],
		['rule', 'Hairline dividers'],
		['rule-strong', 'Borders with presence'],
		['rule-hover', 'A border answering the cursor'],
		['inverse-paper', 'An inverted ground — a toast, a dark band'],
		['inverse-ink', 'Text on that ground']
	];

	const brand = [
		['accent', 'Whatever acts: a solid button, a chosen option, a focused field'],
		['accent-ink', 'Text on a brand fill'],
		['accent-soft', 'The wash it sits on — a tinted row, a pressed key'],
		['accent-hover', 'Where a brand fill goes under the cursor'],
		['accent-on-inverse', 'The accent when the ground is inverted, so it runs opposite the theme']
	];

	const state = [
		['success', 'Done: paid, delivered'],
		['warning', 'Needs a person'],
		['danger', 'Money or stock at risk'],
		['info', 'Still moving']
	];

	const groups = [
		['Brand', brand],
		['Surfaces and text', surfaces],
		['State', state]
	] as const;
</script>

<Section
	id="palette"
	eyebrow="01 / Palette"
	heading="One indigo, and it marks what acts."
	lead="The brand is spent on the things a person can act on — a solid button, a checked box, the selected tab, the focused field, the current page — and nowhere else, so an accent on this screen is always something to press. Surfaces and text are the quiet part underneath, and a shop repaints them with its own theme. Hue beyond the brand belongs to state: green is done, amber needs a person, red is money or stock at risk, blue is still moving."
>
	<DsBlock
		label="Tokens"
		note="Every token flips once under :root[data-theme='dark']. A component asks for the name; the surface decides the value."
		flow="stack"
	>
		{#each groups as [name, tokens] (name)}
			<h3 class="group t-label">{name}</h3>
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
		{/each}
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
	.group {
		margin: 28px 0 10px;
		color: var(--faint);
	}

	.group:first-child {
		margin-top: 0;
	}

	.swatches {
		display: grid;
		gap: 1px;
		background: var(--rule);
		border: 1px solid var(--rule);
		border-radius: var(--r-tile);
		overflow: hidden;
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
		border-radius: var(--r-chip);
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
		border-radius: var(--r-tile);
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

		/* An odd last token takes the whole row, or the 1px grid shows through
		   as an empty grey cell beside it. */
		.swatches li:last-child:nth-child(odd) {
			grid-column: 1 / -1;
		}
	}
</style>
