<script lang="ts">
	import './layout.css';
	import { onMount } from 'svelte';
	import { onNavigate } from '$app/navigation';
	import { Cursor, Toaster } from '$lib/ui';
	import { theme } from '$lib/theme/theme.svelte';
	import { motion } from '$lib/motion/capability.svelte';
	import OfflineBanner from '$lib/site/OfflineBanner.svelte';

	let { children } = $props();

	onMount(() => {
		theme.init();
		motion.init();
	});

	/* Pages cross-fade. Scoped by its own class so it never collides with the
	   theme wipe, which animates the same root snapshot. */
	onNavigate((navigation) => {
		if (!document.startViewTransition || !motion.animates) return;
		return new Promise((resolve) => {
			document.documentElement.classList.add('page-transition');
			const transition = document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
			transition.finished.finally(() =>
				document.documentElement.classList.remove('page-transition')
			);
		});
	});
</script>

<a href="#main" class="skip t-button">Skip to content</a>

<OfflineBanner />

<div id="main">
	{@render children()}
</div>

<Toaster />
<Cursor />

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
