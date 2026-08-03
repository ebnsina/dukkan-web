<script lang="ts">
	interface Props {
		status: string;
		emphasis?: boolean;
	}

	let { status, emphasis = false }: Props = $props();

	const WORDS: Record<string, string> = {
		placed: 'Placed',
		confirmed: 'Confirmed',
		processing: 'Packing',
		shipped: 'On its way',
		delivered: 'Delivered',
		cancelled: 'Cancelled',
		returned: 'Returned',
		pending: 'Waiting',
		paid: 'Paid',
		failed: 'Failed',
		refunded: 'Refunded',
		partially_refunded: 'Part refunded',
		packed: 'Packed'
	};
</script>

<span
	class="status"
	class:is-strong={emphasis}
	class:is-quiet={status === 'cancelled' || status === 'returned'}
>
	{WORDS[status] ?? status}
</span>

<style>
	.status {
		font-size: 13px;
		color: var(--muted);
		white-space: nowrap;
	}

	.is-strong {
		font-weight: 600;
		color: var(--ink);
	}

	.is-quiet {
		color: var(--faint);
	}
</style>
