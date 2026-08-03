<script lang="ts">
	import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/svelte';
	import type { Tone } from '$lib/admin/state';

	interface Props {
		tone?: Tone;
		label: string;
		/** Shape as well as colour, so the badge does not rely on hue alone. */
		icon?: IconSvgElement;
	}

	let { tone = 'neutral', label, icon }: Props = $props();
</script>

<span class="dk-chip" data-tone={tone}>
	{#if icon}
		<span class="dk-chip-icon" aria-hidden="true">
			<HugeiconsIcon {icon} size={13} strokeWidth={2} />
		</span>
	{/if}
	{label}
</span>
