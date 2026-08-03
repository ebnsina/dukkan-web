<script lang="ts">
	import './layout.css';
	import { onMount } from 'svelte';
	import { Toaster } from '$lib/ui';
	import { theme } from '$lib/theme/theme.svelte';
	import OfflineBanner from '$lib/site/OfflineBanner.svelte';

	let { children } = $props();

	onMount(() => theme.init());
</script>

<a href="#main" class="skip t-button">Skip to content</a>

<OfflineBanner />

<div id="main">
	{@render children()}
</div>

<Toaster />

<style>
	.skip {
		position: absolute;
		left: -9999px;
		top: 0;
		z-index: 900;
		background: var(--inverse-paper);
		color: var(--inverse-ink);
		padding: 14px 20px;
	}

	.skip:focus {
		left: 12px;
		top: 12px;
	}
</style>
