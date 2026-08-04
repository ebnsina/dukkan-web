<script lang="ts">
	import { Chip } from '$lib/ui';
	import { orderState, paymentState } from '$lib/admin/state';

	interface Props {
		status: string;
		/** Payment states share words with order states and mean other things. */
		kind?: 'order' | 'payment';
	}

	let { status, kind = 'order' }: Props = $props();

	const state = $derived(kind === 'payment' ? paymentState(status) : orderState(status));
</script>

<Chip tone={state.tone} label={state.word} icon={state.icon} />
