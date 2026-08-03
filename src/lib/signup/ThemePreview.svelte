<script lang="ts">
	import type { ThemeLayout, ThemeTokens } from '$lib/api/types';

	interface Props {
		tokens: ThemeTokens;
		layout: ThemeLayout;
		name: string;
	}

	let { tokens, layout, name }: Props = $props();

	const items = ['Rice 5kg', 'Mustard oil', 'Red lentil', 'Tea leaf', 'Sugar 1kg', 'Salt'];

	// The arrangement is the design, as much as the colour is.
	const COLUMNS: Record<ThemeLayout, string> = {
		'grid-dense': 'repeat(3, minmax(0, 1fr))',
		'grid-roomy': 'repeat(2, minmax(0, 1fr))',
		editorial: 'repeat(2, minmax(0, 1fr))',
		list: 'minmax(0, 1fr)'
	};

	const RATIOS: Record<ThemeLayout, string> = {
		'grid-dense': '1 / 1',
		'grid-roomy': '4 / 5',
		editorial: '16 / 9',
		list: '1 / 1'
	};

	let shown = $derived(layout === 'editorial' ? items.slice(0, 3) : items);
	let wash = $derived(`color-mix(in srgb, ${tokens.accent} 14%, #ffffff)`);
</script>

<div class="shell" style="background: {tokens.surface}">
	<div class="bar">
		<span class="name" style="color: {tokens.accent}">{name || 'Your shop'}</span>
		<span class="pill" style="background: {tokens.accent}; color: {tokens['accent-ink']}">
			Basket
		</span>
	</div>

	<div class="grid" style="grid-template-columns: {COLUMNS[layout]}">
		{#each shown as item, index (item)}
			<div class="card" class:is-row={layout === 'list'} class:is-lead={layout === 'editorial' && index === 0}>
				<span class="art" style="background: {wash}; aspect-ratio: {RATIOS[layout]}"></span>
				<span class="copy">
					<span class="title" style="color: {tokens.accent}">{item}</span>
					<span class="price">&#2547;120</span>
				</span>
			</div>
		{/each}
	</div>
</div>

<style>
	.shell {
		display: flex;
		flex-direction: column;
		gap: 8px;
		padding: 12px;
		font-size: 9px;
		line-height: 1.35;
	}

	.bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
	}

	.name {
		font-weight: 700;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.pill {
		padding: 2px 6px;
		font-family: var(--font-mono);
		font-size: 8px;
		white-space: nowrap;
	}

	.grid {
		display: grid;
		gap: 6px;
	}

	.card {
		display: flex;
		flex-direction: column;
		background: #ffffff;
		min-width: 0;
	}

	.is-row {
		flex-direction: row;
		align-items: center;
		gap: 6px;
		padding: 4px;
	}

	.is-lead {
		grid-column: span 2;
	}

	.art {
		display: block;
		width: 100%;
	}

	.is-row .art {
		width: 22px;
		flex-shrink: 0;
	}

	.copy {
		display: flex;
		min-width: 0;
		flex: 1;
		flex-direction: column;
		padding: 4px;
	}

	.is-row .copy {
		padding: 0;
	}

	.title {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.price {
		font-family: var(--font-mono);
		font-size: 8px;
		opacity: 0.6;
	}
</style>
