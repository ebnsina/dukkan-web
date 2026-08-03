<script lang="ts">
	import { page } from '$app/state';
	import Seo from '$lib/seo/Seo.svelte';
	import ErrorScreen from '$lib/site/ErrorScreen.svelte';
	import SiteHeader from '$lib/site/SiteHeader.svelte';
	import SiteFooter from '$lib/site/SiteFooter.svelte';
</script>

<Seo title="Page not available" description="This Dukkan page could not be shown." noindex />

<SiteHeader />
<main><ErrorScreen status={page.status} code={page.error?.code} /></main>
<SiteFooter />
