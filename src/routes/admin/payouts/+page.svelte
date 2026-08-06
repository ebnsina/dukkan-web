<script lang="ts">
	/* Paying sellers.
	 *
	 * Dukkàn never holds or moves money, so nothing on this page sends
	 * anything. The shop owner pays by bKash, by Nagad or across a counter, and
	 * writes it down here so the ledger stops saying they still owe it. Saying
	 * that plainly is the whole design: a screen that looked like it could send
	 * money would be lying about what happens when you press the button.
	 */
	import Seo from '$lib/seo/Seo.svelte';
	import { MoneySend01Icon } from '@hugeicons/core-free-icons';
	import { Button, Field, Frame } from '$lib/ui';
	import DataTable from '$lib/admin/DataTable.svelte';
	import PageTop from '$lib/admin/PageTop.svelte';
	import FormSheet from '$lib/admin/FormSheet.svelte';
	import { formatMinor } from '$lib/utils/money';
	import { formatDate } from '$lib/utils/format';
	import type { VendorOwing } from '$lib/admin/types';

	let { data, form } = $props();

	let paying = $state<VendorOwing | null>(null);

	const fields = $derived((form as { fields?: Record<string, string> } | null)?.fields ?? {});
	const currency = $derived(data.shop?.currency ?? 'BDT');
	const total = $derived(data.owing.reduce((sum, o) => sum + o.owed_minor, 0));

	const METHOD: Record<string, string> = {
		bkash: 'bKash',
		nagad: 'Nagad',
		bank: 'Bank transfer',
		cash: 'Cash',
		other: 'Some other way'
	};

	const shut = (clear: () => void) => (open: boolean) => {
		if (!open) clear();
	};
</script>

<Seo title="Paying sellers" description="What you owe, and what you have sent." noindex />

<PageTop trail={[{ label: 'Paying sellers' }]}>
	{#snippet meta()}
		{#if total > 0}
			{formatMinor(total, currency)} owed in total
		{/if}
	{/snippet}
</PageTop>

<Frame eyebrow="Owed" title="Who is waiting" variant="pad">
	{#if data.owing.length === 0}
		<p class="dk-note">
			Nobody is owed anything. Sellers are owed once their parcel is delivered and the courier has
			passed the money on.
		</p>
	{:else}
		{#each data.owing as seller (seller.vendor_id)}
			<div class="row">
				<span class="what">
					<span class="dk-strong">{seller.name}</span>
					<span class="dk-quiet dk-num">{seller.phone}</span>
				</span>
				<span class="amount dk-strong">{formatMinor(seller.owed_minor, currency)}</span>
				<Button size="sm" icon={MoneySend01Icon} onclick={() => (paying = seller)}>
					Write down a payment
				</Button>
			</div>
		{/each}

		<p class="dk-hint">
			Dukkàn does not send money. Pay them however you normally do, then write it down here so this
			list stays true.
		</p>
	{/if}
</Frame>

<div class="paid">
	<DataTable
		title="What you have sent"
		rows={data.payouts}
		noun="payment"
		emptyTitle="Nothing sent yet"
		emptyBody="Payments you write down appear here, so you and your sellers can agree on what has been settled."
	>
		{#snippet head()}
			<th scope="col">Seller</th>
			<th scope="col" data-numeric>Amount</th>
			<th scope="col">How</th>
			<th scope="col">Their reference</th>
			<th scope="col">When</th>
		{/snippet}

		{#snippet row(payout)}
			<tr>
				<td class="dk-strong">{payout.vendor_name}</td>
				<td data-numeric>{formatMinor(payout.amount_minor, currency)}</td>
				<td>{METHOD[payout.method] ?? payout.method}</td>
				<td class="dk-num">{payout.reference || '—'}</td>
				<td class="dk-quiet">{formatDate(payout.paid_on)}</td>
			</tr>
		{/snippet}
	</DataTable>
</div>

{#if paying}
	{@const seller = paying}
	<FormSheet
		bind:open={() => paying !== null, shut(() => (paying = null))}
		title="What you sent {seller.name}"
		description="This does not send anything. It writes down a payment you have already made, so they stop showing as owed."
		action="?/record"
		saved="Written down. They are no longer owed it."
	>
		<input type="hidden" name="vendor_id" value={seller.vendor_id} />

		<Field
			label="How much, in taka"
			hint="You owe them {formatMinor(seller.owed_minor, currency)}."
			required
			error={fields.amount ?? fields.amount_minor}
		>
			{#snippet control(props)}
				<input
					{...props}
					class="dk-input"
					name="amount"
					inputmode="decimal"
					value={seller.owed_minor / 100}
					required
				/>
			{/snippet}
		</Field>

		<Field label="How you sent it" required error={fields.method}>
			{#snippet control(props)}
				<select {...props} class="dk-select" name="method" required>
					<option value="bkash">bKash</option>
					<option value="nagad">Nagad</option>
					<option value="bank">Bank transfer</option>
					<option value="cash">Cash</option>
					<option value="other">Some other way</option>
				</select>
			{/snippet}
		</Field>

		<Field label="Their reference" hint="The transaction number. They will quote it if they ring.">
			{#snippet control(props)}
				<input {...props} class="dk-input" name="reference" />
			{/snippet}
		</Field>

		<Field label="When you sent it" hint="Leave empty for today." error={fields.paid_on}>
			{#snippet control(props)}
				<input {...props} class="dk-input" name="paid_on" type="date" />
			{/snippet}
		</Field>

		<Field label="A note" hint="Optional, for your own records.">
			{#snippet control(props)}
				<input {...props} class="dk-input" name="note" />
			{/snippet}
		</Field>
	</FormSheet>
{/if}

<style>
	.row {
		display: flex;
		align-items: center;
		gap: 16px;
		padding-block: 12px;
	}

	.row + .row {
		border-top: 1px solid var(--d-card);
	}

	.what {
		display: flex;
		flex-direction: column;
		gap: 2px;
		flex: 1;
		min-width: 0;
	}

	.amount {
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
	}

	.paid {
		margin-top: 14px;
	}
</style>
