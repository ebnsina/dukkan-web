<script lang="ts">
	import { enhance } from '$app/forms';
	import Seo from '$lib/seo/Seo.svelte';
	import { CancelCircleIcon, PlusSignIcon } from '@hugeicons/core-free-icons';
	import { Button, Chip, Confirm, Field, Radio, toasts } from '$lib/ui';
	import DataTable from '$lib/admin/DataTable.svelte';
	import PageTop from '$lib/admin/PageTop.svelte';
	import RowActions from '$lib/admin/RowActions.svelte';
	import FormSheet from '$lib/admin/FormSheet.svelte';
	import { formatMinor } from '$lib/utils/money';
	import { formatNumber } from '$lib/utils/format';
	import type { Coupon } from '$lib/admin/types';

	let { data, form } = $props();

	/* The two actions fail with different shapes, so the values are narrowed
	   once here rather than asserted at each field. */
	let values = $derived((form as { values?: Record<string, string> } | null)?.values ?? {});
	let fields = $derived((form as { fields?: Record<string, string> } | null)?.fields ?? {});

	let kind = $state<'percent' | 'fixed'>('percent');
	let withdrawing = $state<Coupon | null>(null);

	const currency = 'BDT';

	/* What the code actually takes off, in one phrase. A shop owner reading a
	   list wants the offer, not the four columns it is stored in. */
	function offer(c: Coupon): string {
		if (c.kind === 'percent') {
			const pct = (c.percent_bp ?? 0) / 100;
			const cap = c.max_discount_minor;
			return cap ? `${pct}% off, up to ${formatMinor(cap, currency)}` : `${pct}% off`;
		}
		return `${formatMinor(c.amount_minor ?? 0, currency)} off`;
	}

	/* Withdrawn is not the same as used up, and neither is the same as live.
	   A shop owner asking "why is nobody using this" needs to be told which. */
	function standing(c: Coupon): { label: string; tone: 'success' | 'neutral' | 'warning' } {
		if (!c.is_active) return { label: 'Withdrawn', tone: 'neutral' };
		if (c.max_redemptions !== null && c.redeemed_count >= c.max_redemptions)
			return { label: 'All claimed', tone: 'warning' };
		return { label: 'Live', tone: 'success' };
	}

	function used(c: Coupon): string {
		const taken = formatNumber(c.redeemed_count);
		return c.max_redemptions === null ? taken : `${taken} of ${formatNumber(c.max_redemptions)}`;
	}
</script>

<Seo title="Discounts" description="Codes your customers can use." noindex />

{#snippet codeForm()}
	<Field label="Code" required error={fields.code}>
		{#snippet control(props)}
			<input
				{...props}
				class="dk-input t-mono"
				name="code"
				value={values.code ?? ''}
				placeholder="EID15"
				autocapitalize="characters"
				autocomplete="off"
				required
			/>
		{/snippet}
	</Field>

	<fieldset class="kinds">
		<legend class="t-label">Type</legend>
		<Radio bind:group={kind} name="kind" value="percent" label="Percentage" />
		<Radio bind:group={kind} name="kind" value="fixed" label="Fixed amount" />
	</fieldset>

	<Field label={kind === 'percent' ? 'Percentage' : 'Amount'} required error={fields.value}>
		{#snippet control(props)}
			<input
				{...props}
				class="dk-input t-mono"
				name="value"
				type="number"
				step={kind === 'percent' ? '0.5' : '1'}
				min="0"
				value={values.value ?? ''}
				placeholder={kind === 'percent' ? '15' : '200'}
				required
			/>
		{/snippet}
	</Field>

	{#if kind === 'percent'}
		<Field label="Maximum discount" hint="Optional.">
			{#snippet control(props)}
				<input
					{...props}
					class="dk-input t-mono"
					name="max_discount"
					type="number"
					min="0"
					value={values.max_discount ?? ''}
					placeholder="200"
				/>
			{/snippet}
		</Field>
	{/if}

	<Field label="Minimum order" hint="Optional.">
		{#snippet control(props)}
			<input
				{...props}
				class="dk-input t-mono"
				name="min_order"
				type="number"
				min="0"
				value={values.min_order ?? ''}
				placeholder="1000"
			/>
		{/snippet}
	</Field>

	<div class="pair-fields">
		<Field label="Usage limit" hint="Optional.">
			{#snippet control(props)}
				<input
					{...props}
					class="dk-input t-mono"
					name="max_redemptions"
					type="number"
					min="1"
					value={values.max_redemptions ?? ''}
					placeholder="100"
				/>
			{/snippet}
		</Field>
		<Field label="Per customer" hint="Optional.">
			{#snippet control(props)}
				<input
					{...props}
					class="dk-input t-mono"
					name="max_per_customer"
					type="number"
					min="1"
					value={values.max_per_customer ?? ''}
					placeholder="1"
				/>
			{/snippet}
		</Field>
	</div>
{/snippet}

<PageTop trail={[{ label: 'Discounts' }]}>
	{#snippet actions()}
		<FormSheet
			title="Discount code"
			action="?/create"
			saved="The code is live."
			description="It works at checkout as soon as you save it."
		>
			{#snippet trigger(open)}
				<Button icon={PlusSignIcon} onclick={open}>New code</Button>
			{/snippet}
			{@render codeForm()}
		</FormSheet>
	{/snippet}
</PageTop>

<DataTable
	rows={data.coupons}
	noun="discount"
	emptyTitle="No codes yet"
	emptyBody="Create one and it works at checkout straight away."
>
	{#snippet head()}
		<th scope="col">Code</th>
		<th scope="col">Discount</th>
		<th scope="col">Used</th>
		<th scope="col">Status</th>
		<th scope="col"><span class="sr-only">Actions</span></th>
	{/snippet}

	{#snippet row(c: Coupon)}
		{@const s = standing(c)}
		<tr>
			<td class="code t-mono">{c.code}</td>
			<td>
				{offer(c)}
				{#if c.min_order_minor > 0}
					<span class="dk-hint">on {formatMinor(c.min_order_minor, currency)} and over</span>
				{/if}
			</td>
			<td class="t-mono">{used(c)}</td>
			<td><Chip tone={s.tone} label={s.label} /></td>
			<td class="right">
				<!-- A withdrawn code has nothing left to do to it, so it gets no menu. -->
				{#if c.is_active}
					<RowActions
						label={c.code}
						items={[
							{
								label: 'Withdraw',
								icon: CancelCircleIcon,
								danger: true,
								onselect: () => (withdrawing = c)
							}
						]}
					/>
				{/if}
			</td>
		</tr>
	{/snippet}
</DataTable>

<!-- Withdrawing is not deletion, and the wording says so: the code stops
     working, and the orders that used it keep their history. -->
<Confirm
	open={withdrawing !== null}
	title="Withdraw {withdrawing?.code ?? ''}?"
	description="It stops working at checkout. Existing orders are unaffected."
>
	{#snippet footer()}
		<Button variant="quiet" size="sm" onclick={() => (withdrawing = null)}>Keep it</Button>
		<form
			method="POST"
			action="?/withdraw"
			use:enhance={() => {
				return async ({ result, update }) => {
					withdrawing = null;
					await update();
					if (result.type === 'success') toasts.success('That code is withdrawn.');
				};
			}}
		>
			<input type="hidden" name="id" value={withdrawing?.id ?? ''} />
			<Button type="submit" variant="danger" size="sm">Withdraw it</Button>
		</form>
	{/snippet}
</Confirm>

<style>
	.code {
		font-weight: 650;
	}

	.right {
		text-align: right;
	}

	.kinds {
		display: flex;
		flex-direction: column;
		gap: 10px;
		margin: 0;
		padding: 0;
		border: 0;
	}

	.kinds legend {
		margin-bottom: 6px;
		padding: 0;
		color: var(--d-faint);
	}

	.pair-fields {
		display: grid;
		gap: 14px;
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}
</style>
