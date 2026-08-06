<script lang="ts">
	import { enhance } from '$app/forms';
	import Seo from '$lib/seo/Seo.svelte';
	import { MoneyReceive02Icon, RefreshIcon } from '@hugeicons/core-free-icons';
	import { Banner, Chip, Field, Stat } from '$lib/ui';
	import DataTable from '$lib/admin/DataTable.svelte';
	import PageTop from '$lib/admin/PageTop.svelte';
	import PageActions from '$lib/admin/PageActions.svelte';
	import RowActions from '$lib/admin/RowActions.svelte';
	import FormSheet from '$lib/admin/FormSheet.svelte';
	import { formatMinor } from '$lib/utils/money';
	import { formatDate, formatNumber } from '$lib/utils/format';
	import { INVOICE_STATE } from '$lib/platform/state';
	import type { PlatformInvoice } from '$lib/platform/types';

	let { data, form } = $props();

	const open = $derived(data.invoices.filter((i) => i.status === 'open'));
	const owed = $derived(open.reduce((sum, i) => sum + i.total_minor, 0));
	const today = new Date().toISOString().slice(0, 10);
	const overdue = $derived(open.filter((i) => i.due_on.slice(0, 10) < today));

	/* The bill being settled, rather than a bare flag: one sheet serves every
	   row, and it is the bill that tells it whose money this is. */
	let settling = $state<PlatformInvoice | null>(null);

	/* Each action returns a different shape, so the sweep's result is narrowed
	   once here rather than asserted at every reference. */
	const ran = $derived((form as { ran?: { issued: number; past_due: number } } | null)?.ran);
</script>

<Seo title="Bills" description="Internal." noindex />

<PageTop trail={[{ label: 'Bills' }]}>
	{#snippet actions()}
		<!-- The form is here so the page owns it; the menu only names it. -->
		<form method="POST" action="?/run" id="issue-due" use:enhance></form>
		<PageActions
			label="bills"
			items={[
				{
					label: 'Issue anything due',
					description:
						'Bills every shop whose month has ended. Running it again bills nobody twice.',
					icon: RefreshIcon,
					formId: 'issue-due'
				}
			]}
		/>
	{/snippet}
</PageTop>

{#if ran}
	<div class="msg">
		<Banner title="Swept" tone={ran.issued === 0 && ran.past_due === 0 ? 'success' : 'info'}>
			{ran.issued === 0
				? 'No period had ended, so nothing was billed.'
				: `${formatNumber(ran.issued)} bills issued.`}
			{#if ran.past_due > 0}
				{formatNumber(ran.past_due)} shops moved to behind — they are still open and still selling.
			{/if}
			Running it again bills nobody twice.
		</Banner>
	</div>
{/if}

<section class="dk-stats">
	<Stat
		label="Unpaid"
		value={formatNumber(open.length)}
		tone={open.length > 0 ? 'warning' : 'neutral'}
	/>
	<Stat
		label="Past the due date"
		value={formatNumber(overdue.length)}
		sub="chase these"
		tone={overdue.length > 0 ? 'danger' : 'neutral'}
	/>
	<Stat label="Owed to us" value={formatMinor(owed)} sub="across every unpaid bill" />
</section>

<DataTable
	rows={data.invoices}
	noun="bill"
	emptyTitle="Nothing billed yet"
	emptyBody="Bills appear when a shop's month ends. Press “Issue anything due” to sweep now."
>
	{#snippet head()}
		<th scope="col">Shop</th>
		<th scope="col">Period</th>
		<th scope="col" data-numeric>Amount</th>
		<th scope="col">Status</th>
		<th scope="col"><span class="sr-only">Actions</span></th>
	{/snippet}

	{#snippet row(invoice)}
		{@const state = INVOICE_STATE[invoice.status]}
		<tr>
			<td>
				<a class="dk-strong" href="/platform/shops/{invoice.tenant_id}">
					{invoice.shop_name}
				</a>
				<span class="sub">{invoice.number}</span>
			</td>
			<td>
				{formatDate(invoice.period_start)}
				{#if invoice.overage_orders > 0}
					<span class="sub">
						{formatNumber(invoice.overage_orders)} orders past their allowance
					</span>
				{/if}
			</td>
			<td data-numeric>{formatMinor(invoice.total_minor, invoice.currency)}</td>
			<td>
				<Chip tone={state.tone} label={state.word} />
				{#if invoice.status === 'open'}
					<span class="sub" class:late={invoice.due_on.slice(0, 10) < today}>
						due {formatDate(invoice.due_on)}
					</span>
				{:else if invoice.paid_method}
					<span class="sub">
						{invoice.paid_method}{#if invoice.paid_reference}
							· {invoice.paid_reference}{/if}
					</span>
				{/if}
			</td>
			<td class="right">
				<!-- A settled bill has nothing left to do to it, so it gets no menu. -->
				{#if invoice.status === 'open'}
					<RowActions
						label={invoice.number}
						items={[
							{
								label: 'Mark paid',
								icon: MoneyReceive02Icon,
								onselect: () => (settling = invoice)
							}
						]}
					/>
				{/if}
			</td>
		</tr>
	{/snippet}
</DataTable>

<FormSheet
	bind:open={
		() => settling !== null,
		(want) => {
			if (!want) settling = null;
		}
	}
	action="?/paid"
	title={settling ? `Mark ${settling.number} paid` : 'Mark paid'}
	description="Money that has already arrived — we take nobody's card. Say how it came in so it can be found again in a statement."
	saved="Marked paid. If that was all they owed, their shop is active again."
>
	<input type="hidden" name="id" value={settling?.id ?? ''} />
	<Field label="How they paid" required>
		{#snippet control(props)}
			<select {...props} class="dk-select" name="method">
				<option value="bkash">bKash</option>
				<option value="nagad">Nagad</option>
				<option value="bank">Bank transfer</option>
				<option value="cash">Cash</option>
			</select>
		{/snippet}
	</Field>
	<Field label="Their reference" hint="The transaction id, so this can be matched later.">
		{#snippet control(props)}
			<input {...props} class="dk-input" name="reference" />
		{/snippet}
	</Field>
</FormSheet>

<style>
	.msg {
		margin-bottom: 14px;
	}

	.sub {
		display: block;
		margin-top: 3px;
		font-size: 12px;
		color: var(--d-faint);
	}

	.late {
		color: var(--danger);
	}

	.right {
		text-align: right;
	}
</style>
