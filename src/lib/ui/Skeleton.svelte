<script lang="ts">
	import { cn } from '$lib/utils/cn';

	interface Props {
		class?: string;
	}

	let { class: className }: Props = $props();
</script>

<span class={cn('skeleton', className)} aria-hidden="true"></span>

<style>
	.skeleton {
		display: block;
		height: 12px;
		background: var(--rule);
		animation: breathe 1400ms ease-in-out infinite;
	}

	@keyframes breathe {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.45;
		}
	}
</style>
