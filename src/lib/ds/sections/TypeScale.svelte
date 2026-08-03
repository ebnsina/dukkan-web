<script lang="ts">
	import { Section } from '$lib/ui';
	import DsBlock from '../DsBlock.svelte';
	import { formatCurrency, formatCompact, formatDateTime, formatPercent } from '$lib/utils/format';

	const roles = [
		['t-display', 'Hero heading', 'clamp(40px, 7.2vw, 92px) / 700 / wdth 86 / -0.038em'],
		['t-title', 'Page title', 'clamp(34px, 5.4vw, 62px) / 700 / wdth 86 / -0.032em'],
		['t-heading', 'Section heading', 'clamp(24px, 3.2vw, 36px) / 700 / wdth 88 / -0.026em'],
		['t-sub', 'Sub heading', 'clamp(19px, 2.1vw, 23px) / 700 / wdth 92 / -0.022em']
	];

	const widths = [125, 110, 100, 92, 86, 75];

	const figures = [
		['Money', formatCurrency(184250.5)],
		['Short form', formatCompact(1284000)],
		['Share', formatPercent(0.0342)],
		['Date and time', formatDateTime('2026-03-14T09:30:00Z')],
		['Order number', 'DK-10482-BD']
	];
</script>

<Section
	id="type"
	eyebrow="02 / Type"
	heading="One typeface, worked hard."
	lead="Mona Sans carries everything. Its width axis does the job a second display family usually would, so headings narrow to 86% while body copy stays at its natural width. Geist Mono is kept for numbers, labels and anything tabular."
	rule
>
	<DsBlock label="Roles" flow="stack">
		<div class="roles">
			{#each roles as [cls, name, spec] (cls)}
				<div class="role">
					<div class="role-meta">
						<span class="role-name t-mono">.{cls}</span>
						<span class="role-spec">{spec}</span>
					</div>
					<p class={cls}>{name}</p>
				</div>
			{/each}
		</div>
	</DsBlock>

	<DsBlock
		label="Width axis"
		note="The same word, the same weight, six widths. This is the axis the system leans on."
		flow="stack"
	>
		<div class="widths">
			{#each widths as width (width)}
				<div class="width-row">
					<span class="width-label t-mono">wdth {width}</span>
					<span
						class="width-sample"
						style="font-variation-settings: 'wdth' {width}; font-stretch: {width}%"
						>Marketplace</span
					>
				</div>
			{/each}
		</div>
	</DsBlock>

	<DsBlock label="Body and labels" flow="stack">
		<div class="prose">
			<p class="t-lead">
				Body large, 17px on a 1.6 line, held to a 62ch measure so a line never outruns the eye.
			</p>
			<p class="muted t-body">
				Body, 15px, the default for everything that is not a heading. Emphasis inside a heading uses
				<strong>a lighter weight at full ink</strong>, never a lighter colour.
			</p>
			<p class="faint t-label">Rail label &middot; Geist Mono 10.5px &middot; 0.16em</p>
			<p class="faint t-button">Button label &middot; Geist Mono 11px &middot; 0.12em</p>
		</div>
	</DsBlock>

	<DsBlock
		label="Numbers"
		note="Tabular figures wherever a number lines up in a column."
		flow="stack"
	>
		<dl class="figures">
			{#each figures as [label, value] (label)}
				<div>
					<dt>{label}</dt>
					<dd class="t-mono">{value}</dd>
				</div>
			{/each}
		</dl>
		<p class="glyphs t-mono">0123456789 &middot; ILil1 &middot; O0 &middot; {'{ } [ ] ( ) < >'}</p>
	</DsBlock>
</Section>

<style>
	.role + .role {
		margin-top: 40px;
		padding-top: 32px;
		border-top: 1px solid var(--rule);
	}

	.role-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 6px 20px;
		margin-bottom: 18px;
	}

	.role-name {
		font-size: 11px;
		color: var(--ink);
	}

	.role-spec {
		font-family: var(--font-mono);
		font-size: 11px;
		color: var(--faint);
	}

	.width-row {
		display: flex;
		align-items: baseline;
		gap: 24px;
	}

	.width-row + .width-row {
		margin-top: 10px;
	}

	.width-label {
		width: 76px;
		flex-shrink: 0;
		font-size: 11px;
		letter-spacing: 0.12em;
		color: var(--faint);
	}

	.width-sample {
		font-size: clamp(28px, 5vw, 46px);
		font-weight: 700;
		line-height: 1.1;
		letter-spacing: -0.03em;
	}

	.prose > * + * {
		margin-top: 20px;
	}

	.muted {
		color: var(--muted);
	}

	.faint {
		color: var(--faint);
	}

	strong {
		font-weight: 300;
		color: var(--ink);
	}

	.figures > div {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 24px;
		padding-block: 12px;
		border-bottom: 1px solid var(--rule);
		max-width: 46ch;
	}

	.figures dt {
		font-size: 14px;
		color: var(--muted);
	}

	.figures dd {
		font-size: 14px;
		font-variant-numeric: tabular-nums;
	}

	.glyphs {
		margin-top: 20px;
		font-size: 14px;
		color: var(--faint);
	}
</style>
