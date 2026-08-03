<script lang="ts">
	import { Section } from '$lib/ui';
	import DsBlock from '../DsBlock.svelte';

	const layout = [
		['--gutter', 'clamp(20px, 4.4vw, 56px)', 'Horizontal page padding'],
		['--measure', '62ch', 'Longest comfortable line'],
		['--rail', '152px', 'Left label column above 900px'],
		['--container', '1240px', 'Every section, centred'],
		['--section-y', 'clamp(64px, 9vw, 104px)', 'Vertical section rhythm']
	];

	const steps = [4, 8, 12, 16, 24, 32, 48, 64, 104];
</script>

<Section id="structure" label="03 / Structure" rule>
	<h2 class="t-heading">The rail grid is the signature.</h2>
	<p class="lead t-lead">
		Above 900px every section is two columns: a 152px label rail and the content. The labels sit
		quiet until you hover the section, or tab into it. Below 900px they stack and stay visible. Move
		your pointer over this section to see the label at the left appear.
	</p>

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
		note="Zero, everywhere. Rounding one thing would make the rest look unfinished."
	>
		<div class="corner"><span class="t-mono">0px</span></div>
		<p class="corner-note">
			There is no radius token, because there is no radius. Not on buttons, inputs, cards, images or
			the header.
		</p>
	</DsBlock>
</Section>

<style>
	.lead {
		margin-top: 24px;
		color: var(--muted);
	}

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

	.corner {
		display: grid;
		place-items: center;
		width: 96px;
		height: 96px;
		border: 1px solid var(--rule-strong);
		font-size: 11px;
		color: var(--faint);
	}

	.corner-note {
		font-size: 14px;
		line-height: 1.6;
		color: var(--muted);
		max-width: 40ch;
	}

	@media (min-width: 720px) {
		.tokens > div {
			grid-template-columns: 160px 220px minmax(0, 1fr);
			align-items: baseline;
		}
	}
</style>
