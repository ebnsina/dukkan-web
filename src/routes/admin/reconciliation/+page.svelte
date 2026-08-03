<script lang="ts">
	import { enhance } from '$app/forms';
	import Seo from '$lib/seo/Seo.svelte';
	import { Button, Empty, Note } from '$lib/ui';
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

<div class="head">
	<div>
		<h1 class="t-heading">Money owed</h1>
		<p class="lead t-lead">
			Everything the courier collected but has not handed over, and everything that does not add up.
		</p>
	</div>
	<form method="POST" action="?/sweep" use:enhance>
		<Button type="submit" variant="ghost">Check for late payments</Button>
	</form>
</div>

{#if form?.message}
	<Note title="That did not work" tone="firm">{form.message}</Note>
{:else if form?.flagged !== undefined}
	<Note title="Checked">
		{form.flagged === 0
			? 'Nothing new. Every delivered parcel has been paid for.'
			: `${formatNumber(form.flagged)} more parcels are overdue and have been added below.`}
	</Note>
{/if}

<dl class="figures">
	<div class:is-alarm={critical.length > 0}>
		<dt class="t-label">Serious</dt>
		<dd class="t-mono">{formatNumber(critical.length)}</dd>
	</div>
	<div>
		<dt class="t-label">Worth a look</dt>
		<dd class="t-mono">{formatNumber(rest.length)}</dd>
	</div>
	<div>
		<dt class="t-label">Not accounted for</dt>
		<dd class="t-mono">{formatMinor(unaccounted)}</dd>
	</div>
</dl>

{#if data.issues.length === 0}
	<div class="empty">
		<Empty
			title="Everything adds up"
			description="Every taka the courier collected has reached you. Nothing needs your attention."
		/>
	</div>
{:else}
	{#snippet issueRow(issue: (typeof data.issues)[number])}
		<li class="issue" class:is-critical={issue.severity === 'critical'}>
			<div class="issue-main">
				<h3 class="t-sub">{HEADING[issue.kind] ?? issue.kind}</h3>
				<p class="detail">{issue.detail}</p>
				<p class="meta t-label">
					{issue.severity === 'critical' ? 'Serious' : 'Worth a look'} ·
					{formatRelativeTime(issue.created_at)}
				</p>
			</div>

			<dl class="amounts">
				{#if issue.expected_minor !== null}
					<div>
						<dt class="t-label">Should be</dt>
						<dd class="t-mono">{formatMinor(issue.expected_minor)}</dd>
					</div>
				{/if}
				{#if issue.actual_minor !== null}
					<div>
						<dt class="t-label">Came in</dt>
						<dd class="t-mono">{formatMinor(issue.actual_minor)}</dd>
					</div>
				{/if}
				{#if issue.expected_minor !== null && issue.actual_minor !== null}
					<div class="gap">
						<dt class="t-label">
							{issue.actual_minor > issue.expected_minor ? 'Over by' : 'Short by'}
						</dt>
						<dd class="t-mono">
							{formatMinor(Math.abs(issue.expected_minor - issue.actual_minor))}
						</dd>
					</div>
				{/if}
			</dl>

			<div class="issue-action">
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
							name="resolution"
							placeholder="What did you do about it?"
							required
						/>
						<button class="save t-button" type="submit">Save</button>
						<button class="drop t-button" type="button" onclick={() => (openId = '')}>Cancel</button
						>
					</form>
				{:else}
					<button class="mark t-button" type="button" onclick={() => (openId = issue.id)}>
						Mark as dealt with
					</button>
				{/if}
			</div>
		</li>
	{/snippet}

	{#if critical.length > 0}
		<section class="group">
			<h2 class="group-head t-label">Deal with these first</h2>
			<ul>
				{#each critical as issue (issue.id)}{@render issueRow(issue)}{/each}
			</ul>
		</section>
	{/if}

	{#if rest.length > 0}
		<section class="group">
			<h2 class="group-head t-label">Worth a look</h2>
			<ul>
				{#each rest as issue (issue.id)}{@render issueRow(issue)}{/each}
			</ul>
		</section>
	{/if}
{/if}

<style>
	.head {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-start;
		justify-content: space-between;
		gap: 20px;
	}

	.lead {
		margin-top: 16px;
		color: var(--muted);
	}

	.figures {
		display: grid;
		gap: 1px;
		background: var(--rule);
		border: 1px solid var(--rule);
		margin-top: 32px;
	}

	.figures > div {
		background: var(--paper);
		padding: 20px 22px;
	}

	.figures dt {
		color: var(--faint);
	}

	.figures dd {
		margin-top: 10px;
		font-size: 28px;
		font-weight: 500;
		letter-spacing: -0.03em;
		font-variant-numeric: tabular-nums;
	}

	/* Nothing red exists here, so a serious count is inverted instead. */
	.is-alarm {
		background: var(--inverse-paper) !important;
		color: var(--inverse-ink);
	}

	.is-alarm dt {
		color: var(--inverse-ink);
		opacity: 0.7;
	}

	.empty {
		margin-top: 40px;
	}

	.group {
		margin-top: 48px;
	}

	.group-head {
		color: var(--faint);
		padding-bottom: 14px;
		border-bottom: 1px solid var(--rule-strong);
	}

	.issue {
		display: grid;
		gap: 20px;
		padding: 26px 0 26px 18px;
		border-bottom: 1px solid var(--rule);
		border-left: 1px solid transparent;
	}

	/* Weight and a heavy edge carry the alarm, since there is no red. */
	.is-critical {
		border-left: 3px solid var(--ink);
		padding-left: 16px;
		padding-block: 32px;
	}

	.is-critical .t-sub {
		font-weight: 700;
	}

	.detail {
		margin-top: 10px;
		font-size: var(--size-body);
		line-height: 1.6;
		color: var(--muted);
		max-width: 56ch;
	}

	.meta {
		margin-top: 12px;
		color: var(--faint);
	}

	.amounts {
		display: flex;
		flex-wrap: wrap;
		gap: 24px;
	}

	.amounts dt {
		color: var(--faint);
	}

	.amounts dd {
		margin-top: 7px;
		font-size: 19px;
		font-variant-numeric: tabular-nums;
		color: var(--ink);
	}

	.gap dd {
		font-weight: 700;
	}

	.mark,
	.save,
	.drop {
		height: 34px;
		padding-inline: 14px;
		border: 1px solid var(--rule-strong);
		background: none;
		color: var(--muted);
		cursor: pointer;
	}

	.mark:hover,
	.drop:hover {
		color: var(--ink);
		border-color: var(--ink);
	}

	.save {
		background: var(--inverse-paper);
		color: var(--inverse-ink);
		border-color: var(--inverse-paper);
	}

	.resolve {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.resolve input {
		flex: 1;
		min-width: 200px;
		height: 34px;
		padding-inline: 12px;
		background: var(--paper);
		color: var(--ink);
		border: 1px solid var(--rule-strong);
		font-family: var(--font-display);
		font-size: 14px;
	}

	.resolve input:focus {
		outline: none;
		border-color: var(--ink);
	}

	@media (min-width: 640px) {
		.figures {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}

	@media (min-width: 1000px) {
		.issue {
			grid-template-columns: minmax(0, 1fr) auto auto;
			align-items: start;
			gap: 40px;
		}
	}
</style>
