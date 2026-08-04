<script lang="ts">
	import Seo from '$lib/seo/Seo.svelte';
	import { Button, CtaBand, PageHeader, Wordmark } from '$lib/ui';
	import ThemeToggle from '$lib/theme/ThemeToggle.svelte';
	import SiteFooter from '$lib/site/SiteFooter.svelte';
	import Palette from '$lib/ds/sections/Palette.svelte';
	import TypeScale from '$lib/ds/sections/TypeScale.svelte';
	import Structure from '$lib/ds/sections/Structure.svelte';
	import Motion from '$lib/ds/sections/Motion.svelte';
	import Library from '$lib/ds/sections/Library.svelte';

	/* One place for the whole system. The foundations come first because the
	   components are built out of them; /ui redirects here rather than being a
	   second address for half of it. */
	const sections = [
		{ id: 'palette', label: '01 Palette' },
		{ id: 'type', label: '02 Type' },
		{ id: 'structure', label: '03 Structure' },
		{ id: 'motion', label: '04 Motion' },
		{ id: 'buttons', label: '05 Buttons' },
		{ id: 'forms', label: '06 Forms' },
		{ id: 'feedback', label: '07 Feedback' },
		{ id: 'overlays', label: '08 Overlays' },
		{ id: 'navigation', label: '09 Navigation' },
		{ id: 'containers', label: '10 Containers' },
		{ id: 'data', label: '11 Data' },
		{ id: 'people', label: '12 People' }
	];

	let active = $state('palette');

	$effect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) if (entry.isIntersecting) active = entry.target.id;
			},
			{ rootMargin: '-80px 0px -72% 0px' }
		);
		for (const section of sections) {
			const node = document.getElementById(section.id);
			if (node) observer.observe(node);
		}
		return () => observer.disconnect();
	});
</script>

<Seo
	title="Design system"
	description="The whole system in one place: the palette, the type scale, space and corners, motion, and every component built on them."
	noindex
/>

<header class="bar">
	<div class="inner container-page">
		<Wordmark />
		<span class="tag t-button">Design system</span>
		<div class="tools">
			<ThemeToggle />
			<Button href="/" variant="ghost">Back to the site</Button>
		</div>
	</div>
</header>

<main>
	<PageHeader
		eyebrow="Reference"
		title="The shared foundation."
		standfirst="One indigo spent only on what a person can act on, surfaces and text a shop repaints with its own theme, a type scale that leans on a single width axis, corners keyed to the size of the box, and motion that gets out of the way — then every component built out of all of it. Foundations first, because the components are made of them."
	>
		{#snippet actions()}
			<Button href="#palette" arrow>Start at the palette</Button>
			<Button href="#buttons" variant="ghost">Jump to the components</Button>
		{/snippet}
	</PageHeader>

	<nav aria-label="Sections" class="index container-page">
		<ol>
			{#each sections as section (section.id)}
				<li>
					<a
						class="t-button"
						class:is-active={active === section.id}
						href="#{section.id}"
						aria-current={active === section.id ? 'true' : undefined}
					>
						{section.label}
					</a>
				</li>
			{/each}
		</ol>
	</nav>

	<Palette />
	<TypeScale />
	<Structure />
	<Motion />
	<Library />

	<CtaBand
		heading="That is the system. Now go and look at the site."
		note="Everything on it is built from these parts"
	>
		{#snippet actions()}
			<Button href="/" arrow>Open the site</Button>
			<Button href="#palette" variant="ghost">Back to the top</Button>
		{/snippet}
	</CtaBand>
</main>

<SiteFooter />

<style>
	.bar {
		position: sticky;
		top: 0;
		z-index: 100;
		background: color-mix(in srgb, var(--paper) 82%, transparent);
		-webkit-backdrop-filter: blur(14px);
		backdrop-filter: blur(14px);
		border-bottom: 1px solid var(--rule);
	}

	.inner {
		display: flex;
		align-items: center;
		gap: 16px;
		height: 68px;
	}

	.tag {
		display: none;
		color: var(--faint);
	}

	.tools {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-left: auto;
	}

	.index {
		padding-bottom: 24px;
	}

	.index ol {
		display: flex;
		flex-wrap: wrap;
		gap: 0;
		border-top: 1px solid var(--rule);
	}

	.index a {
		display: block;
		padding: 16px 24px 16px 0;
		color: var(--faint);
		text-decoration: none;
		transition: color var(--dur-hover) var(--ease-out);
	}

	.index a:hover {
		color: var(--muted);
	}

	.is-active {
		color: var(--ink);
	}

	@media (min-width: 720px) {
		.tag {
			display: inline;
		}
	}
</style>
