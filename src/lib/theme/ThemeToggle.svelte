<script lang="ts">
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { Sun03Icon, Moon02Icon } from '@hugeicons/core-free-icons';
	import { theme } from './theme.svelte';
</script>

<button
	type="button"
	class="toggle"
	onclick={() => theme.toggle()}
	aria-label="Switch to {theme.resolved === 'dark' ? 'light' : 'dark'} theme"
>
	<HugeiconsIcon
		icon={theme.resolved === 'dark' ? Sun03Icon : Moon02Icon}
		size={16}
		strokeWidth={1.6}
	/>
</button>

<style>
	/* A bordered box: this is a control, not a marker. */
	.toggle {
		display: grid;
		place-items: center;
		width: 34px;
		height: 34px;
		border: 1px solid var(--rule-strong);
		background: none;
		color: var(--muted);
		cursor: pointer;
		transition:
			color var(--dur-hover) var(--ease-out),
			border-color var(--dur-hover) var(--ease-out);
	}

	.toggle:hover {
		color: var(--ink);
		border-color: var(--ink);
	}
</style>
