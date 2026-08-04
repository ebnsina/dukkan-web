<script lang="ts">
	interface Props {
		/** `paper` is for a dot sitting on a coloured chip, where the brand would sink. */
		tone?: 'brand' | 'paper';
	}

	let { tone = 'brand' }: Props = $props();
</script>

<!-- The one place a radius is allowed: a functional status dot, not a corner. -->
<span
	aria-hidden="true"
	class="size-1.5 flex-none animate-mk-pulse rounded-full {tone === 'paper'
		? 'bg-paper shadow-[0_0_0_0_rgba(255,255,255,0.6)]'
		: 'bg-accent shadow-[0_0_0_0_rgba(75,68,201,0.6)]'}"
></span>
