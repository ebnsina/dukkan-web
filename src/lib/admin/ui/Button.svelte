<script lang="ts">
	import type { Snippet } from 'svelte';
	import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/svelte';

	interface Props {
		href?: string;
		type?: 'button' | 'submit' | 'reset';
		variant?: 'solid' | 'quiet' | 'danger';
		size?: 'md' | 'sm';
		/** Sits before the label, and is decoration only. */
		icon?: IconSvgElement;
		disabled?: boolean;
		name?: string;
		value?: string;
		/** Needed when the label alone does not say what this acts on. */
		label?: string;
		onclick?: (event: MouseEvent) => void;
		children: Snippet;
	}

	let {
		href,
		type = 'button',
		variant = 'solid',
		size = 'md',
		icon,
		disabled = false,
		name,
		value,
		label,
		onclick,
		children
	}: Props = $props();

	const cls = $derived(`dk-btn dk-btn--${variant}${size === 'sm' ? ' dk-btn--sm' : ''}`);
</script>

{#snippet inner()}
	{#if icon}
		<span class="dk-btn-icon" aria-hidden="true">
			<HugeiconsIcon {icon} size={size === 'sm' ? 14 : 15} strokeWidth={1.8} />
		</span>
	{/if}
	{@render children()}
{/snippet}

{#if href}
	<a class={cls} {href} aria-label={label}>{@render inner()}</a>
{:else}
	<button class={cls} {type} {disabled} {name} {value} {onclick} aria-label={label}>
		{@render inner()}
	</button>
{/if}
