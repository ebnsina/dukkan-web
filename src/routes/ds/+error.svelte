<script lang="ts">
	import { page } from '$app/state';
	import Seo from '$lib/seo/Seo.svelte';
	import ErrorScreen from '$lib/site/ErrorScreen.svelte';
	import { Button, Wordmark } from '$lib/ui';
</script>

<Seo title="Design system not available" description="This page could not be shown." noindex />

<header class="bar">
	<div class="inner container-page">
		<Wordmark />
		<Button href="/" variant="ghost">Back to the site</Button>
	</div>
</header>

<main><ErrorScreen status={page.status} code={page.error?.code} /></main>

<style>
	.bar {
		border-bottom: 1px solid var(--rule);
	}

	.inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 68px;
	}
</style>
