<script lang="ts">
	/* What an order comes to.
	 *
	 * The admin and the storefront both show this ladder, and both had it
	 * written out in full — same four rows, same conditional discount, same
	 * order. Two copies of an arithmetic summary is how one of them quietly
	 * stops showing a line the other does.
	 *
	 * Layout differences belong at the call site: it takes `class`, which is
	 * merged last, the same as every component in the library. */
	import { cn } from '$lib/utils/cn';
	import { formatMinor } from '$lib/utils/money';

	interface Props {
		order: {
			subtotal_minor: number;
			shipping_minor: number;
			discount_minor: number;
			total_minor: number;
			currency: string;
		};
		class?: string;
	}

	let { order, class: className }: Props = $props();
</script>

<dl class={cn('totals', className)}>
	<div>
		<dt>Subtotal</dt>
		<dd class="t-mono">{formatMinor(order.subtotal_minor, order.currency)}</dd>
	</div>
	<div>
		<dt>Delivery</dt>
		<dd class="t-mono">{formatMinor(order.shipping_minor, order.currency)}</dd>
	</div>
	{#if order.discount_minor > 0}
		<div>
			<dt>Discount</dt>
			<dd class="t-mono">−{formatMinor(order.discount_minor, order.currency)}</dd>
		</div>
	{/if}
	<div class="grand">
		<dt>Total</dt>
		<dd class="t-mono">{formatMinor(order.total_minor, order.currency)}</dd>
	</div>
</dl>

<style>
	.totals {
		display: flex;
		flex-direction: column;
		gap: 10px;
		margin: 0;
	}

	.totals > div {
		display: flex;
		justify-content: space-between;
		gap: 20px;
		font-size: 14px;
		color: var(--muted);
	}

	.totals dd {
		margin: 0;
		font-variant-numeric: tabular-nums;
		color: var(--ink);
	}

	.grand {
		padding-top: 12px;
		border-top: 1px solid var(--rule-strong);
		font-weight: 650;
	}

	/* The figure a person actually reads. One size for it, where the two copies
	   had drifted to 18px and 20px. */
	.grand dd {
		font-size: 18px;
	}
</style>
