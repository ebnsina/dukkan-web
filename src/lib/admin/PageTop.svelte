<script lang="ts">
	/* The top of every admin page, in two rows above the table.
	 *
	 *   Orders / DK-1006                              [ Cancel order ]
	 *   DK-1006                            [ search ] [ status ] [ Go ]
	 *
	 * The trail says where you are and is the way back. The label beneath it is
	 * the page's own heading, set in the reading face — the trail is mono, and a
	 * heading in mono reads as a code rather than as a name.
	 *
	 * What you can do sits with the trail; what narrows the list sits with the
	 * label it narrows. Both are pushed right, so the eye finds them in the same
	 * place on every page.
	 *
	 * The label is taken from the last crumb rather than passed separately: they
	 * would always be the same word, and two props that must agree eventually
	 * disagree.
	 */
	import type { Snippet } from 'svelte';
	import { page } from '$app/state';
	import { Breadcrumb, type Crumb } from '$lib/ui';

	interface Props {
		/** Last item is where you are, and carries no href. */
		trail: Crumb[];
		/** A line of real information under the label — never a caption. */
		meta?: Snippet;
		/** Search boxes and dropdowns. Sits with the label. */
		filters?: Snippet;
		/** What you can do here. Sits with the trail. */
		actions?: Snippet;
	}

	let { trail, meta, filters, actions }: Props = $props();

	/* Every trail starts at the surface's own home, added here rather than
	   repeated on seventeen pages — where one would eventually be spelt
	   differently or forgotten. A page that IS the home does not link to
	   itself. */
	const home = $derived<Crumb>(
		page.url.pathname.startsWith('/platform')
			? { label: 'Operator', href: '/platform' }
			: { label: 'Overview', href: '/admin' }
	);

	const full = $derived(
		trail[0]?.href === home.href || trail[0]?.label === home.label ? trail : [home, ...trail]
	);

	const label = $derived(trail.at(-1)?.label ?? '');
</script>

<div class="top">
	<div class="row">
		<Breadcrumb items={full} />
		{#if actions}<div class="dk-acts">{@render actions()}</div>{/if}
	</div>

	<div class="row">
		<div class="what">
			<h1 class="dk-h1">{label}</h1>
			{#if meta}<p class="dk-date">{@render meta()}</p>{/if}
		</div>
		{#if filters}<div class="filters">{@render filters()}</div>{/if}
	</div>
</div>

<style>
	.top {
		display: flex;
		flex-direction: column;
		gap: 12px;
		margin-bottom: 18px;
	}

	.row {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 12px;
	}

	.what {
		display: flex;
		flex-direction: column;
		gap: 3px;
	}

	/* Pushed right whether or not anything sits beside them, so neither wanders
	   left on the pages that carry only one. */
	.filters,
	.dk-acts {
		margin-left: auto;
	}

	/* A wrapping flex container reports its width as the widest line *after*
	   wrapping, so as a flex item it asks for less than it needs and drops the
	   last control onto a second row. */
	.filters :global(.dk-filters) {
		margin-bottom: 0;
		flex-wrap: nowrap;
	}

	@media (max-width: 760px) {
		.filters,
		.dk-acts {
			margin-left: 0;
			width: 100%;
		}

		.filters :global(.dk-filters) {
			flex-wrap: wrap;
		}
	}
</style>
