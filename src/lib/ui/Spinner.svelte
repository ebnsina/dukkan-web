<script lang="ts">
	interface Props {
		label?: string;
	}

	let { label = 'Loading' }: Props = $props();
</script>

<span class="spinner" role="status" aria-label={label}><i></i><i></i><i></i></span>

<style>
	.spinner {
		display: inline-flex;
		gap: 4px;
		align-items: center;
	}

	i {
		width: 4px;
		height: 4px;
		background: currentColor;
		animation: pulse 900ms ease-in-out infinite;
	}

	i:nth-child(2) {
		animation-delay: 150ms;
	}

	i:nth-child(3) {
		animation-delay: 300ms;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 0.25;
		}
		50% {
			opacity: 1;
		}
	}
</style>
