<script lang="ts">
	import { Section } from '$lib/ui';
	import DsBlock from '../DsBlock.svelte';

	const layout = [
		['--gutter', 'clamp(20px, 4.4vw, 56px)', 'Horizontal page padding'],
		['--measure', '62ch', 'Longest comfortable line'],
		['--container', '1240px', 'Every section, centred'],
		['--section-y', 'clamp(64px, 9vw, 104px)', 'Vertical rhythm between sections']
	];

	const steps = [4, 8, 12, 16, 24, 32, 48, 64, 104];

	const radii: [string, string, string][] = [
		['r-card', '20px', 'Cards and dialogs'],
		['r-panel', '16px', 'Panels inside a card'],
		['r-control', '12px', 'Anything you press or type into'],
		['r-tile', '8px', 'Small square tiles'],
		['r-chip', '6px', 'Chips and badges']
	];
</script>

<Section
	id="structure"
	eyebrow="03 / Structure"
	heading="A centred container and a lot of air."
	lead="Every section is the same 1240px container with a fluid gutter. Space does the separating; a hairline only appears where two things would otherwise be confused, and never on the same edge as a surface change."
	rule
>
	<DsBlock label="Layout tokens" flow="stack">
		<dl class="tokens">
			{#each layout as [token, value, use] (token)}
				<div>
					<dt class="t-mono">{token}</dt>
					<dd class="value t-mono">{value}</dd>
					<dd class="use">{use}</dd>
				</div>
			{/each}
		</dl>
	</DsBlock>

	<DsBlock
		label="Spacing"
		note="A 4px unit. Space is the first tool; a rule is the last."
		flow="stack"
	>
		<div class="steps">
			{#each steps as step (step)}
				<div class="step">
					<span class="step-label t-mono">{step}</span>
					<span class="bar" style="width: {step}px"></span>
				</div>
			{/each}
		</div>
	</DsBlock>

	<DsBlock
		label="Corners"
		note="One step per size of box, so a control and the card holding it are never the same corner."
	>
		<ul class="corners">
			{#each radii as [token, px, use] (token)}
				<li>
					<span class="corner" style="border-radius: var(--{token})"></span>
					<span class="corner-meta">
						<span class="t-mono">--{token} · {px}</span>
						<span class="corner-use">{use}</span>
					</span>
				</li>
			{/each}
		</ul>
	</DsBlock>
</Section>

<style>
	.tokens > div {
		display: grid;
		gap: 4px 24px;
		padding-block: 14px;
		border-bottom: 1px solid var(--rule);
	}

	.tokens dt {
		font-size: 12px;
		color: var(--ink);
	}

	.value {
		font-size: 12px;
		color: var(--muted);
	}

	.use {
		font-size: 12px;
		color: var(--faint);
	}

	.step {
		display: flex;
		align-items: center;
		gap: 20px;
	}

	.step + .step {
		margin-top: 8px;
	}

	.step-label {
		width: 44px;
		font-size: 11px;
		color: var(--faint);
		text-align: right;
	}

	.bar {
		height: 10px;
		background: var(--ink);
	}

	.corners {
		display: flex;
		flex-wrap: wrap;
		gap: 24px;
	}

	.corners li {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.corner {
		width: 84px;
		height: 84px;
		border: 1px solid var(--rule-strong);
		background: var(--surface);
	}

	.corner-meta {
		display: flex;
		flex-direction: column;
		gap: 2px;
		font-size: 11px;
	}

	.corner-use {
		font-size: 12px;
		color: var(--muted);
	}

	@media (min-width: 720px) {
		.tokens > div {
			grid-template-columns: 160px 220px minmax(0, 1fr);
			align-items: baseline;
		}
	}
</style>
