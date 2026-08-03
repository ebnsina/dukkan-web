<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Tone } from '$lib/admin/state';

	interface Props {
		title?: string;
		tone?: Tone;
		children?: Snippet;
	}

	let { title, tone = 'neutral', children }: Props = $props();
</script>

<!-- A failure interrupts; anything else is announced politely when the reader
     gets to it. -->
<p
	class="dk-banner"
	data-tone={tone}
	role={tone === 'danger' ? 'alert' : 'status'}
	aria-live={tone === 'danger' ? 'assertive' : 'polite'}
>
	<span>
		{#if title}<span class="dk-banner-title">{title}</span>{/if}
		{#if children}{@render children()}{/if}
	</span>
</p>
