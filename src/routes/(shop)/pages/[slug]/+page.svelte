<script lang="ts">
	import Seo from '$lib/seo/Seo.svelte';

	let { data } = $props();

	/* Written as plain text by a shop owner, shown as plain text. Paragraphs
	   are split on blank lines and nothing is interpreted — the body goes on
	   the public storefront, and rendering markup a shop typed would put
	   whatever it typed into every shopper's page. */
	const paragraphs = $derived(
		data.page.body
			.split(/\n\s*\n/)
			.map((p) => p.trim())
			.filter(Boolean)
	);
</script>

<Seo title={data.page.title} description="{data.page.title} — {data.shop.name}." />

<article class="wrap container-page">
	<h1 class="t-title">{data.page.title}</h1>
	{#each paragraphs as paragraph, index (index)}
		<p>{paragraph}</p>
	{/each}
</article>

<style>
	.wrap {
		max-width: 68ch;
		padding-block: clamp(40px, 6vw, 72px);
	}

	p {
		margin-top: 20px;
		font-size: var(--size-body);
		line-height: 1.75;
		white-space: pre-wrap;
	}
</style>
