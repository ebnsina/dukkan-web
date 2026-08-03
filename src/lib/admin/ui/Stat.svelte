<script lang="ts">
	import type { Tone } from '$lib/admin/state';

	interface Props {
		label: string;
		value: string;
		sub?: string;
		/** A figure only takes a colour when it means something. */
		tone?: Tone;
		href?: string;
	}

	let { label, value, sub, tone = 'neutral', href }: Props = $props();

	// Read aloud, the three parts are one sentence rather than three orphans.
	const spoken = $derived([label, value, sub].filter(Boolean).join(', '));
</script>

{#snippet inner()}
	<div class="dk-head"><span class="dk-eyebrow" aria-hidden="true">{label}</span></div>
	<div class="dk-panel dk-panel--stat">
		<span class="dk-stat-value" data-tone={tone} aria-hidden="true">{value}</span>
	</div>
	<!-- The line under the figure belongs to the tint, the way the label does. -->
	{#if sub}<div class="dk-frame-foot" aria-hidden="true">{sub}</div>{/if}
{/snippet}

{#if href}
	<a class="dk-frame" {href} aria-label={spoken}>{@render inner()}</a>
{:else}
	<div class="dk-frame" role="group" aria-label={spoken}>{@render inner()}</div>
{/if}
