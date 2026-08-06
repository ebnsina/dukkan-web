<script lang="ts">
	/* The queue. Anything waiting on the shop comes first, because that is the
	   only kind of question that needs doing today. */
	import Seo from '$lib/seo/Seo.svelte';
	import { ViewIcon } from '@hugeicons/core-free-icons';
	import { Chip } from '$lib/ui';
	import DataTable from '$lib/admin/DataTable.svelte';
	import PageTop from '$lib/admin/PageTop.svelte';
	import RowActions from '$lib/admin/RowActions.svelte';
	import { formatRelativeTime } from '$lib/utils/format';

	let { data } = $props();

	/* Named for who is holding the ball. "Answered" tells a shop owner nothing
	   about what to do; "waiting on them" tells them to leave it alone. */
	const STATE: Record<string, { word: string; tone: 'warning' | 'neutral' | 'success' }> = {
		open: { word: 'Waiting on you', tone: 'warning' },
		answered: { word: 'Waiting on them', tone: 'neutral' },
		closed: { word: 'Done', tone: 'success' }
	};

	const STATUSES = [
		{ value: '', word: 'Everything' },
		{ value: 'open', word: 'Waiting on you' },
		{ value: 'answered', word: 'Waiting on them' },
		{ value: 'closed', word: 'Done' }
	];

	const waiting = $derived(data.tickets.filter((t) => t.status === 'open').length);
	const searching = $derived(Boolean(data.filters.q || data.filters.status));
</script>

<Seo title="Support" description="Questions from your customers." noindex />

<PageTop trail={[{ label: 'Support' }]}>
	{#snippet meta()}
		{#if waiting > 0}
			{waiting}
			{waiting === 1 ? 'question' : 'questions'} waiting on you
		{/if}
	{/snippet}

	{#snippet filters()}
		<form method="GET" class="dk-filters">
			<label class="sr-only" for="tickets-q">Search</label>
			<input
				id="tickets-q"
				class="dk-input"
				type="search"
				name="q"
				value={data.filters.q}
				placeholder="Name, mobile or subject"
			/>
			<label class="sr-only" for="tickets-status">Status</label>
			<select
				id="tickets-status"
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
	rows={data.tickets}
	noun="question"
	nounPlural="questions"
	emptyTitle={searching ? 'Nothing matches' : 'No questions yet'}
	emptyBody={searching
		? 'Try a different search, or clear it to see everything.'
		: 'When a customer asks something from your shop, it appears here instead of only on your phone.'}
>
	{#snippet head()}
		<th scope="col">Question</th>
		<th scope="col">Who</th>
		<th scope="col">Order</th>
		<th scope="col">Status</th>
		<th scope="col">Last word</th>
		<th scope="col"><span class="sr-only">Actions</span></th>
	{/snippet}

	{#snippet row(ticket)}
		{@const state = STATE[ticket.status] ?? { word: ticket.status, tone: 'neutral' as const }}
		<tr>
			<td>
				<a class="dk-strong" href="/admin/support/{ticket.id}">{ticket.subject}</a>
				<span class="sub dk-num">{ticket.number}</span>
			</td>
			<td>
				{ticket.name}
				<span class="sub dk-num">{ticket.phone}</span>
			</td>
			<td class="dk-num">{ticket.order_number ?? '—'}</td>
			<td><Chip tone={state.tone} label={state.word} /></td>
			<td class="dk-quiet">{formatRelativeTime(ticket.last_reply_at)}</td>
			<td class="right">
				<RowActions
					label={ticket.subject}
					items={[{ label: 'Open it', icon: ViewIcon, href: `/admin/support/${ticket.id}` }]}
				/>
			</td>
		</tr>
	{/snippet}
</DataTable>

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
