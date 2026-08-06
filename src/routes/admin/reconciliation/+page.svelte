<script lang="ts">
	import { enhance } from '$app/forms';
	import Seo from '$lib/seo/Seo.svelte';
	import { CheckmarkCircle02Icon, RefreshIcon, Upload01Icon } from '@hugeicons/core-free-icons';
	import { Banner, Empty, Field, Frame, Stat } from '$lib/ui';
	import DataTable from '$lib/admin/DataTable.svelte';
	import PageTop from '$lib/admin/PageTop.svelte';
	import PageActions from '$lib/admin/PageActions.svelte';
	import RowActions from '$lib/admin/RowActions.svelte';
	import FormSheet from '$lib/admin/FormSheet.svelte';
	import { formatMinor } from '$lib/utils/money';
	import { formatNumber, formatRelativeTime } from '$lib/utils/format';
	import type { IssueKind, ReconciliationIssue } from '$lib/admin/types';

	let { data, form } = $props();

	/* The issue being closed, rather than a bare flag: one sheet serves every
	   row now that the row itself only carries a menu item. */
	let resolving = $state<ReconciliationIssue | null>(null);

	let importing = $state(false);

	/* Plain words for a shop owner; the API's `detail` carries the specifics. */
	const HEADING: Record<IssueKind, string> = {
		amount_mismatch: 'Wrong amount handed over',
		unknown_consignment: 'Money for a parcel we do not know',
		duplicate_remittance: 'Paid for twice',
		delivered_not_remitted: 'Delivered but not paid for',
		remitted_but_returned: 'Paid for a returned parcel',
		missing_shipment: 'No delivery record'
	};

	const critical = $derived(data.issues.filter((i) => i.severity === 'critical'));
	const rest = $derived(data.issues.filter((i) => i.severity !== 'critical'));

	const unaccounted = $derived(
		data.issues.reduce((sum, issue) => {
			const expected = issue.expected_minor;
			const actual = issue.actual_minor;
			if (expected === null && actual === null) return sum;
			return sum + Math.abs((expected ?? 0) - (actual ?? 0));
		}, 0)
	);

	const heading = (issue: ReconciliationIssue) => HEADING[issue.kind] ?? issue.kind;
</script>

<Seo title="Money owed" description="What the courier collected but has not handed over." noindex />

<PageTop trail={[{ label: 'Money owed' }]}>
	{#snippet actions()}
		<!-- The form is here so the page owns it; the menu only names it. -->
		<form method="POST" action="?/sweep" id="sweep" use:enhance></form>
		<PageActions
			label="money owed"
			items={[
				{
					label: 'Check for late payments',
					description: 'Looks for parcels delivered a while ago that nobody has paid you for.',
					icon: RefreshIcon,
					formId: 'sweep'
				},
				{
					label: 'Import their report',
					description: "Read the courier's payout file and match every line to a parcel.",
					icon: Upload01Icon,
					onselect: () => (importing = true)
				}
			]}
		/>
	{/snippet}
</PageTop>

<!-- Sweeping is the one action still on the page rather than in a sheet, so its
     failure has nowhere else to be said. -->
{#if form?.message}
	<div class="lead-banner">
		<Banner title="That did not work" tone="danger">{form.message}</Banner>
	</div>
{:else if form?.flagged !== undefined}
	<div class="lead-banner">
		<Banner title="Checked" tone={form.flagged === 0 ? 'success' : 'warning'}>
			{form.flagged === 0
				? 'Nothing new. Every delivered parcel has been paid for.'
				: `${formatNumber(form.flagged)} more parcels are overdue and have been added below.`}
		</Banner>
	</div>
{:else if form?.imported}
	{@const gap = form.imported.declared_minor - form.imported.matched_minor}
	<div class="lead-banner">
		<Banner
			title="Report read: {formatNumber(form.imported.matched_count)} of {formatNumber(
				form.imported.line_count
			)} lines matched"
			tone={gap === 0 && form.imported.issue_count === 0 ? 'success' : 'warning'}
		>
			They say they sent {formatMinor(form.imported.declared_minor)}; our records account for
			{formatMinor(form.imported.matched_minor)}.
			{#if gap !== 0}
				That is {formatMinor(Math.abs(gap))}
				{gap > 0 ? 'more than we expected' : 'short'}.
			{/if}
			{#if form.imported.issue_count > 0}
				{formatNumber(form.imported.issue_count)} lines need a person and are listed below.
			{/if}
		</Banner>
	</div>
{/if}

<section class="dk-stats">
	<Stat
		label="Serious"
		value={formatNumber(critical.length)}
		sub="deal with these first"
		tone={critical.length > 0 ? 'danger' : 'neutral'}
	/>
	<Stat
		label="Worth a look"
		value={formatNumber(rest.length)}
		sub="when you have a moment"
		tone={rest.length > 0 ? 'warning' : 'neutral'}
	/>
	<Stat label="Not accounted for" value={formatMinor(unaccounted)} sub="across every open issue" />
</section>

{#snippet issueHead()}
	<th scope="col">What happened</th>
	<th scope="col" data-numeric>Should be</th>
	<th scope="col" data-numeric>Came in</th>
	<th scope="col" data-numeric>Difference</th>
	<th scope="col"><span class="sr-only">Actions</span></th>
{/snippet}

{#snippet issueRow(issue: ReconciliationIssue)}
	<tr>
		<td>
			<span class="dk-strong">{heading(issue)}</span>
			<span class="detail">{issue.detail}</span>
			<span class="dk-hint">{formatRelativeTime(issue.created_at)}</span>
		</td>
		<td data-numeric>
			{issue.expected_minor === null ? '—' : formatMinor(issue.expected_minor)}
		</td>
		<td data-numeric>{issue.actual_minor === null ? '—' : formatMinor(issue.actual_minor)}</td>
		<td data-numeric>
			{#if issue.expected_minor !== null && issue.actual_minor !== null}
				<span class="gap">
					{issue.actual_minor > issue.expected_minor ? 'over by' : 'short by'}
					{formatMinor(Math.abs(issue.expected_minor - issue.actual_minor))}
				</span>
			{:else}
				—
			{/if}
		</td>
		<td class="right">
			<RowActions
				label={heading(issue)}
				items={[
					{
						label: 'Mark as dealt with',
						icon: CheckmarkCircle02Icon,
						onselect: () => (resolving = issue)
					}
				]}
			/>
		</td>
	</tr>
{/snippet}

{#if data.issues.length === 0}
	<Frame eyebrow="Reconciliation" variant="flush">
		<Empty
			title="Everything adds up"
			description="Every taka the courier collected has reached you. Nothing needs your attention."
		/>
	</Frame>
{:else}
	<div class="dk-stack">
		{#if critical.length > 0}
			<DataTable title="Serious" rows={critical} noun="issue" head={issueHead} row={issueRow} />
		{/if}

		{#if rest.length > 0}
			<DataTable title="Worth a look" rows={rest} noun="issue" head={issueHead} row={issueRow} />
		{/if}
	</div>
{/if}

<FormSheet
	bind:open={importing}
	title="Import the courier's report"
	description="When Steadfast pays out, upload the CSV they send. Every line is matched against a parcel; anything that does not match becomes an issue here rather than disappearing."
	action="?/import_"
	enctype="multipart/form-data"
	saved="The report has been read."
>
	<Field label="Their report" required hint="The CSV file, as it arrived.">
		{#snippet control(props)}
			<input
				{...props}
				class="dk-input"
				type="file"
				name="report"
				accept=".csv,text/csv"
				required
			/>
		{/snippet}
	</Field>
	<Field label="Payment reference" required hint="From their payment slip.">
		{#snippet control(props)}
			<input {...props} class="dk-input" name="reference" required />
		{/snippet}
	</Field>
	<Field label="Amount they sent, in taka" hint="What actually reached your bank.">
		{#snippet control(props)}
			<input {...props} class="dk-input" name="declared_total" inputmode="decimal" />
		{/snippet}
	</Field>
	<Field label="Date they paid">
		{#snippet control(props)}
			<input {...props} class="dk-input" type="date" name="settled_on" />
		{/snippet}
	</Field>
</FormSheet>

<FormSheet
	bind:open={
		() => resolving !== null,
		(want) => {
			if (!want) resolving = null;
		}
	}
	title="Mark as dealt with"
	description={resolving ? heading(resolving) : undefined}
	action="?/resolve"
	saved="That one is closed."
>
	<input type="hidden" name="id" value={resolving?.id ?? ''} />
	<p class="dk-note">{resolving?.detail ?? ''}</p>
	<Field label="What did you do about it?" required>
		{#snippet control(props)}
			<input
				{...props}
				class="dk-input"
				name="resolution"
				placeholder="They sent the rest on Sunday."
				required
			/>
		{/snippet}
	</Field>
</FormSheet>

<style>
	.lead-banner {
		margin-bottom: 14px;
	}

	.detail {
		display: block;
		margin-top: 4px;
		font-size: 12.5px;
		line-height: 1.6;
		color: var(--d-muted);
		max-width: 56ch;
	}

	.dk-hint {
		display: block;
		margin-top: 4px;
	}

	.gap {
		color: var(--danger);
	}

	.right {
		text-align: right;
	}
</style>
