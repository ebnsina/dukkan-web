<script lang="ts">
	import { Section, Button } from '$lib/ui';
	import DsBlock from '../DsBlock.svelte';

	const curves = [
		['--ease-out', 'cubic-bezier(.23, 1, .32, 1)', 'Anything entering or leaving'],
		['--ease-in-out', 'cubic-bezier(.77, 0, .175, 1)', 'Something already on screen, moving'],
		['--ease-drawer', 'cubic-bezier(.32, .72, 0, 1)', 'A panel coming off an edge']
	];

	const durations = [
		['--dur-press', '120ms', 'The press itself'],
		['--dur-hover', '150ms', 'Colour and border under the cursor'],
		['--dur-enter', '200ms', 'Dropdowns, tooltips, cards'],
		['--dur-overlay', '280ms', 'Modals and drawers']
	];

	let run = $state(false);
</script>

<Section
	id="motion"
	eyebrow="04 / Motion"
	heading="Fast, and out of the way."
	lead="Motion is here to say a thing was heard and to keep a change from being jarring — never to decorate. The built-in CSS curves are too weak to read as deliberate, so these are the stronger variants, and ease-in appears nowhere: it holds still at the exact moment a person is watching hardest, which is what makes an interface feel slow when it is not."
>
	<DsBlock
		label="Curves"
		note="Defined once, in tokens.css. A component never writes its own."
		flow="stack"
	>
		<ul class="rows">
			{#each curves as [token, value, use] (token)}
				<li>
					<span class="t-mono key">{token}</span>
					<span class="t-mono val">{value}</span>
					<span class="use">{use}</span>
				</li>
			{/each}
		</ul>
	</DsBlock>

	<DsBlock label="Durations" note="Anything under the hand stays below 300ms." flow="stack">
		<ul class="rows">
			{#each durations as [token, value, use] (token)}
				<li>
					<span class="t-mono key">{token}</span>
					<span class="t-mono val">{value}</span>
					<span class="use">{use}</span>
				</li>
			{/each}
		</ul>
	</DsBlock>

	<DsBlock
		label="Feedback"
		note="Every control answers a press before it answers anything else. Nothing enters from nothing: 0.96 and opacity, never zero size."
	>
		<Button onclick={() => (run = !run)}>Press me</Button>
		<span class="demo" class:is-on={run} aria-hidden="true"></span>
	</DsBlock>

	<DsBlock
		label="Reduced motion"
		note="Every animation has a prefers-reduced-motion branch, and each one lands on the finished state — motion is never what makes something readable."
		flow="stack"
	>
		<p class="note">
			Turn it on in the system settings and this page still works exactly the same. Nothing here
			is load-bearing.
		</p>
	</DsBlock>
</Section>

<style>
	.rows {
		display: grid;
		gap: 1px;
		background: var(--rule);
		border: 1px solid var(--rule);
		border-radius: var(--r-tile);
		overflow: hidden;
	}

	.rows li {
		display: grid;
		gap: 4px;
		padding: 14px 16px;
		background: var(--paper);
	}

	.key {
		font-size: 12px;
		color: var(--ink);
	}

	.val {
		font-size: 12px;
		color: var(--accent);
	}

	.use {
		font-size: 12.5px;
		color: var(--faint);
	}

	.demo {
		display: block;
		width: 46px;
		height: 46px;
		border-radius: var(--r-control);
		background: var(--accent-soft);
		transition:
			transform var(--dur-enter) var(--ease-out),
			background-color var(--dur-enter) var(--ease-out);
	}

	.is-on {
		transform: translateX(24px) scale(0.94);
		background: var(--accent);
	}

	.note {
		font-size: 14px;
		line-height: 1.65;
		color: var(--muted);
	}

	@media (prefers-reduced-motion: reduce) {
		.demo {
			transition: none;
		}
	}

	@media (min-width: 720px) {
		.rows li {
			grid-template-columns: 160px 220px minmax(0, 1fr);
			align-items: baseline;
			gap: 16px;
		}
	}
</style>
