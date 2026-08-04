<script lang="ts">
	/* A menu button and its list, to the pattern rather than to taste: focus
	   moves into the list when it opens, the active item is named by
	   `aria-activedescendant` instead of only being painted, and Escape, Tab or
	   a click anywhere else puts focus back on the button that opened it. */
	import type { Snippet } from 'svelte';
	import { scale } from 'svelte/transition';
	import { prefersReducedMotion } from 'svelte/motion';
	import { track } from './position';

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
		/** Names the menu for a screen reader when the trigger is only an icon. */
		label?: string;
		trigger: Snippet<[{ open: boolean }]>;
	}

	let { items, align = 'start', label, trigger }: Props = $props();

	const uid = $props.id();
	let open = $state(false);
	let root = $state<HTMLDivElement | null>(null);
	let button = $state<HTMLButtonElement | null>(null);
	let list = $state<HTMLDivElement | null>(null);
	let activeIndex = $state(-1);

	let enabled = $derived(items.filter((item) => !item.disabled));
	let activeId = $derived(
		activeIndex >= 0 && enabled[activeIndex]
			? `${uid}-item-${items.indexOf(enabled[activeIndex])}`
			: undefined
	);

	// The list is fixed and placed by measurement, so it opens upward near the
	// bottom of the window and cannot be clipped by a scrolling panel.
	$effect(() => {
		if (!open || !button || !list) return;
		return track(button, list, { align, gap: 6 });
	});

	// Focus follows the list, so the reader is inside the menu and Escape has
	// something to return from.
	$effect(() => {
		if (open) list?.focus();
	});

	function close(returnFocus = true) {
		open = false;
		activeIndex = -1;
		if (returnFocus) button?.focus();
	}

	function select(item: MenuItem) {
		if (item.disabled) return;
		close();
		item.onselect?.();
	}

	function onkeydown(event: KeyboardEvent) {
		if (!open) {
			if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Enter') {
				open = true;
				activeIndex = event.key === 'ArrowUp' ? enabled.length - 1 : 0;
				event.preventDefault();
			}
			return;
		}

		if (event.key === 'Escape') close();
		else if (event.key === 'Tab') close(false);
		else if (event.key === 'ArrowDown') activeIndex = (activeIndex + 1) % enabled.length;
		else if (event.key === 'ArrowUp')
			activeIndex = (activeIndex - 1 + enabled.length) % enabled.length;
		else if (event.key === 'Home') activeIndex = 0;
		else if (event.key === 'End') activeIndex = enabled.length - 1;
		else if (event.key === 'Enter' || event.key === ' ') {
			if (enabled[activeIndex]) select(enabled[activeIndex]);
		} else return;

		if (event.key !== 'Tab') event.preventDefault();
	}

	$effect(() => {
		if (!open) return;
		function onpointerdown(event: PointerEvent) {
			if (root && !root.contains(event.target as Node)) close(false);
		}
		document.addEventListener('pointerdown', onpointerdown);
		return () => document.removeEventListener('pointerdown', onpointerdown);
	});
</script>

<div bind:this={root} role="presentation" class="menu-root" {onkeydown}>
	<button
		bind:this={button}
		type="button"
		class="trigger"
		aria-haspopup="menu"
		aria-expanded={open}
		aria-controls={open ? `${uid}-menu` : undefined}
		aria-label={label}
		onclick={() => (open ? close() : (open = true))}
	>
		{@render trigger({ open })}
	</button>

	{#if open}
		<div
			bind:this={list}
			id="{uid}-menu"
			role="menu"
			tabindex="-1"
			aria-label={label}
			aria-activedescendant={activeId}
			class="list"
			transition:scale={{
				start: prefersReducedMotion.current ? 1 : 0.96,
				opacity: 0,
				duration: prefersReducedMotion.current ? 0 : 140
			}}
		>
			{#each items as item, index (item.label)}
				{#if item.separatorBefore}<span class="sep" role="separator"></span>{/if}
				<svelte:element
					this={item.href ? 'a' : 'button'}
					id="{uid}-item-{index}"
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

	/* Placed by `position.ts`; the grows-from-the-anchor origin is set there
	   too, so the panel opens out of the button that owns it. */
	.list {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 200;
		min-width: 220px;
		max-height: min(60vh, 420px);
		overflow-y: auto;
		padding: 5px;
		background: var(--paper);
		border: 1px solid var(--rule-strong);
		border-radius: var(--r-nested);
	}

	/* The list itself is a container, not a target — the ring belongs on the
	   item the arrow keys are pointing at. */
	.list:focus-visible {
		outline: none;
	}

	.item {
		display: block;
		width: 100%;
		padding: 10px 12px;
		border-radius: var(--r-control);
		text-align: left;
		font-size: 14px;
		line-height: 1.4;
		color: var(--muted);
		background: none;
		border: none;
		text-decoration: none;
		cursor: pointer;
	}

	/* The keyboard's position and the cursor's are the same state, and it is
	   the brand that marks it — a grey fill reads as disabled. */
	.is-active {
		background: var(--accent-soft);
		color: var(--accent);
	}

	.is-disabled {
		opacity: 0.35;
		pointer-events: none;
	}

	.sep {
		display: block;
		height: 1px;
		margin: 4px 6px;
		background: var(--rule);
	}
</style>
