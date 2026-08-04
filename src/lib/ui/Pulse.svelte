<script lang="ts">
	/* A live dot with a heartbeat: two quick beats, then a rest — the rhythm
	   of a pulse rather than an even blink, which is what makes it read as
	   something running rather than something flashing for attention.
	 *
	 * A ring goes out with the first beat and fades, so the mark is legible
	 * from the corner of the eye without growing large enough to nag. */
	interface Props {
		/** `paper` is for a dot sitting on a coloured chip, where the brand would sink. */
		tone?: 'brand' | 'paper';
	}

	let { tone = 'brand' }: Props = $props();
</script>

<!-- The one place a radius is allowed: a functional status dot, not a corner. -->
<span class="pulse" data-tone={tone} aria-hidden="true">
	<span class="ring"></span>
	<span class="dot"></span>
</span>

<style>
	.pulse {
		position: relative;
		display: inline-grid;
		place-items: center;
		flex: none;
		width: 6px;
		height: 6px;
		color: var(--accent);
	}

	[data-tone='paper'] {
		color: var(--paper);
	}

	.dot {
		width: 6px;
		height: 6px;
		border-radius: var(--r-round);
		background: currentColor;
		animation: beat 2.4s var(--ease-out) infinite;
	}

	.ring {
		position: absolute;
		inset: 0;
		border-radius: var(--r-round);
		box-shadow: 0 0 0 0 currentColor;
		animation: ring 2.4s var(--ease-out) infinite;
	}

	/* Beat, beat, rest — the second thump is smaller than the first, which is
	   what a heartbeat does and an even pulse does not. */
	@keyframes beat {
		0% {
			transform: scale(1);
		}
		8% {
			transform: scale(1.5);
		}
		16% {
			transform: scale(1);
		}
		24% {
			transform: scale(1.3);
		}
		32%,
		100% {
			transform: scale(1);
		}
	}

	@keyframes ring {
		0% {
			box-shadow: 0 0 0 0 currentColor;
			opacity: 0.5;
		}
		40% {
			box-shadow: 0 0 0 6px currentColor;
			opacity: 0;
		}
		100% {
			box-shadow: 0 0 0 0 currentColor;
			opacity: 0;
		}
	}

	/* Still, but still visible: the dot is the status, the motion was only
	   ever the flourish. */
	@media (prefers-reduced-motion: reduce) {
		.dot,
		.ring {
			animation: none;
		}
	}
</style>
