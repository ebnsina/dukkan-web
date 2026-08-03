<script lang="ts">
	import type { Snippet } from 'svelte';
	import { fly } from 'svelte/transition';
	import { prefersReducedMotion } from 'svelte/motion';

	export interface MenuItem {
		label: string;
		onselect?: () => void;
		href?: string;
		disabled?: boolean;
		separatorBefore?: boolean;
	}

	interface Props {
		items: MenuItem[];
		align?: 'start' | 'end';
		trigger: Snippet<[{ open: boolean }]>;
	}

	let { items, align = 'start', trigger }: Props = $props();

	const uid = $props.id();
	let open = $state(false);
	let root = $state<HTMLDivElement | null>(null);
	let activeIndex = $state(-1);

	let enabled = $derived(items.filter((item) => !item.disabled));

	function select(item: MenuItem) {
		if (item.disabled) return;
		open = false;
		item.onselect?.();
	}

	function onkeydown(event: KeyboardEvent) {
		if (!open) {
			if (event.key === 'ArrowDown') {
				open = true;
				activeIndex = 0;
				event.preventDefault();
			}
			return;
		}
		if (event.key === 'Escape') {
			open = false;
			activeIndex = -1;
		} else if (event.key === 'ArrowDown') {
			activeIndex = (activeIndex + 1) % enabled.length;
		} else if (event.key === 'ArrowUp') {
			activeIndex = (activeIndex - 1 + enabled.length) % enabled.length;
		} else if (event.key === 'Enter' && enabled[activeIndex]) {
			select(enabled[activeIndex]);
		} else {
			return;
		}
		event.preventDefault();
	}

	$effect(() => {
		if (!open) return;
		function onpointerdown(event: PointerEvent) {
			if (root && !root.contains(event.target as Node)) open = false;
		}
		document.addEventListener('pointerdown', onpointerdown);
		return () => document.removeEventListener('pointerdown', onpointerdown);
	});
</script>

<div bind:this={root} role="presentation" class="menu-root" {onkeydown}>
	<button
		type="button"
		class="trigger"
		aria-haspopup="menu"
		aria-expanded={open}
		aria-controls="{uid}-menu"
		onclick={() => (open = !open)}
	>
		{@render trigger({ open })}
	</button>

	{#if open}
		<div
			id="{uid}-menu"
			role="menu"
			tabindex="-1"
			class="list"
			class:align-end={align === 'end'}
			transition:fly={{
				y: prefersReducedMotion.current ? 0 : -4,
				duration: prefersReducedMotion.current ? 0 : 150
			}}
		>
			{#each items as item (item.label)}
				{#if item.separatorBefore}<span class="sep" role="separator"></span>{/if}
				<svelte:element
					this={item.href ? 'a' : 'button'}
					role="menuitem"
					href={item.href}
					type={item.href ? undefined : 'button'}
					tabindex="-1"
					aria-disabled={item.disabled || undefined}
					class="item"
					class:is-active={enabled[activeIndex] === item}
					class:is-disabled={item.disabled}
					onclick={() => select(item)}
					onmouseenter={() => (activeIndex = enabled.indexOf(item))}
				>
					{item.label}
				</svelte:element>
			{/each}
		</div>
	{/if}
</div>

<style>
	.menu-root {
		position: relative;
		display: inline-block;
	}

	.trigger {
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
	}

	.list {
		position: absolute;
		top: calc(100% + 6px);
		left: 0;
		z-index: 200;
		min-width: 220px;
		background: var(--paper);
		border: 1px solid var(--rule-strong);
		padding-block: 4px;
	}

	.align-end {
		left: auto;
		right: 0;
	}

	.item {
		display: block;
		width: 100%;
		padding: 10px 16px;
		text-align: left;
		font-size: 14px;
		line-height: 1.4;
		color: var(--muted);
		background: none;
		border: none;
		text-decoration: none;
		cursor: pointer;
	}

	.is-active {
		background: var(--surface);
		color: var(--ink);
	}

	.is-disabled {
		opacity: 0.35;
		pointer-events: none;
	}

	.sep {
		display: block;
		height: 1px;
		margin-block: 4px;
		background: var(--rule);
	}
</style>
