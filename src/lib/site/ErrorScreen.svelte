<script lang="ts">
	import { Button } from '$lib/ui';
	import { formatNumber } from '$lib/utils/format';

	interface Props {
		status: number;
		code?: string;
	}

	let { status, code }: Props = $props();

	/* One sentence: what went wrong, and what to do next. No technical detail. */
	const COPY: Record<number, { title: string; body: string }> = {
		403: {
			title: 'This page is not yours to open',
			body: 'Ask whoever runs the shop to give you access, then try the link again.'
		},
		404: {
			title: 'That page is gone',
			body: 'The link is old or the page moved. Start from the homepage and you will find it.'
		},
		429: {
			title: 'Too many tries',
			body: 'Wait a minute, then try again.'
		},
		503: {
			title: 'We are down for a short while',
			body: 'Nothing is lost. Try again in a few minutes.'
		}
	};

	const FALLBACK = {
		title: 'Something broke on our side',
		body: 'This is not your fault. Reload the page, and if it happens again, write to us.'
	};

	let copy = $derived(COPY[status] ?? FALLBACK);
</script>

<div class="screen container-page">
	<span class="code t-label">Error {formatNumber(status)}</span>
	<h1 class="t-title">{copy.title}</h1>
	<p class="body t-lead">{copy.body}</p>
	<div class="actions">
		<Button href="/" arrow>Go to the homepage</Button>
		<Button variant="ghost" onclick={() => location.reload()}>Try again</Button>
	</div>
	{#if code}<p class="ref t-mono">{code}</p>{/if}
</div>

<style>
	.screen {
		padding-block: clamp(72px, 12vw, 160px);
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

	.ref {
		margin-top: 40px;
		font-size: 11px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--faint);
	}
</style>
