<script lang="ts">
	interface Props {
		/** `paper` is for a dot sitting on a coloured chip, where lime would sink. */
		tone?: 'lime' | 'paper';
	}

	let { tone = 'lime' }: Props = $props();
</script>

<!-- The one place a radius is allowed: a functional status dot, not a corner. -->
<span
	aria-hidden="true"
	class="size-1.5 flex-none animate-mk-pulse rounded-full {tone === 'paper'
		? 'bg-mk-paper shadow-[0_0_0_0_rgba(255,255,255,0.6)]'
		: 'bg-mk-lime shadow-[0_0_0_0_rgba(158,210,20,0.6)]'}"
></span>
