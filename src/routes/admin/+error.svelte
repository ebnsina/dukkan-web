<script lang="ts">
	import { page } from '$app/state';
	import Seo from '$lib/seo/Seo.svelte';
	import { Button } from '$lib/ui';
	import { formatNumber } from '$lib/utils/format';
</script>

<Seo title="Not available" description="This admin page could not be shown." noindex />

<div class="screen">
	<span class="code t-label">Error {formatNumber(page.status)}</span>
	<h1 class="t-title">
		{page.status === 404 ? 'That is not here' : 'Something broke on our side'}
	</h1>
	<p class="body t-lead">
		{page.error?.message ?? 'Reload the page. If it keeps happening, tell us what you were doing.'}
	</p>
	<div class="actions">
		<Button href="/admin" arrow>Back to the dashboard</Button>
	</div>
</div>

<style>
	.screen {
		padding-block: clamp(56px, 9vw, 120px);
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
		gap: 12px;
		margin-top: 36px;
	}
</style>
