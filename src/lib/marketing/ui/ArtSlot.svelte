<script lang="ts">
	interface Props {
		/** Picks one of four light arrangements, so slots differ from each other. */
		seed?: number;
		/** The hue the light is made of — usually the surrounding accent. */
		tone?: string;
		/** The surface it blends into, so the wash sits on its own background. */
		base?: string;
		class?: string;
	}

	let { seed = 0, tone = 'currentColor', base = 'white', class: className = '' }: Props = $props();

	/* Stands in for photography: an aurora mixed from the surrounding palette,
	   blended toward `base` so it suits a light or a dark theme. */
	const arrangements = [
		[
			['18% 8%', 55],
			['82% 18%', 74],
			['55% 108%', 64]
		],
		[
			['85% 12%', 57],
			['12% 45%', 76],
			['60% 105%', 66]
		],
		[
			['50% 0%', 58],
			['10% 90%', 72],
			['95% 85%', 62]
		],
		[
			['25% 100%', 58],
			['75% 5%', 70],
			['5% 20%', 78]
		]
	] as const;

	let layers = $derived(
		arrangements[seed % arrangements.length]
			.map(
				([at, mix]) =>
					`radial-gradient(130% 130% at ${at}, color-mix(in oklab, ${tone}, ${base} ${mix}%) 0%, transparent 64%)`
			)
			.join(',')
	);
</script>

<div
	class={className}
	style="background-color:color-mix(in oklab, {tone}, {base} 88%);background-image:{layers}"
></div>
