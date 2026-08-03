<script lang="ts">
	import { page } from '$app/state';
	import Seo from '$lib/seo/Seo.svelte';
	import { Button } from '$lib/ui';
	import { formatNumber } from '$lib/utils/format';

	const COPY: Record<number, { title: string; body: string }> = {
		404: {
			title: 'That page is gone',
			body: 'The link is old or the item was taken down. Start from the shop front and you will find what you need.'
		},
		403: { title: 'Not yours to open', body: 'Sign in with the number you ordered with.' }
	};

	const fallback = {
		title: 'Something broke on our side',
		body: 'This is not your fault. Reload the page, and if it keeps happening tell the shop.'
	};

	const copy = $derived(COPY[page.status] ?? fallback);
</script>

<Seo title="Page not available" description="This page could not be shown." noindex />

<div class="screen container-page">
	<span class="code t-label">Error {formatNumber(page.status)}</span>
	<h1 class="t-title">{copy.title}</h1>
	<p class="body t-lead">{page.error?.message ?? copy.body}</p>
	<div class="actions">
		<Button href="/shop" arrow>Back to the shop</Button>
		<Button href="/track" variant="ghost">Track an order</Button>
	</div>
</div>

<style>
	.screen {
		padding-block: clamp(64px, 10vw, 140px);
	}

	.code {
		display: block;
		margin-bottom: 24px;
		color: var(--faint);
	}

	.body {
		margin-top: 24px;
		color: var(--muted);
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		margin-top: 36px;
	}
</style>
