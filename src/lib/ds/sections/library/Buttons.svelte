<script lang="ts">
	import { Delete02Icon, PlusSignIcon } from '@hugeicons/core-free-icons';
	import { Button } from '$lib/ui';
</script>

<section id="buttons" class="group">
	<h2>Buttons</h2>
	<div class="cases">
		<div class="case">
			<span class="case-label">Variants</span>
			<div class="row">
				<Button>Solid</Button>
				<Button variant="quiet">Quiet</Button>
				<Button variant="ghost">Ghost</Button>
				<Button variant="danger" icon={Delete02Icon}>Danger</Button>
				<Button variant="link" href="#top">Link</Button>
			</div>
		</div>

		<div class="case">
			<span class="case-label">Sizes</span>
			<div class="row is-baseline">
				<Button size="sm">Small</Button>
				<Button size="md">Medium</Button>
				<Button size="lg">Large</Button>
			</div>
		</div>

		<div class="case">
			<span class="case-label">States</span>
			<div class="row">
				<Button icon={PlusSignIcon}>With icon</Button>
				<Button variant="quiet" arrow>With arrow</Button>
				<Button loading>Saving</Button>
				<Button disabled>Disabled</Button>
			</div>
		</div>

		<div class="case">
			<span class="case-label">Full width · link</span>
			<div class="stack">
				<Button full>Place the order</Button>
				<Button href="#top" variant="quiet" full arrow>Rendered as a link</Button>
				<Button variant="link" arrow>Read the payout rules</Button>
			</div>
		</div>
	</div>
</section>
