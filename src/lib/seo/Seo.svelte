<script lang="ts">
	import { page } from '$app/state';
	import { PUBLIC_SITE_URL } from '$env/static/public';

	interface Props {
		title: string;
		description: string;
		image?: string;
		type?: 'website' | 'article';
		noindex?: boolean;
		canonical?: string;
	}

	let {
		title,
		description,
		image = '/og-default.svg',
		type = 'website',
		noindex = false,
		canonical
	}: Props = $props();

	const site = PUBLIC_SITE_URL.replace(/\/$/, '');
	let fullTitle = $derived(title === 'Dukkàn' ? title : `${title} · Dukkàn`);
	let url = $derived(canonical ?? `${site}${page.url.pathname}`);
	let imageUrl = $derived(image.startsWith('http') ? image : `${site}${image}`);
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={url} />
	{#if noindex}
		<meta name="robots" content="noindex, nofollow" />
	{/if}

	<meta property="og:site_name" content="Dukkàn" />
	<meta property="og:type" content={type} />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={url} />
	<meta property="og:image" content={imageUrl} />
	<meta property="og:locale" content="en_BD" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={fullTitle} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={imageUrl} />
</svelte:head>
