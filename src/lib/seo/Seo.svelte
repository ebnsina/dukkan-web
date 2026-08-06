<script lang="ts">
	import { page } from '$app/state';
	import { PUBLIC_SITE_URL } from '$env/static/public';
	import { shopFromHost } from '$lib/utils/host';

	interface Props {
		title: string;
		description: string;
		image?: string;
		type?: 'website' | 'article';
		noindex?: boolean;
		canonical?: string;
		/** schema.org JSON-LD, as the API built it. Passed through untouched. */
		schema?: unknown;
	}

	let {
		title,
		description,
		image = '/og-default.svg',
		type = 'website',
		noindex = false,
		canonical,
		schema
	}: Props = $props();

	/* A shop lives at its own address, so its pages are canonical there. Naming
	   `PUBLIC_SITE_URL` on every page told search engines that Rahim's product
	   really lives on the marketing domain, where it does not exist at all. */
	const site = PUBLIC_SITE_URL.replace(/\/$/, '');
	let origin = $derived(shopFromHost(page.url.host) ? page.url.origin : site);
	let fullTitle = $derived(title === 'Dukkàn' ? title : `${title} · Dukkàn`);
	let url = $derived(canonical ?? `${origin}${page.url.pathname}`);
	let imageUrl = $derived(image.startsWith('http') ? image : `${origin}${image}`);

	/* The closing tag is split so the parser reading this component does not
	   take it for the end of this very block. */
	const OPEN = '<script type="application/ld+json">';
	const CLOSE = '</scr' + 'ipt>';
	let serialisedSchema = $derived(
		schema ? OPEN + JSON.stringify(schema).replace(/</g, '\\u003c') + CLOSE : ''
	);
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

	{#if schema}
		<!-- The API built this object; escaping `<` is what stops a product name
		     from closing the tag early and becoming markup. -->
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html serialisedSchema}
	{/if}
</svelte:head>
