<script lang="ts">
	import { Button, Dialog, Empty, Note, Section, Skeleton, Spinner, Table, toasts } from '$lib/ui';
	import { ApiError, toUserMessage } from '$lib/api';
	import { formatCurrency, formatDate, formatNumber } from '$lib/utils/format';
	import DsBlock from '../DsBlock.svelte';

	let dismissed = $state(false);
	let plain = $state(false);
	let confirm = $state(false);

	const errors = [
		new ApiError({ kind: 'offline', code: 'OFFLINE' }),
		new ApiError({ kind: 'http', code: 'PLAN_LIMIT_REACHED', status: 402 }),
		new ApiError({ kind: 'http', code: 'PAYMENT_FAILED', status: 402 }),
		new ApiError({ kind: 'http', code: 'SOMETHING_WE_DO_NOT_KNOW', status: 500 })
	];

	const payouts = [
		{ seller: 'Nokshi Home', orders: 128, gross: 184250, cut: 22110, net: 162140 },
		{ seller: 'Dhaka Threads', orders: 1042, gross: 1284900, cut: 154188, net: 1130712 },
		{ seller: 'Chattogram Tea', orders: 47, gross: 39420, cut: 4730, net: 34690 },
		{ seller: 'Sylhet Spice Co', orders: 9, gross: 7150, cut: 858, net: 6292 }
	];
</script>

<Section
	id="feedback"
	eyebrow="06 / Feedback"
	heading="Telling people things."
	lead="A quiet note sits on a surface behind a hairline. Anything with a state takes a 3px edge and a wash in its own colour, so a warning is legible as a warning before the sentence is read."
	rule
>
	<DsBlock label="Note" flow="stack">
		<div class="stack">
			<Note title="Payout booked">The next one runs on Sunday at 22:00.</Note>
			<Note title="Nearly at your order limit" tone="firm">
				You have used 4,600 of 5,000 orders this month. Move up a plan to keep selling.
				{#snippet actions()}
					<Button variant="ghost" href="/ds#feedback">See plans</Button>
				{/snippet}
			</Note>
			{#if !dismissed}
				<Note
					title="We cannot reach bKash"
					tone="firm"
					dismissible
					ondismiss={() => (dismissed = true)}
				>
					Payments are paused until it comes back. Nobody was charged twice.
				</Note>
			{:else}
				<Button variant="ghost" onclick={() => (dismissed = false)}>Bring the note back</Button>
			{/if}
		</div>
	</DsBlock>

	<DsBlock
		label="Error copy"
		note="The API sends a code. The frontend never invents the words."
		flow="stack"
	>
		<dl class="errors">
			{#each errors as error (error.code)}
				<div>
					<dt class="t-mono">{error.code}</dt>
					<dd>{toUserMessage(error)}</dd>
				</div>
			{/each}
		</dl>
	</DsBlock>

	<DsBlock label="Toast and dialog">
		<Button
			variant="ghost"
			onclick={() =>
				toasts.push({
					title: 'Seller invited',
					description: 'Nokshi Home will get an email shortly.'
				})}
		>
			Raise a toast
		</Button>
		<Button variant="ghost" onclick={() => toasts.clear()}>Clear toasts</Button>
		<Button variant="ghost" onclick={() => (plain = true)}>Open a dialog</Button>
		<Button variant="ghost" onclick={() => (confirm = true)}>Confirm something</Button>
	</DsBlock>

	<DsBlock label="Waiting" flow="stack">
		<div class="waiting">
			<Spinner />
			<div class="lines">
				<Skeleton class="w-40" />
				<Skeleton class="w-64" />
				<Skeleton class="w-24" />
			</div>
		</div>
	</DsBlock>

	<DsBlock
		label="Table"
		note="Numeric columns switch to mono, right-aligned, tabular."
		flow="stack"
	>
		<Table caption="Seller payouts, week of {formatDate('2026-03-08')}">
			<thead>
				<tr>
					<th scope="col">Seller</th>
					<th scope="col" data-numeric>Orders</th>
					<th scope="col" data-numeric>Taken</th>
					<th scope="col" data-numeric>Your cut</th>
					<th scope="col" data-numeric>Paid out</th>
				</tr>
			</thead>
			<tbody>
				{#each payouts as row (row.seller)}
					<tr>
						<td class="seller">{row.seller}</td>
						<td data-numeric>{formatNumber(row.orders)}</td>
						<td data-numeric>{formatCurrency(row.gross)}</td>
						<td data-numeric>{formatCurrency(row.cut)}</td>
						<td data-numeric>{formatCurrency(row.net)}</td>
					</tr>
				{/each}
			</tbody>
		</Table>
	</DsBlock>

	<DsBlock label="Nothing here yet" flow="stack">
		<Empty
			title="No sellers yet"
			description="Invite your first seller and their shop shows up here within minutes."
		>
			{#snippet actions()}
				<Button arrow>Invite a seller</Button>
				<Button variant="ghost">Bring in a list</Button>
			{/snippet}
		</Empty>
	</DsBlock>
</Section>

<Dialog
	bind:open={plain}
	title="Invite a seller"
	description="They get an email with a link to set up their shop."
>
	<p>
		The seller fills in their own products and papers. Nothing reaches your shopfront until you say
		so.
	</p>
	{#snippet footer()}
		<Button variant="ghost" onclick={() => (plain = false)}>Cancel</Button>
		<Button onclick={() => (plain = false)} arrow>Send it</Button>
	{/snippet}
</Dialog>

<Dialog bind:open={confirm} title="Pause Nokshi Home?">
	<p>
		Their shop goes dark straight away. Orders already placed stay open. You can undo this later.
	</p>
	{#snippet footer()}
		<Button variant="ghost" onclick={() => (confirm = false)}>Leave it running</Button>
		<Button onclick={() => (confirm = false)}>Pause the seller</Button>
	{/snippet}
</Dialog>

<style>
	.stack {
		display: flex;
		flex-direction: column;
		gap: 16px;
		max-width: 62ch;
	}

	.errors > div {
		display: grid;
		gap: 4px 24px;
		padding-block: 12px;
		border-bottom: 1px solid var(--rule);
	}

	.errors dt {
		font-size: 11px;
		letter-spacing: 0.08em;
		color: var(--faint);
	}

	.errors dd {
		font-size: 14px;
		line-height: 1.6;
	}

	.waiting {
		display: flex;
		align-items: center;
		gap: 32px;
		color: var(--muted);
	}

	.lines {
		display: flex;
		flex-direction: column;
		gap: 10px;
		flex: 1;
		max-width: 320px;
	}

	.seller {
		color: var(--ink);
		font-weight: 600;
	}

	@media (min-width: 720px) {
		.errors > div {
			grid-template-columns: 260px minmax(0, 1fr);
			align-items: baseline;
		}
	}
</style>
