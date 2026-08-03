<script lang="ts">
	import { detectTier, isFinePointer } from '$lib/motion/capability.svelte';

	let x = $state(0);
	let y = $state(0);
	let label = $state('');
	let active = $state(false);
	let enabled = $state(false);

	$effect(() => {
		if (detectTier() === 'none' || !isFinePointer()) return;
		enabled = true;

		let frame = 0;
		function move(event: PointerEvent) {
			cancelAnimationFrame(frame);
			frame = requestAnimationFrame(() => {
				x = event.clientX;
				y = event.clientY;
				active = true;
				const target = (event.target as Element | null)?.closest?.('[data-cursor]');
				label = target?.getAttribute('data-cursor') ?? '';
			});
		}

		function leave() {
			active = false;
		}

		window.addEventListener('pointermove', move, { passive: true });
		document.addEventListener('pointerleave', leave);
		return () => {
			cancelAnimationFrame(frame);
			window.removeEventListener('pointermove', move);
			document.removeEventListener('pointerleave', leave);
		};
	});
</script>

{#if enabled}
	<div
		class="cursor"
		class:is-active={active}
		class:has-label={label !== ''}
		style="--x:{x}px; --y:{y}px"
		aria-hidden="true"
	>
		{#if label}<span class="t-button">{label}</span>{/if}
	</div>
{/if}

<style>
	.cursor {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 9999;
		display: grid;
		place-items: center;
		width: 10px;
		height: 10px;
		background: #fff;
		border-radius: 999px;
		mix-blend-mode: difference;
		pointer-events: none;
		opacity: 0;
		transform: translate(calc(var(--x) - 50%), calc(var(--y) - 50%));
		transition:
			width 220ms var(--ease-out),
			height 220ms var(--ease-out),
			border-radius 220ms var(--ease-out),
			opacity 160ms linear;
	}

	.is-active {
		opacity: 1;
	}

	/* Grows into a labelled pill; square, like everything else that carries type. */
	.has-label {
		width: auto;
		height: 26px;
		padding-inline: 12px;
		border-radius: 0;
	}

	.has-label span {
		color: #fff;
		white-space: nowrap;
	}
</style>
