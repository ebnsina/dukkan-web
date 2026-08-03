<script lang="ts">
	import { enhance } from '$app/forms';
	import Seo from '$lib/seo/Seo.svelte';
	import { Button, Field, Input, Note, Switch } from '$lib/ui';

	let { data, form } = $props();

	let payEnabled = $state(false);
	let paySandbox = $state(true);
	let courierEnabled = $state(false);

	const sslLive = $derived(data.live.some((m) => m.provider === 'sslcommerz'));
</script>

<Seo title="Settings" description="Payments and delivery." noindex />

<h1 class="t-heading">Settings</h1>

<div class="sections">
	<section>
		<div class="head">
			<h2 class="t-sub">Taking payment</h2>
			<p class="blurb">
				Card, bKash and Nagad all come through SSLCommerz. Put your merchant details in and
				customers can pay online as well as with cash.
			</p>
			<p class="state t-label">
				{sslLive ? 'Online payment is switched on' : 'Cash on delivery only right now'}
			</p>
		</div>

		{#if form?.section === 'payments' && form?.message}
			<Note title="Not saved" tone="firm">{form.message}</Note>
		{:else if form?.section === 'payments' && form?.done}
			<Note title="Saved">{form.done}</Note>
		{/if}

		<form method="POST" action="?/payments" use:enhance class="form">
			<Field label="Store ID" required error={form?.fields?.store_id}>
				{#snippet control(props)}
					<Input {...props} name="store_id" autocomplete="off" />
				{/snippet}
			</Field>
			<Field label="Store password" required error={form?.fields?.store_password}>
				{#snippet control(props)}
					<Input {...props} name="store_password" type="password" autocomplete="off" />
				{/snippet}
			</Field>
			<Switch
				bind:checked={paySandbox}
				label="Testing mode"
				description="Leave on until you have tested a real payment."
			/>
			<input type="hidden" name="is_sandbox" value={paySandbox ? 'on' : ''} />
			<Switch bind:checked={payEnabled} label="Let customers pay online" />
			<input type="hidden" name="is_enabled" value={payEnabled ? 'on' : ''} />
			<Button type="submit" arrow>Save payment details</Button>
		</form>
	</section>

	<section>
		<div class="head">
			<h2 class="t-sub">Delivery</h2>
			<p class="blurb">
				Your Steadfast account. Once this is in you can book a pickup straight from an order and the
				parcel status comes back on its own.
			</p>
		</div>

		{#if form?.section === 'courier' && form?.message}
			<Note title="Not saved" tone="firm">{form.message}</Note>
		{:else if form?.section === 'courier' && form?.done}
			<Note title="Saved">{form.done}</Note>
		{/if}

		<form method="POST" action="?/courier" use:enhance class="form">
			<Field label="API key" required error={form?.fields?.api_key}>
				{#snippet control(props)}
					<Input {...props} name="api_key" autocomplete="off" />
				{/snippet}
			</Field>
			<Field label="Secret key" required error={form?.fields?.secret_key}>
				{#snippet control(props)}
					<Input {...props} name="secret_key" type="password" autocomplete="off" />
				{/snippet}
			</Field>
			<Field
				label="Webhook token"
				hint="Steadfast sends parcel updates with this. Make up a long random one."
				error={form?.fields?.webhook_token}
			>
				{#snippet control(props)}
					<Input {...props} name="webhook_token" autocomplete="off" />
				{/snippet}
			</Field>
			<Switch bind:checked={courierEnabled} label="Book pickups with Steadfast" />
			<input type="hidden" name="is_enabled" value={courierEnabled ? 'on' : ''} />
			<Button type="submit" arrow>Save delivery details</Button>
		</form>
	</section>
</div>

<p class="footnote t-label">
	For safety these are never shown again once saved. Type them in again to change them.
</p>

<style>
	.sections {
		display: grid;
		gap: 56px;
		margin-top: 36px;
		align-items: start;
	}

	section {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.head {
		padding-bottom: 18px;
		border-bottom: 1px solid var(--rule-strong);
	}

	.blurb {
		margin-top: 12px;
		font-size: var(--size-body);
		line-height: 1.6;
		color: var(--muted);
		max-width: 52ch;
	}

	.state {
		margin-top: 14px;
		color: var(--faint);
	}

	.form {
		display: flex;
		flex-direction: column;
		gap: 20px;
		max-width: 420px;
	}

	.footnote {
		margin-top: 48px;
		padding-top: 20px;
		border-top: 1px solid var(--rule);
		color: var(--faint);
	}

	@media (min-width: 1040px) {
		.sections {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 56px 64px;
		}
	}
</style>
