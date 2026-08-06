<script lang="ts">
	/* Asking the shop something.
	 *
	 * No account required. Most people here check out as guests, and somebody
	 * with a problem is the last person who will stop to make one — so a guest
	 * asks, gets a number back, and the shop rings them on the phone they gave.
	 * A signed-in customer additionally gets to read the reply here.
	 */
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import Seo from '$lib/seo/Seo.svelte';
	import { Banner, Button, Field, Input, Textarea } from '$lib/ui';
	import { formatDateTime } from '$lib/utils/format';

	let { data, form } = $props();

	const sent = $derived(page.url.searchParams.get('sent'));
	const fields = $derived((form as { fields?: Record<string, string> } | null)?.fields ?? {});
	const values = $derived(
		(form as { values?: Record<string, string> } | null)?.values ?? {
			name: '',
			phone: '',
			email: '',
			subject: '',
			body: ''
		}
	);

	const STATE: Record<string, string> = {
		open: 'Waiting on the shop',
		answered: 'They have answered',
		closed: 'Finished'
	};
</script>

<Seo
	title="Ask {data.shop.name}"
	description="Ask {data.shop.name} a question about an order or a product."
/>

<div class="wrap container-page">
	<h1 class="t-title">Ask us anything</h1>

	{#if sent}
		<Banner title="We have your question" tone="success">
			Keep this number: <strong>{sent}</strong>. The shop will ring you back on the number you gave.
		</Banner>
	{/if}

	{#if form?.message}
		<Banner title="That did not send" tone="danger">{form.message}</Banner>
	{/if}

	<form method="POST" action="?/ask" use:enhance class="form">
		<div class="pair">
			<Field label="Your name" required error={fields.name}>
				{#snippet control(props)}
					<Input {...props} name="name" value={values.name} required />
				{/snippet}
			</Field>
			<Field
				label="Your mobile"
				required
				hint="This is how the shop will reach you."
				error={fields.phone}
			>
				{#snippet control(props)}
					<Input
						{...props}
						name="phone"
						numeric
						inputmode="tel"
						placeholder="01712345678"
						value={values.phone}
						required
					/>
				{/snippet}
			</Field>
		</div>

		<Field label="What is it about" required error={fields.subject}>
			{#snippet control(props)}
				<Input {...props} name="subject" value={values.subject} required />
			{/snippet}
		</Field>

		<!-- No order picker: matching a typed order number to an order needs a
		     lookup that does not exist yet, and a box that quietly does nothing
		     is worse than no box. The number goes in the question. -->
		<Field
			label="Your question"
			required
			hint="If it is about an order, put the order number in."
			error={fields.body}
		>
			{#snippet control(props)}
				<Textarea {...props} name="body" rows={5} value={values.body} required />
			{/snippet}
		</Field>

		<Button type="submit" arrow>Send it</Button>
	</form>

	{#if data.tickets.length > 0}
		<section class="mine">
			<h2 class="t-sub">What you have asked</h2>
			{#each data.tickets as ticket (ticket.id)}
				<article class="thread">
					<header>
						<span class="dk-strong">{ticket.subject}</span>
						<span class="meta">
							{ticket.number} · {STATE[ticket.status] ?? ticket.status} ·
							{formatDateTime(ticket.last_reply_at)}
						</span>
					</header>
				</article>
			{/each}
			<p class="meta">
				The shop answers here and by phone. There is no text message when they reply.
			</p>
		</section>
	{/if}
</div>

<style>
	.wrap {
		max-width: 640px;
		padding-block: clamp(40px, 6vw, 72px);
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	.form {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.pair {
		display: grid;
		gap: 20px;
	}

	@media (min-width: 560px) {
		.pair {
			grid-template-columns: 1fr 1fr;
		}
	}

	.mine {
		display: flex;
		flex-direction: column;
		gap: 12px;
		padding-top: 24px;
		border-top: 1px solid var(--rule);
	}

	.thread header {
		display: flex;
		flex-direction: column;
		gap: 3px;
	}

	.meta {
		font-size: 13px;
		color: var(--faint);
	}
</style>
