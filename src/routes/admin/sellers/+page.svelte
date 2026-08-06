<script lang="ts">
	/* Who sells on this marketplace, and on what terms.
	 *
	 * Until this page existed a seller could only be brought into being with
	 * psql: the API has had apply, approve, reject and suspend since the
	 * beginning, and none of it had a screen. So a marketplace could price
	 * commission and a seller could fulfil orders, while nobody could become one.
	 */
	import { enhance } from '$app/forms';
	import Seo from '$lib/seo/Seo.svelte';
	import {
		CheckmarkCircle02Icon,
		Cancel01Icon,
		PercentIcon,
		UserBlock01Icon
	} from '@hugeicons/core-free-icons';
	import { Chip, Field } from '$lib/ui';
	import DataTable from '$lib/admin/DataTable.svelte';
	import PageTop from '$lib/admin/PageTop.svelte';
	import RowActions from '$lib/admin/RowActions.svelte';
	import FormSheet from '$lib/admin/FormSheet.svelte';
	import { formatMinor } from '$lib/utils/money';
	import { formatDate } from '$lib/utils/format';
	import type { AdminSeller } from '$lib/admin/types';

	let { data, form } = $props();

	/* Which seller a sheet is about. Held rather than passed, because the sheet
	   lives outside the table and the row that opened it is gone by then.

	   One piece of state per sheet, not two. Closing it clears the seller, so a
	   sheet cannot be reopened still carrying the last one's hidden id — which
	   is the way this goes wrong: an approve or a suspend aimed at the wrong
	   shop, with nothing on screen to show it. */
	let rejecting = $state<AdminSeller | null>(null);
	let suspending = $state<AdminSeller | null>(null);
	let pricing = $state<AdminSeller | null>(null);

	const shut = (clear: () => void) => (open: boolean) => {
		if (!open) clear();
	};

	const fields = $derived((form as { fields?: Record<string, string> } | null)?.fields ?? {});

	const STATUSES = [
		{ value: '', word: 'Everyone' },
		{ value: 'pending', word: 'Waiting on you' },
		{ value: 'approved', word: 'Selling' },
		{ value: 'rejected', word: 'Turned down' },
		{ value: 'suspended', word: 'Stopped' }
	];

	/* The API's words, and what they mean to whoever is reading. "Pending" is
	   about the marketplace owner, not the applicant, so it says so. */
	const STATE: Record<
		string,
		{ word: string; tone: 'neutral' | 'success' | 'warning' | 'danger' }
	> = {
		pending: { word: 'Waiting on you', tone: 'warning' },
		approved: { word: 'Selling', tone: 'success' },
		rejected: { word: 'Turned down', tone: 'neutral' },
		suspended: { word: 'Stopped', tone: 'danger' },
		closed: { word: 'Closed', tone: 'neutral' }
	};

	/* What this seller is charged, said in one line. A seller with no rate of
	   their own is on the shop default, and saying so is the point — an empty
	   cell would read as charging them nothing. */
	function terms(seller: AdminSeller, currency: string) {
		const parts: string[] = [];
		if (seller.commission_milli === null) {
			parts.push('Shop default');
		} else {
			parts.push(`${seller.commission_milli / 1000}%`);
		}
		if (seller.commission_fixed_minor) {
			parts.push(`+ ${formatMinor(seller.commission_fixed_minor, currency)}`);
		}
		return parts.join(' ');
	}

	const currency = $derived(data.shop?.currency ?? 'BDT');
	const waiting = $derived(data.sellers.filter((s) => s.status === 'pending').length);
</script>

<Seo title="Sellers" description="Who sells on your marketplace." noindex />

<PageTop trail={[{ label: 'Sellers' }]}>
	{#snippet meta()}
		{#if waiting > 0}
			{waiting}
			{waiting === 1 ? 'application' : 'applications'} waiting on you
		{/if}
	{/snippet}

	{#snippet filters()}
		<form method="GET" class="dk-filters">
			<label class="sr-only" for="sellers-status">Status</label>
			<select
				id="sellers-status"
				class="dk-select"
				name="status"
				onchange={(e) => e.currentTarget.form?.requestSubmit()}
				value={data.filters.status}
			>
				{#each STATUSES as status (status.value)}
					<option value={status.value}>{status.word}</option>
				{/each}
			</select>
		</form>
	{/snippet}
</PageTop>

<DataTable
	rows={data.sellers}
	noun="seller"
	emptyTitle={data.filters.status ? 'Nobody here' : 'No sellers yet'}
	emptyBody={data.filters.status
		? 'Try a different filter to see everyone.'
		: 'Anybody who applies to sell on your marketplace shows up here for you to look at.'}
>
	{#snippet head()}
		<th scope="col">Shop</th>
		<th scope="col">Contact</th>
		<th scope="col">District</th>
		<th scope="col">Status</th>
		<th scope="col">You charge</th>
		<th scope="col">Applied</th>
		<th scope="col"><span class="sr-only">Actions</span></th>
	{/snippet}

	{#snippet row(seller)}
		{@const state = STATE[seller.status] ?? { word: seller.status, tone: 'neutral' as const }}
		<tr>
			<td>
				<span class="dk-strong">{seller.name}</span>
				{#if seller.tagline}<span class="sub">{seller.tagline}</span>{/if}
				{#if seller.status === 'rejected' && seller.rejection_reason}
					<span class="sub">Turned down: {seller.rejection_reason}</span>
				{/if}
			</td>
			<td class="dk-num">{seller.phone}</td>
			<td>{seller.district ?? '—'}</td>
			<td><Chip tone={state.tone} label={state.word} /></td>
			<td>{terms(seller, currency)}</td>
			<td class="dk-quiet">{formatDate(seller.created_at)}</td>
			<td class="right">
				<!-- Approving takes no further detail, so its form lives on the row
				     and the menu only names it. Anything that needs a reason opens
				     a sheet instead. -->
				<form method="POST" action="?/approve" id="approve-{seller.id}" use:enhance>
					<input type="hidden" name="id" value={seller.id} />
				</form>
				<RowActions
					label={seller.name}
					items={[
						...(seller.status !== 'approved'
							? [
									{
										label: 'Let them sell',
										icon: CheckmarkCircle02Icon,
										formId: `approve-${seller.id}`
									}
								]
							: []),
						{
							label: 'Set their rate',
							icon: PercentIcon,
							onselect: () => (pricing = seller)
						},
						...(seller.status === 'pending'
							? [
									{
										label: 'Turn them down',
										icon: Cancel01Icon,
										danger: true,
										onselect: () => (rejecting = seller)
									}
								]
							: []),
						...(seller.status === 'approved'
							? [
									{
										label: 'Stop them selling',
										icon: UserBlock01Icon,
										danger: true,
										onselect: () => (suspending = seller)
									}
								]
							: [])
					]}
				/>
			</td>
		</tr>
	{/snippet}
</DataTable>

{#if rejecting}
	<FormSheet
		bind:open={() => rejecting !== null, shut(() => (rejecting = null))}
		title="Turn down {rejecting.name}"
		description="They are told why, so they can fix it and apply again."
		action="?/reject"
		saved="They have been told."
		submitLabel="Turn them down"
	>
		<input type="hidden" name="id" value={rejecting.id} />
		<Field label="Why" required error={fields.reason}>
			{#snippet control(props)}
				<input
					{...props}
					class="dk-input"
					name="reason"
					placeholder="What they would need to change"
					required
				/>
			{/snippet}
		</Field>
	</FormSheet>
{/if}

{#if suspending}
	<FormSheet
		bind:open={() => suspending !== null, shut(() => (suspending = null))}
		title="Stop {suspending.name} selling"
		description="Their products come off the storefront and they lose access straight away. Orders already placed are unaffected."
		action="?/suspend"
		saved="They can no longer sell here."
		submitLabel="Stop them"
	>
		<input type="hidden" name="id" value={suspending.id} />
		<Field label="Why" hint="Optional, but they will ask.">
			{#snippet control(props)}
				<input {...props} class="dk-input" name="reason" />
			{/snippet}
		</Field>
	</FormSheet>
{/if}

{#if pricing}
	<!-- Narrowed once here: the setter below may clear `pricing`, which is
	     enough for the compiler to stop trusting the guard inside a snippet. -->
	{@const seller = pricing}
	<FormSheet
		bind:open={() => pricing !== null, shut(() => (pricing = null))}
		title="What you charge {pricing.name}"
		description="Leave both empty and they are charged whatever the shop charges everyone else."
		action="?/commission"
		saved="Saved. It applies to their next order."
	>
		<input type="hidden" name="id" value={pricing.id} />
		<Field
			label="Your share, as a percentage"
			hint="Empty means the shop default applies to them."
			error={fields.percent}
		>
			{#snippet control(props)}
				<input
					{...props}
					class="dk-input"
					name="percent"
					inputmode="decimal"
					placeholder="Shop default"
					value={seller.commission_milli === null ? '' : seller.commission_milli / 1000}
				/>
			{/snippet}
		</Field>
		<Field
			label="A flat fee per order, in taka"
			hint="On top of the percentage. Leave empty for none."
			error={fields.fixed}
		>
			{#snippet control(props)}
				<input
					{...props}
					class="dk-input"
					name="fixed"
					inputmode="decimal"
					placeholder="None"
					value={seller.commission_fixed_minor === null ? '' : seller.commission_fixed_minor / 100}
				/>
			{/snippet}
		</Field>
		<p class="dk-hint">
			Orders already placed keep the rate they were placed under. Changing this never restates what
			a seller was owed last month.
		</p>
	</FormSheet>
{/if}

<style>
	.right {
		text-align: right;
	}

	.sub {
		display: block;
		margin-top: 3px;
		font-size: 12px;
		color: var(--d-faint);
	}
</style>
