<script lang="ts">
	/* The component library, once.
	 *
	 * There is one specimen of each component, not one per surface: a component
	 * reads the standard token names and the surface it sits in rebinds them, so
	 * three copies of the same markup showed the same design three times. What a
	 * surface changes is the palette, and the theme toggle already demonstrates
	 * that on this page.
	 *
	 * This file composes; each section owns its own specimens, its own state and
	 * whatever styling is peculiar to it. The scaffolding they share is in
	 * `specimen.css`, so it is written once rather than nine times. */
	import '$lib/ds/specimen.css';
	import Buttons from './library/Buttons.svelte';
	import Forms from './library/Forms.svelte';
	import Feedback from './library/Feedback.svelte';
	import Overlays from './library/Overlays.svelte';
	import Navigation from './library/Navigation.svelte';
	import Containers from './library/Containers.svelte';
	import Data from './library/Data.svelte';
	import People from './library/People.svelte';
	import Rest from './library/Rest.svelte';
</script>

<div class="library container-page">
	<header class="masthead">
		<span class="eyebrow">05 / Components</span>
		<h2 class="lede">One library. Build from it.</h2>
		<p class="dek">
			Every control the storefront, the admin and the landing page use. Nothing is forked per
			surface: a component reads the standard token names — <code>--paper</code>,
			<code>--ink</code>, <code>--accent</code> — and each surface rebinds those to its own values.
			Where one place needs something different it passes <code>class</code> at the call site, which
			every component merges last.
		</p>
		<p class="dek">
			Motion, the focus ring and the keyboard are the component's job, not the call site's — so a
			control arrives correct rather than needing to be made correct.
		</p>
	</header>

	<Buttons />
	<Forms />
	<Feedback />
	<Overlays />
	<Navigation />
	<Containers />
	<Data />
	<People />
	<Rest />

	<footer class="rule-note">
		Values live in <code>src/lib/tokens.css</code>. Surfaces bind them in
		<code>src/lib/styles/</code>. Components live in <code>src/lib/ui/</code> and read only the
		standard names. The foundations they are built on are at the top of this page.
	</footer>
</div>
