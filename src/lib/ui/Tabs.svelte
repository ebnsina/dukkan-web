<script lang="ts">
	import type { Snippet } from 'svelte';

	export interface TabItem {
		value: string;
		label: string;
		disabled?: boolean;
	}

	interface Props {
		items: TabItem[];
		value?: string;
		panel: Snippet<[string]>;
	}

	let { items, value = $bindable(items[0]?.value ?? ''), panel }: Props = $props();

	const uid = $props.id();
	let list = $state<HTMLDivElement | null>(null);

	function focusTab(index: number) {
		const enabled = items.filter((item) => !item.disabled);
		const next = enabled[(index + enabled.length) % enabled.length];
		if (!next) return;
		value = next.value;
		list?.querySelector<HTMLButtonElement>(`#${uid}-tab-${CSS.escape(next.value)}`)?.focus();
	}

	function onkeydown(event: KeyboardEvent) {
		const enabled = items.filter((item) => !item.disabled);
		const current = enabled.findIndex((item) => item.value === value);
		if (event.key === 'ArrowRight') focusTab(current + 1);
		else if (event.key === 'ArrowLeft') focusTab(current - 1);
		else if (event.key === 'Home') focusTab(0);
		else if (event.key === 'End') focusTab(enabled.length - 1);
		else return;
		event.preventDefault();
	}
</script>

<div class="tabs">
	<div bind:this={list} role="tablist" tabindex={-1} {onkeydown} class="list">
		{#each items as item (item.value)}
			<button
				id="{uid}-tab-{item.value}"
				role="tab"
				type="button"
				class="tab t-button"
				aria-selected={value === item.value}
				aria-controls="{uid}-panel"
				tabindex={value === item.value ? 0 : -1}
				disabled={item.disabled}
				onclick={() => (value = item.value)}
			>
				{item.label}
			</button>
		{/each}
	</div>

	<div id="{uid}-panel" role="tabpanel" tabindex="0" class="panel">
		{@render panel(value)}
	</div>
</div>

<style>
	.list {
		display: flex;
		gap: 28px;
		border-bottom: 1px solid var(--rule);
		overflow-x: auto;
	}

	.tab {
		position: relative;
		padding-block: 14px;
		background: none;
		border: none;
		color: var(--faint);
		cursor: pointer;
		white-space: nowrap;
		transition: color var(--dur-hover) var(--ease-out);
	}

	.tab:hover {
		color: var(--muted);
	}

	.tab[aria-selected='true'] {
		color: var(--ink);
	}

	.tab[aria-selected='true']::after {
		content: '';
		position: absolute;
		inset-inline: 0;
		bottom: -1px;
		height: 1px;
		background: var(--ink);
	}

	.tab:disabled {
		opacity: 0.35;
		cursor: not-allowed;
	}

	.panel {
		padding-top: 24px;
	}

	.panel:focus-visible {
		outline-offset: 6px;
	}
</style>
