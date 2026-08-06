<script lang="ts">
	import { enhance } from '$app/forms';
	import { announce } from '$lib/admin/announce';
	import {
		ArrowTurnBackwardIcon,
		CheckmarkCircle02Icon,
		StoreRemove01Icon
	} from '@hugeicons/core-free-icons';
	import Seo from '$lib/seo/Seo.svelte';
	import { Banner, Button, Chip, Confirm, Field, Stat } from '$lib/ui';
	import DataTable from '$lib/admin/DataTable.svelte';
	import PageTop from '$lib/admin/PageTop.svelte';
	import PageActions from '$lib/admin/PageActions.svelte';
	import RowActions from '$lib/admin/RowActions.svelte';
	import FormSheet from '$lib/admin/FormSheet.svelte';
	import { formatMinor } from '$lib/utils/money';
	import { formatDate, formatNumber, formatRelativeTime } from '$lib/utils/format';
	import { SHOP_STATE } from '$lib/platform/state';

	let { data } = $props();

	const shop = $derived(data.shop);
	const shopState = $derived(SHOP_STATE[shop.status]);
	const overridden = $derived(new Set(data.overrides.map((o) => o.feature)));

	let suspending = $state(false);

	const label = (feature: string) => feature.replace(/_/g, ' ');
</script>

<Seo title={shop.name} description="Internal." noindex />

<PageTop trail={[{ label: 'Shops', href: '/platform' }, { label: shop.name }]}>
	{#snippet meta()}
		{shop.slug} · <Chip tone={shopState.tone} label={shopState.word} /> · {shop.plan_name} · signed up
		{formatDate(shop.created_at)}
	{/snippet}

	{#snippet actions()}
		{#if shop.status === 'suspended'}
			<!-- The form is here so the page owns it; the menu only names it. -->
			<form
				method="POST"
				action="?/status"
				id="shop-status"
				use:enhance={announce('Their status is changed.')}
			>
				<input type="hidden" name="status" value="active" />
			</form>
		{/if}
		<PageActions
			label={shop.name}
			items={[
				shop.status === 'suspended'
					? {
							label: 'Put the shop back up',
							description: 'Their storefront answers again and their customers can buy.',
							icon: CheckmarkCircle02Icon,
							formId: 'shop-status'
						}
					: {
							label: 'Take the shop down',
							description:
								'Their storefront stops answering and their customers see a closed shop.',
							icon: StoreRemove01Icon,
							danger: true,
							onselect: () => (suspending = true)
						}
			]}
		/>
	{/snippet}
</PageTop>

{#if shop.status === 'past_due'}
	<div class="msg">
		<Banner title="Behind on payment" tone="warning">
			Their storefront is up and they are still selling — that is deliberate. Mark the bill paid
			under Bills and they go back to active on their own.
		</Banner>
	</div>
{/if}

<section class="dk-stats">
	<Stat label="Items" value={formatNumber(shop.products)} />
	<Stat
		label="Orders"
		value={formatNumber(shop.orders_total)}
		sub="{formatNumber(shop.orders_this_month)} this month"
	/>
	<Stat label="Sold" value={formatMinor(shop.revenue_minor)} sub="cancelled excluded" />
	<Stat
		label="Last order"
		value={shop.last_order_at ? formatRelativeTime(shop.last_order_at) : 'never'}
	/>
</section>

<div class="usage">
	<div class="dk-acts">
		<FormSheet
			action="?/plan"
			title="Move them to another plan"
			description="Changing the plan changes their limits immediately. It does not change what they have already been billed."
			saved="Plan changed. Their limits moved straight away."
		>
			{#snippet trigger(open)}
				<Button variant="quiet" size="sm" onclick={open}>Change plan</Button>
			{/snippet}
			<Field label="Plan">
				{#snippet control(props)}
					<select {...props} class="dk-select" name="plan_code" value={shop.plan_code}>
						{#each data.plans as plan (plan.code)}
							<option value={plan.code}>
								{plan.name} — {formatMinor(plan.price_minor, plan.currency)}
								{plan.is_public ? '' : '(not on sale)'}
							</option>
						{/each}
					</select>
				{/snippet}
			</Field>
		</FormSheet>

		<FormSheet
			action="?/override"
			title="Give them something the plan does not"
			description="Sits over the plan rather than editing it, so the price list stays the price list. Use it for a promise made on a call, or an apology."
			saved="Override set."
		>
			{#snippet trigger(open)}
				<Button variant="quiet" size="sm" onclick={open}>Set an override</Button>
			{/snippet}
			<Field label="Feature" required>
				{#snippet control(props)}
					<select {...props} class="dk-select" name="feature" required>
						{#each data.usage as u (u.feature)}
							<option value={u.feature}>{label(u.feature)}</option>
						{/each}
					</select>
				{/snippet}
			</Field>
			<Field label="Limit" hint="Blank means unlimited.">
				{#snippet control(props)}
					<input {...props} class="dk-input" name="limit" inputmode="numeric" />
				{/snippet}
			</Field>
			<Field label="On?">
				{#snippet control(props)}
					<select {...props} class="dk-select" name="enabled">
						<option value="on">Give it to them</option>
						<option value="">Take it away</option>
					</select>
				{/snippet}
			</Field>
		</FormSheet>
	</div>

	<DataTable title="Usage" rows={data.usage} noun="feature" paged={false}>
		{#snippet head()}
			<th scope="col">Feature</th>
			<th scope="col" data-numeric>Used</th>
			<th scope="col" data-numeric>Limit</th>
			<th scope="col">Source</th>
			<th scope="col"><span class="sr-only">Actions</span></th>
		{/snippet}

		{#snippet row(u)}
			<tr>
				<td><span class="dk-strong">{label(u.feature)}</span></td>
				<td data-numeric>{u.enabled ? formatNumber(u.used) : '—'}</td>
				<td data-numeric>
					{#if !u.enabled}
						<Chip tone="neutral" label="Off" />
					{:else if u.limit === null}
						Unlimited
					{:else}
						<span class:over={u.over}>{formatNumber(u.limit)}</span>
					{/if}
				</td>
				<td>
					{#if overridden.has(u.feature)}
						<Chip tone="info" label="Override" />
					{:else}
						<span class="dk-quiet">Plan</span>
					{/if}
				</td>
				<td class="right">
					<!-- A feature on plan limits has nothing to clear, so no menu at all. -->
					{#if overridden.has(u.feature)}
						<!-- The form is here so the row owns it; the menu only names it. -->
						<form
							method="POST"
							action="?/clearOverride"
							id="clear-override-{u.feature}"
							use:enhance={announce('Back to whatever the plan says.')}
						>
							<input type="hidden" name="feature" value={u.feature} />
						</form>
						<RowActions
							label={label(u.feature)}
							items={[
								{
									label: 'Clear the override',
									icon: ArrowTurnBackwardIcon,
									formId: `clear-override-${u.feature}`
								}
							]}
						/>
					{/if}
				</td>
			</tr>
		{/snippet}
	</DataTable>
</div>

<Confirm bind:open={suspending} title="Take {shop.name} down?">
	Their storefront stops answering and their customers see a closed shop. Their data is untouched
	and comes straight back when you put them up again.
	{#snippet actions()}
		<form method="POST" action="?/status" use:enhance={announce('Their status is changed.')}>
			<input type="hidden" name="status" value="suspended" />
			<Button type="submit" variant="danger" onclick={() => (suspending = false)}>
				Take it down
			</Button>
		</form>
	{/snippet}
</Confirm>

<style>
	.msg {
		margin-bottom: 14px;
	}

	.usage {
		margin-top: 14px;
	}

	.usage .dk-acts {
		justify-content: flex-end;
		margin-bottom: 10px;
	}

	.over {
		color: var(--warning);
	}

	.right {
		text-align: right;
	}
</style>
