<script lang="ts">
	import './layout.css';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { Toaster } from '$lib/ui';
	import { theme } from '$lib/theme/theme.svelte';
	import OfflineBanner from '$lib/site/OfflineBanner.svelte';

	let { children } = $props();

	onMount(() => theme.init());

	// The admin is Dukkan's own tool and carries Dukkan's colour; a storefront
	// wears the shop's theme instead.
	const surface = $derived(page.url.pathname.startsWith('/admin') ? 'admin' : 'shop');
</script>

<a href="#main" class="skip t-button">Skip to content</a>

<OfflineBanner />

<div id="main" data-surface={surface}>
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
