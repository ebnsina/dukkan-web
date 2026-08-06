<script lang="ts">
	/* One conversation.
	 *
	 * A thread rather than a form: the shop owner needs to see what was already
	 * said before they answer, and a customer quoting "you told me last week"
	 * needs there to be a last week to look at.
	 */
	import { enhance } from '$app/forms';
	import { announce } from '$lib/admin/announce';
	import Seo from '$lib/seo/Seo.svelte';
	import { CheckmarkCircle02Icon, Message01Icon, SentIcon } from '@hugeicons/core-free-icons';
	import { Button, Chip, Field, Frame } from '$lib/ui';
	import PageTop from '$lib/admin/PageTop.svelte';
	import PageActions from '$lib/admin/PageActions.svelte';
	import { formatDateTime } from '$lib/utils/format';

	let { data, form } = $props();

	const ticket = $derived(data.ticket);

	const STATE: Record<string, { word: string; tone: 'warning' | 'neutral' | 'success' }> = {
		open: { word: 'Waiting on you', tone: 'warning' },
		answered: { word: 'Waiting on them', tone: 'neutral' },
		closed: { word: 'Done', tone: 'success' }
	};

	const state = $derived(STATE[ticket.status] ?? { word: ticket.status, tone: 'neutral' as const });
	const fields = $derived((form as { fields?: Record<string, string> } | null)?.fields ?? {});
</script>

<Seo title="{ticket.subject} · Support" description="One conversation." noindex />

<PageTop trail={[{ label: 'Support', href: '/admin/support' }, { label: ticket.subject }]}>
	{#snippet meta()}
		{ticket.number} · {formatDateTime(ticket.created_at)} · <Chip
			tone={state.tone}
			label={state.word}
		/>
	{/snippet}

	{#snippet actions()}
		<form method="POST" action="?/status" id="ticket-status" use:enhance={announce('Done.')}>
			<input type="hidden" name="status" value={ticket.status === 'closed' ? 'open' : 'closed'} />
		</form>
		<PageActions
			label="conversation {ticket.number}"
			items={[
				{
					label: ticket.status === 'closed' ? 'Open it again' : 'Mark it done',
					description:
						ticket.status === 'closed'
							? 'Put it back in the queue.'
							: 'Take it off the queue. If they write again it comes back on its own.',
					icon: CheckmarkCircle02Icon,
					formId: 'ticket-status'
				},
				...(ticket.order_id
					? [
							{
								label: 'See the order',
								description: 'The order this question is about.',
								icon: Message01Icon,
								href: `/admin/orders/${ticket.order_id}`
							}
						]
					: [])
			]}
		/>
	{/snippet}
</PageTop>

<div class="cols">
	<div class="dk-stack">
		<Frame eyebrow="Conversation" title={ticket.subject} variant="pad">
			{#each ticket.messages ?? [] as message (message.id)}
				<!-- Whose words these are is the first thing a reader needs, so the
				     two sides are told apart by placement rather than by a label
				     somebody has to stop and read. -->
				<div class="msg" class:is-shop={message.author === 'staff'}>
					<div class="bubble">
						<p>{message.body}</p>
					</div>
					<span class="stamp dk-quiet">
						{message.author === 'staff' ? 'You' : ticket.name} · {formatDateTime(
							message.created_at
						)}
					</span>
				</div>
			{/each}

			<form class="reply" method="POST" action="?/reply" use:enhance={announce('Sent.')}>
				<Field label="Your answer" error={fields.body}>
					{#snippet control(props)}
						<textarea
							{...props}
							class="dk-textarea"
							name="body"
							rows="4"
							placeholder="Write back to {ticket.name}"></textarea>
					{/snippet}
				</Field>
				<div class="dk-acts">
					<Button type="submit" icon={SentIcon}>Send</Button>
				</div>
			</form>

			<!-- Said plainly rather than left to be discovered: the customer does
			     not get a text when you answer. -->
			<p class="dk-hint">
				They will see this next time they open your shop. Dukkàn does not text them — if it is
				urgent, ring {ticket.phone}.
			</p>
		</Frame>
	</div>

	<aside class="dk-stack">
		<Frame eyebrow="Who" title="Who is asking" variant="pad">
			<p class="who">
				<span class="dk-strong">{ticket.name}</span><br />
				<a href="tel:{ticket.phone}" class="dk-num">{ticket.phone}</a><br />
				{#if ticket.email}<a href="mailto:{ticket.email}">{ticket.email}</a>{/if}
			</p>
			{#if ticket.order_number}
				<p class="dk-hint">
					About order <a href="/admin/orders/{ticket.order_id}">{ticket.order_number}</a>.
				</p>
			{/if}
		</Frame>
	</aside>
</div>

<style>
	.cols {
		display: grid;
		gap: 14px;
		align-items: start;
	}

	.msg {
		display: flex;
		flex-direction: column;
		gap: 4px;
		margin-bottom: 16px;
		max-width: 42rem;
	}

	/* The shop's own words sit on the right, the customer's on the left. */
	.is-shop {
		margin-left: auto;
		align-items: flex-end;
	}

	.bubble {
		padding: 12px 14px;
		border-radius: 12px;
		background: var(--d-card);
	}

	.is-shop .bubble {
		background: var(--d-accent-soft, var(--d-card));
	}

	.bubble p {
		white-space: pre-wrap;
		line-height: 1.65;
	}

	.stamp {
		font-size: 12px;
	}

	.reply {
		margin-top: 22px;
		padding-top: 18px;
		border-top: 1px solid var(--d-card);
	}

	.who {
		line-height: 1.8;
	}

	@media (min-width: 1000px) {
		.cols {
			grid-template-columns: minmax(0, 1fr) 320px;
		}
	}
</style>
