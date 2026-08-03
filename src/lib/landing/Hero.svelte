<script lang="ts">
	import { Button } from '$lib/ui';
	import OrderBoard from './OrderBoard.svelte';
</script>

<section class="hero">
	<div class="container-page">
		<span class="eyebrow t-label">Marketplace software for Bangladesh</span>

		<h1 class="t-display">
			Many sellers.<br />One shopfront.<br /><span class="light">Your name on it.</span>
		</h1>

		<p class="lead t-lead">
			Dukkan runs the marketplace so you can run the business. Sellers add their own products.
			Customers pay with bKash, Nagad or cash. Money reaches each seller on time, every week.
		</p>

		<div class="actions">
			<Button href="/#pricing" arrow>Start free</Button>
			<Button href="/#how-it-works" variant="ghost">See how it works</Button>
		</div>

		<p class="small t-label">No card needed. Bring your own web address when you are ready.</p>
	</div>

	<div class="mockup container-page">
		<OrderBoard />
	</div>
</section>

<style>
	.hero {
		padding-block: clamp(56px, 9vw, 120px) 0;
	}

	.eyebrow {
		display: block;
		margin-bottom: 28px;
		color: var(--faint);
	}

	/* Emphasis inside a heading is a lighter weight at full ink, never a lighter colour. */
	.light {
		font-weight: 300;
	}

	.lead {
		margin-top: 36px;
		color: var(--muted);
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		margin-top: 40px;
	}

	.small {
		margin-top: 24px;
		color: var(--faint);
	}

	.mockup {
		margin-top: clamp(56px, 8vw, 96px);
	}
</style>
