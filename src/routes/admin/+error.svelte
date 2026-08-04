<script lang="ts">
	import { page } from '$app/state';
	import Seo from '$lib/seo/Seo.svelte';
	import { ArrowLeft01Icon } from '@hugeicons/core-free-icons';
	import { Button } from '$lib/ui';
	import { formatNumber } from '$lib/utils/format';
</script>

<Seo title="Not available" description="This admin page could not be shown." noindex />

<div class="screen">
	<span class="dk-eyebrow">Error {formatNumber(page.status)}</span>
	<h1 class="dk-h1">
		{page.status === 404 ? 'That is not here' : 'Something broke on our side'}
	</h1>
	<p class="dk-note">
		{page.error?.message ?? 'Reload the page. If it keeps happening, tell us what you were doing.'}
	</p>
	<div class="dk-acts">
		<Button href="/admin" icon={ArrowLeft01Icon}>Back to the dashboard</Button>
	</div>
</div>

<style>
	.screen {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 12px;
		padding-block: clamp(40px, 8vw, 96px);
	}
</style>
