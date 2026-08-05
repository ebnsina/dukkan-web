<script lang="ts">
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { Search01Icon } from '@hugeicons/core-free-icons';
	import { Avatar, Input } from '$lib/ui';
</script>

<section id="people" class="group">
	<h2>People</h2>
	<div class="cases">
		<div class="case">
			<span class="case-label">Avatar</span>
			<div class="row is-baseline">
				<Avatar name="Anwar Sadat" size="xs" />
				<Avatar name="Karim Hossain" size="sm" />
				<Avatar name="Rahim Uddin" />
				<Avatar name="Nusrat Jahan" size="lg" online />
				<Avatar name="করিম হোসেন" />
			</div>
		</div>

		<div class="case">
			<span class="case-label">Search, the composed shape</span>
			<div class="search">
				<span class="search-glyph" aria-hidden="true">
					<HugeiconsIcon icon={Search01Icon} size={16} strokeWidth={1.8} />
				</span>
				<Input placeholder="Search by name or order number" aria-label="Search" />
			</div>
		</div>
	</div>
</section>

<style>
	/* The glyph sits over the input rather than beside it, so the field keeps
	   its full width and its own focus ring. */
	.search {
		position: relative;
	}

	.search-glyph {
		position: absolute;
		top: 50%;
		left: 14px;
		z-index: 1;
		display: grid;
		place-items: center;
		color: var(--faint);
		transform: translateY(-50%);
		pointer-events: none;
	}

	.search :global(input) {
		padding-left: 42px;
	}
</style>
