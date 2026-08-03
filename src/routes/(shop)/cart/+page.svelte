<script lang="ts">
	import { enhance } from '$app/forms';
	import Seo from '$lib/seo/Seo.svelte';
	import { Button, Empty, Note } from '$lib/ui';
	import { formatMinor } from '$lib/utils/money';
	import { formatNumber } from '$lib/utils/format';

	let { data, form } = $props();

	const cart = $derived(data.cart);
	const unavailable = $derived(
		cart.lines.filter((line) => !line.in_stock || line.quantity > line.available)
	);
</script>

<Seo title="Your basket" description="What you have picked so far." noindex />

<div class="wrap container-page">
	<h1 class="t-heading">Your basket</h1>

	{#if form?.message}
		<Note title="That did not work" tone="firm">{form.message}</Note>
	{/if}

	{#if cart.lines.length === 0}
		<Empty title="Your basket is empty" description="Once you add something it will show up here.">
			{#snippet actions()}
				<Button href="/shop" arrow>Start shopping</Button>
			{/snippet}
		</Empty>
	{:else}
		{#if unavailable.length > 0}
			<Note title="Some items need a change" tone="firm">
				{#each unavailable as line (line.variant_id)}
					<p>
						{line.title} — {line.available > 0
							? `only ${formatNumber(line.available)} left`
							: 'now sold out'}.
					</p>
				{/each}
			</Note>
		{/if}

		<div class="lines">
			{#each cart.lines as line (line.variant_id)}
				<div class="line" class:is-gone={!line.in_stock}>
					<a class="thumb" href="/p/{line.product_slug}" aria-hidden="true" tabindex="-1"></a>

					<div class="info">
						<a class="title" href="/p/{line.product_slug}">{line.title}</a>
						{#if line.options}
							<p class="opts t-label">{Object.values(line.options).join(' · ')}</p>
						{/if}
						<p class="unit t-mono">{formatMinor(line.unit_price_minor, cart.currency)} each</p>
					</div>

					<form method="POST" action="?/setQuantity" use:enhance class="qty">
						<input type="hidden" name="variant_id" value={line.variant_id} />
						<label class="sr-only" for="qty-{line.variant_id}">Quantity for {line.title}</label>
						<input
							id="qty-{line.variant_id}"
							class="qty-input t-mono"
							type="number"
							name="quantity"
							min="0"
							max="100"
							value={line.quantity}
							onchange={(event) => event.currentTarget.form?.requestSubmit()}
						/>
					</form>

					<p class="total t-mono">{formatMinor(line.line_total_minor, cart.currency)}</p>

					<form method="POST" action="?/setQuantity" use:enhance class="remove">
						<input type="hidden" name="variant_id" value={line.variant_id} />
						<input type="hidden" name="quantity" value="0" />
						<button class="t-label" type="submit">Remove</button>
					</form>
				</div>
			{/each}
		</div>

		<div class="summary">
			<div class="totals">
				<div class="row">
					<span class="t-label">Subtotal</span>
					<span class="amount t-mono">{formatMinor(cart.subtotal_minor, cart.currency)}</span>
				</div>
				<p class="note t-label">Delivery is added at checkout, once we know your district.</p>
			</div>
			<Button href="/checkout" arrow>Checkout</Button>
		</div>
	{/if}
</div>

<style>
	.wrap {
		padding-top: clamp(32px, 5vw, 56px);
		display: flex;
		flex-direction: column;
		gap: 28px;
	}

	.lines {
		border-top: 1px solid var(--rule-strong);
	}

	.line {
		display: grid;
		grid-template-columns: 64px minmax(0, 1fr) auto;
		align-items: center;
		gap: 8px 16px;
		padding-block: 20px;
		border-bottom: 1px solid var(--rule);
	}

	.is-gone {
		opacity: 0.55;
	}

	.thumb {
		display: block;
		width: 64px;
		aspect-ratio: 4 / 5;
		background: var(--surface);
		border: 1px solid var(--rule);
	}

	.title {
		font-size: 15px;
		font-weight: 600;
		color: var(--ink);
		text-decoration: none;
	}

	.opts,
	.unit {
		margin-top: 5px;
		color: var(--faint);
	}

	.unit {
		font-size: 12px;
	}

	.qty-input {
		width: 62px;
		height: 38px;
		padding-inline: 10px;
		background: var(--paper);
		color: var(--ink);
		border: 1px solid var(--rule-strong);
		font-size: 14px;
		font-variant-numeric: tabular-nums;
	}

	.qty-input:focus {
		outline: none;
		border-color: var(--ink);
	}

	.total {
		font-size: 15px;
		font-variant-numeric: tabular-nums;
		text-align: right;
		white-space: nowrap;
	}

	.remove button {
		background: none;
		border: none;
		padding: 4px 0;
		color: var(--faint);
		cursor: pointer;
	}

	.remove button:hover {
		color: var(--ink);
	}

	.summary {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-end;
		justify-content: space-between;
		gap: 24px;
		padding-top: 8px;
	}

	.row {
		display: flex;
		align-items: baseline;
		gap: 20px;
	}

	.row span:first-child {
		color: var(--faint);
	}

	.amount {
		font-size: 24px;
		font-weight: 500;
		letter-spacing: -0.02em;
		font-variant-numeric: tabular-nums;
	}

	.note {
		margin-top: 10px;
		color: var(--faint);
	}

	@media (min-width: 700px) {
		.line {
			grid-template-columns: 64px minmax(0, 1fr) auto auto auto;
			gap: 24px;
		}
	}
</style>
