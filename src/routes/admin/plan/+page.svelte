<script lang="ts">
	import Seo from '$lib/seo/Seo.svelte';
	import { Banner, Chip, Frame, Progress } from '$lib/ui';
	import DataTable from '$lib/admin/DataTable.svelte';
	import PageTop from '$lib/admin/PageTop.svelte';
	import { formatMinor } from '$lib/utils/money';
	import { formatDate, formatNumber } from '$lib/utils/format';
	import type { SubscriptionInvoice, UsageLine } from '$lib/admin/types';

	let { data } = $props();

	/* Feature keys are ours; these are the words a shop owner uses. */
	const LABEL: Record<UsageLine['feature'], string> = {
		products: 'Items you sell',
		orders_per_month: 'Orders this month',
		staff_seats: 'People who can sign in',
		vendors: 'Sellers',
		ai_credits: 'AI credits this month',
		custom_domain: 'Your own web address',
		vendor_subscriptions: 'Charging your sellers',
		webhooks: 'Sending data to other software'
	};

	/* Counted things free up when you delete one; metered things reset with the
	   month. Saying which stops "you are full" reading as permanent. */
	const RESETS = 'Starts again at the beginning of next month.';
	const FREES = 'Deleting one gives the space back.';

	/* Three buckets, and the only question that decides them is whether the
	   plan carries the feature and whether it puts a number on it. A capped
	   feature gets a bar; an uncapped one is just on; the rest is what a bigger
	   plan would add. */
	const counted = $derived(data.report.usage.filter((u) => u.enabled && u.limit !== null));
	const included = $derived(data.report.usage.filter((u) => u.enabled && u.limit === null));
	const missing = $derived(data.report.usage.filter((u) => !u.enabled));

	/* Uncapped reads as "Unlimited" for a thing you can run out of, and simply
	   "Included" for a switch — nobody has an unlimited number of web addresses. */
	const COUNTABLE = new Set<UsageLine['feature']>([
		'products',
		'orders_per_month',
		'staff_seats',
		'vendors',
		'ai_credits'
	]);

	const tone = (u: UsageLine) => {
		if (u.limit === null) return 'neutral';
		const share = u.used / u.limit;
		if (u.over || share >= 1) return u.metered ? 'warning' : 'danger';
		return share >= 0.8 ? 'warning' : 'neutral';
	};

	const current = $derived(data.plans.find((p) => p.code === data.report.plan));
	const better = $derived(
		data.plans.filter((p) => p.price_minor > (current?.price_minor ?? 0))[0] ?? null
	);

	const tight = $derived(counted.filter((u) => u.over || u.used / (u.limit ?? 1) >= 0.8));
	const unpaid = $derived(data.billing.invoices.filter((i) => i.status === 'open'));
</script>

<Seo title="Your plan" description="What your plan includes and what you have used." noindex />

<PageTop trail={[{ label: 'Your plan' }]}>
	{#snippet meta()}
		{#if current}
			{current.name} — {formatMinor(current.price_minor, current.currency)} a {current.interval ===
			'yearly'
				? 'year'
				: 'month'}
		{:else}
			{data.report.plan}
		{/if}
	{/snippet}
</PageTop>

{#if unpaid.length > 0}
	<div class="msg">
		<Banner
			title={data.billing.shop_status === 'past_due'
				? 'Your account is behind'
				: 'You have a bill to pay'}
			tone={data.billing.shop_status === 'past_due' ? 'warning' : 'info'}
		>
			{unpaid.length === 1 ? 'One bill is' : `${formatNumber(unpaid.length)} bills are`} waiting —
			{formatMinor(
				unpaid.reduce((sum, i) => sum + i.total_minor, 0),
				unpaid[0].currency
			)} in total. Send it by bKash or bank transfer and message us the reference; we mark it off by hand
			while we are small.
			{#if data.billing.shop_status === 'past_due'}
				Your shop is still open and still taking orders.
			{/if}
		</Banner>
	</div>
{/if}

{#if tight.length > 0}
	<div class="msg">
		<Banner
			title={tight.some((u) => u.over) ? 'You have gone past a limit' : 'You are close to a limit'}
			tone={tight.some((u) => u.over) ? 'warning' : 'info'}
		>
			{#each tight as u (u.feature)}
				<p class="tight">
					{LABEL[u.feature]}: {formatNumber(u.used)} of {formatNumber(u.limit ?? 0)}.
					{#if u.feature === 'orders_per_month' && u.over}
						Your customers can still order — we would never turn one away over this — but the extra
						is billed on top.
					{:else}
						{u.metered ? RESETS : FREES}
					{/if}
				</p>
			{/each}
			{#if better}
				{better.name} raises these, at {formatMinor(better.price_minor, better.currency)} a month.
			{/if}
		</Banner>
	</div>
{/if}

<Frame eyebrow="This month" title="What you have used" variant="pad">
	<div class="bars">
		{#each counted as u (u.feature)}
			<Progress
				label={LABEL[u.feature]}
				value={u.used}
				max={u.limit ?? 0}
				valueLabel="{formatNumber(u.used)} of {formatNumber(u.limit ?? 0)}"
				tone={tone(u)}
			/>
		{/each}
	</div>

	{#snippet footer()}
		<span>Orders and AI credits start again on the first of each month.</span>
	{/snippet}
</Frame>

<div class="cols">
	{#if included.length > 0}
		<Frame eyebrow="Included" title="With no limit" variant="pad">
			<ul class="list">
				{#each included as u (u.feature)}
					<li>
						<span>{LABEL[u.feature]}</span>
						<Chip
							tone="success"
							label={u.metered || COUNTABLE.has(u.feature) ? 'Unlimited' : 'Included'}
						/>
					</li>
				{/each}
			</ul>
		</Frame>
	{/if}

	{#if data.billing.invoices.length > 0}
		<DataTable
			title="What you have been charged"
			rows={data.billing.invoices}
			noun="bill"
			perPage={10}
		>
			{#snippet head()}
				<th scope="col">Period</th>
				<th scope="col" data-numeric>Amount</th>
				<th scope="col">Status</th>
			{/snippet}

			{#snippet row(invoice: SubscriptionInvoice)}
				<tr>
					<td>
						<span class="dk-strong">{formatDate(invoice.period_start)}</span>
						<span class="sub">
							{invoice.number}
							{#if invoice.overage_orders > 0}
								· {formatNumber(invoice.overage_orders)} orders past your allowance
							{/if}
						</span>
					</td>
					<td data-numeric>{formatMinor(invoice.total_minor, invoice.currency)}</td>
					<td>
						{#if invoice.status === 'paid'}
							<Chip tone="success" label="Paid" />
						{:else if invoice.status === 'void'}
							<Chip tone="neutral" label="Cancelled" />
						{:else}
							<Chip tone="warning" label="Due {formatDate(invoice.due_on)}" />
						{/if}
					</td>
					<!-- Nothing to do to a bill from here: paying one is a bKash or bank
					     transfer, and an operator marks it off. -->
					<td class="right"></td>
				</tr>
			{/snippet}
		</DataTable>
	{/if}

	{#if missing.length > 0}
		<Frame eyebrow="Not included" title="What a bigger plan adds" variant="pad">
			<ul class="list">
				{#each missing as u (u.feature)}
					<li>
						<span class="dk-quiet">{LABEL[u.feature]}</span>
						<Chip tone="neutral" label="Not on this plan" />
					</li>
				{/each}
			</ul>
			{#snippet footer()}
				<span>
					{#if better}
						{better.name} is {formatMinor(better.price_minor, better.currency)} a month. Message us to
						move — we do it by hand while we are small.
					{:else}
						You are on the largest plan.
					{/if}
				</span>
			{/snippet}
		</Frame>
	{/if}
</div>

<style>
	.msg {
		margin-bottom: 14px;
	}

	.tight {
		margin: 0 0 4px;
	}

	.right {
		text-align: right;
	}

	.sub {
		display: block;
		margin-top: 3px;
		font-size: 12px;
		color: var(--d-faint);
	}

	.bars {
		display: flex;
		flex-direction: column;
		gap: 18px;
	}

	.cols {
		display: grid;
		gap: 14px;
		margin-top: 14px;
	}

	.list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.list li {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
	}

	.list li + li {
		border-top: 1px solid var(--d-card);
		padding-top: 10px;
	}

	@media (min-width: 900px) {
		.cols {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			align-items: start;
		}
	}
</style>
