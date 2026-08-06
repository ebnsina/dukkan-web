<script lang="ts">
	/* The bottom of the page. A colophon, not a sitemap: six links the page has
	   earned, and no columns of headings that lead back to anchors on itself. */
	let { demoShop }: { demoShop: string } = $props();

	const links = [
		['Open a shop', '/signup'],
		['Sign in', '/admin/signin'],
		['What it costs', '#costs'],
		['Questions', '#questions']
	];
</script>

<footer class="lg-wrap flex flex-col gap-6 border-t border-lg-rule py-9 sm:flex-row sm:items-baseline sm:justify-between">
	<p class="lg-label text-lg-faint">Dukk&agrave;n &middot; shop software for Bangladesh</p>

	<nav aria-label="Footer" class="flex flex-wrap gap-x-7 gap-y-2">
		{#each links as [label, href] (label)}
			<a {href} class="lg-label text-lg-muted hover:text-lg-ink">{label}</a>
		{/each}
		<a href={demoShop} class="lg-label text-lg-muted hover:text-lg-ink">Look at a shop</a>
	</nav>
</footer>
