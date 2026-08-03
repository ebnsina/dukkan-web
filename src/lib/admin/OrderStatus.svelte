<script lang="ts">
	import StateChip from './StateChip.svelte';
	import { orderState, paymentState } from './state';

	interface Props {
		status: string;
		/** Payment states share words with order states and mean other things. */
		kind?: 'order' | 'payment';
		/** A chip stands out; a dot suits a table where every row has one. */
		emphasis?: boolean;
	}

	let { status, kind = 'order', emphasis = false }: Props = $props();

	let state = $derived(kind === 'payment' ? paymentState(status) : orderState(status));
</script>

<StateChip tone={state.tone} label={state.word} quiet={!emphasis} />
