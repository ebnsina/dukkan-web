<script lang="ts">
	import { reveal, scramble } from './motion';

	// Deliberately static. The order ticker is the only marquee on the page.
	const merchants = [
		'Jamdani House',
		'Adda Threads',
		'Ceylon & Co.',
		'Souk Al Oud',
		'Mehndi Beauty',
		'Deshi Denim',
		'Kahwa Roasters',
		'Bab Al Bakhoor'
	];
</script>

<section class="pt-3.5 pb-11">
	<div class="mk-wrap">
		<p use:reveal use:scramble class="mb-4 block mk-kicker text-mk-brand-type">
			Trusted by shopkeepers
		</p>
		<!--
			The cells touch, so the rules between them are structure rather than
			decoration — a gapless grid without them is just names adrift.
		-->
		<ul class="grid grid-cols-2 border-t border-l border-mk-rule-soft sm:grid-cols-4">
			{#each merchants as merchant, i (merchant)}
				<li
					use:reveal={i * 45}
					class="border-r border-b border-mk-rule-soft px-4 py-6 text-center mk-display text-[15px] font-bold text-mk-muted transition-colors duration-200 hover:bg-mk-brand/10 hover:text-mk-on-brand"
				>
					{merchant}
				</li>
			{/each}
		</ul>
	</div>
</section>
