<script lang="ts">
	import { enhance } from '$app/forms';
	import Seo from '$lib/seo/Seo.svelte';
	import { CheckmarkCircle02Icon, RefreshIcon } from '@hugeicons/core-free-icons';
	import { Banner, Button, Empty, Frame, Stat } from '$lib/admin/ui';
	import { formatMinor } from '$lib/utils/money';
	import { formatNumber, formatRelativeTime } from '$lib/utils/format';
	import type { IssueKind } from '$lib/admin/types';

	let { data, form } = $props();

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

	let openId = $state('');
</script>

<Seo title="Money owed" description="What the courier collected but has not handed over." noindex />

<div class="dk-title-row">
	<div>
		<h1 class="dk-h1">Money owed</h1>
		<p class="dk-date">
			Everything the courier collected but has not handed over, and everything that does not add up.
		</p>
	</div>
	<form method="POST" action="?/sweep" use:enhance class="dk-acts">
		<Button type="submit" variant="quiet" icon={RefreshIcon}>Check for late payments</Button>
	</form>
</div>

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

{#if data.issues.length === 0}
	<Frame eyebrow="Reconciliation" variant="flush">
		<Empty
			title="Everything adds up"
			description="Every taka the courier collected has reached you. Nothing needs your attention."
		/>
	</Frame>
{:else}
	{#snippet issueRow(issue: (typeof data.issues)[number])}
		<li class="issue">
			<div class="issue-main">
				<h3 class="dk-h2">{HEADING[issue.kind] ?? issue.kind}</h3>
				<p class="detail">{issue.detail}</p>
				<p class="dk-hint">{formatRelativeTime(issue.created_at)}</p>
			</div>

			<dl class="amounts">
				{#if issue.expected_minor !== null}
					<div>
						<dt class="dk-eyebrow">Should be</dt>
						<dd>{formatMinor(issue.expected_minor)}</dd>
					</div>
				{/if}
				{#if issue.actual_minor !== null}
					<div>
						<dt class="dk-eyebrow">Came in</dt>
						<dd>{formatMinor(issue.actual_minor)}</dd>
					</div>
				{/if}
				{#if issue.expected_minor !== null && issue.actual_minor !== null}
					<div class="gap">
						<dt class="dk-eyebrow">
							{issue.actual_minor > issue.expected_minor ? 'Over by' : 'Short by'}
						</dt>
						<dd>{formatMinor(Math.abs(issue.expected_minor - issue.actual_minor))}</dd>
					</div>
				{/if}
			</dl>

			<div>
				{#if openId === issue.id}
					<form
						method="POST"
						action="?/resolve"
						use:enhance={() =>
							async ({ update }) => {
								openId = '';
								await update();
							}}
						class="resolve"
					>
						<input type="hidden" name="id" value={issue.id} />
						<label class="sr-only" for="res-{issue.id}">What did you do about it?</label>
						<input
							id="res-{issue.id}"
							class="dk-input"
							name="resolution"
							placeholder="What did you do about it?"
							required
						/>
						<Button type="submit" size="sm" icon={CheckmarkCircle02Icon}>Save</Button>
						<Button variant="quiet" size="sm" onclick={() => (openId = '')}>Cancel</Button>
					</form>
				{:else}
					<Button
						variant="quiet"
						size="sm"
						icon={CheckmarkCircle02Icon}
						label="Mark as dealt with: {HEADING[issue.kind] ?? issue.kind}"
						onclick={() => (openId = issue.id)}
					>
						Mark as dealt with
					</Button>
				{/if}
			</div>
		</li>
	{/snippet}

	<div class="dk-stack">
		{#if critical.length > 0}
			<Frame
				eyebrow="Serious"
				title="Deal with these first"
				action="{formatNumber(critical.length)} open"
			>
				<ul class="issues">
					{#each critical as issue (issue.id)}{@render issueRow(issue)}{/each}
				</ul>
			</Frame>
		{/if}

		{#if rest.length > 0}
			<Frame
				eyebrow="Everything else"
				title="Worth a look"
				action="{formatNumber(rest.length)} open"
			>
				<ul class="issues">
					{#each rest as issue (issue.id)}{@render issueRow(issue)}{/each}
				</ul>
			</Frame>
		{/if}
	</div>
{/if}

<style>
	.lead-banner {
		margin-bottom: 14px;
	}

	.issues {
		display: flex;
		flex-direction: column;
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.issue {
		display: grid;
		gap: 18px;
		padding: 16px 12px;
		border-radius: var(--r-control);
	}

	.issue + .issue {
		border-top: 1px solid var(--d-card);
	}

	.detail {
		margin: 8px 0 0;
		font-size: 13px;
		line-height: 1.6;
		color: var(--d-muted);
		max-width: 56ch;
	}

	.issue-main .dk-hint {
		display: block;
		margin-top: 8px;
	}

	.amounts {
		display: flex;
		flex-wrap: wrap;
		gap: 24px;
		margin: 0;
	}

	.amounts dd {
		margin: 6px 0 0;
		font-size: 17px;
		font-weight: 600;
		font-variant-numeric: tabular-nums;
		color: var(--d-ink);
	}

	.gap dd {
		color: var(--danger);
	}

	.resolve {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.resolve .dk-input {
		flex: 1;
		min-width: 200px;
	}

	@media (min-width: 1000px) {
		.issue {
			grid-template-columns: minmax(0, 1fr) auto auto;
			align-items: start;
			gap: 32px;
		}
	}
</style>
