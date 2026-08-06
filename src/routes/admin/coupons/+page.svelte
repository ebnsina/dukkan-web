<script lang="ts">
	import { enhance } from '$app/forms';
	import Seo from '$lib/seo/Seo.svelte';
	import { CheckmarkCircle02Icon, PlusSignIcon } from '@hugeicons/core-free-icons';
	import {
		Button,
		Chip,
		Confirm,
		Drawer,
		Empty,
		Field,
		Frame,
		Radio,
		Table,
		toasts
	} from '$lib/ui';
	import { formatMinor } from '$lib/utils/money';
	import { formatNumber } from '$lib/utils/format';
	import type { Coupon } from '$lib/admin/types';

	let { data, form } = $props();

	/* The two actions fail with different shapes, so the values are narrowed
	   once here rather than asserted at each field. */
	let values = $derived((form as { values?: Record<string, string> } | null)?.values ?? {});
	let fields = $derived((form as { fields?: Record<string, string> } | null)?.fields ?? {});

	let kind = $state<'percent' | 'fixed'>('percent');
	/* Bumped after a code is made, to remount the form clean. `enhance` resets
	   the form element itself, which clears the radios without telling the
	   binding — leaving nothing selected while the fields below still say
	   "amount". Remounting puts markup and state back in step together. */
	let formVersion = $state(0);
	let making = $state(false);
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

<div class="dk-title-row">
	<div>
		<h1 class="dk-h1">Discounts</h1>
		<p class="dk-date">Codes customers use at checkout.</p>
	</div>
	<div class="dk-acts">
		<Button icon={PlusSignIcon} onclick={() => (making = true)}>New code</Button>
	</div>
</div>

<Frame eyebrow="Codes" title="Codes" variant={data.coupons.length ? 'rows' : 'pad'}>
	{#if data.coupons.length === 0}
		<Empty title="No codes yet" description="Create one and it works at checkout straight away." />
	{:else}
		<Table caption="Discount codes">
			<thead>
				<tr>
					<th scope="col">Code</th>
					<th scope="col">Discount</th>
					<th scope="col">Used</th>
					<th scope="col">Status</th>
					<th scope="col"><span class="sr-only">Actions</span></th>
				</tr>
			</thead>
			<tbody>
				{#each data.coupons as c (c.id)}
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
							{#if c.is_active}
								<Button size="sm" variant="quiet" onclick={() => (withdrawing = c)}>
									Withdraw
								</Button>
							{/if}
						</td>
					</tr>
				{/each}
			</tbody>
		</Table>
	{/if}
</Frame>

<!-- A form belongs on a sheet: the list stays readable behind it, and a form
     is a thing you finish and put down rather than part of the page. -->
<Drawer bind:open={making} size="wide" title="Discount code">
	{#key formVersion}
		<form
			method="POST"
			action="?/create"
			use:enhance={() =>
				async ({ result, update }) => {
					await update({ reset: false });
					/* The sheet closes and the toast carries the news, so a shop owner
					   is looking at their list of codes when they are told the new one
					   is live — not at the form that made it. */
					if (result.type === 'success') {
						const done = (result.data as { done?: string } | undefined)?.done;
						toasts.success(done ?? 'The code is live.');
						kind = 'percent';
						formVersion += 1;
						making = false;
					} else if (result.type === 'failure') {
						const message = (result.data as { message?: string } | undefined)?.message;
						if (message) toasts.error(message);
					}
				}}
			class="dk-form"
		>
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

			<div class="dk-acts">
				<Button type="submit" icon={CheckmarkCircle02Icon}>Save</Button>
			</div>
		</form>
	{/key}
</Drawer>

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
	.msg {
		margin-bottom: 16px;
	}

	.pair {
		align-items: start;
	}

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

	@media (min-width: 1000px) {
		.pair {
			grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr);
		}
	}
</style>
