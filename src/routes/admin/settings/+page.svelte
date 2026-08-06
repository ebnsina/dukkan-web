<script lang="ts">
	import Seo from '$lib/seo/Seo.svelte';
	import { CheckmarkCircle02Icon } from '@hugeicons/core-free-icons';
	import { Button, Field, Toggle } from '$lib/ui';
	import CredentialsCard from '$lib/admin/CredentialsCard.svelte';
	import ThemePicker from '$lib/admin/ThemePicker.svelte';
	import StaffList from '$lib/admin/StaffList.svelte';

	let { data, form } = $props();

	let payEnabled = $state(false);
	let paySandbox = $state(true);
	let courierEnabled = $state(false);

	const sslLive = $derived(data.live.some((m) => m.provider === 'sslcommerz'));
	const courierReady = $derived(data.couriers.some((c) => c.configured));

	/* The actions fail with different shapes, so the field errors are narrowed
	   once here rather than asserted at each field. */
	let fields = $derived((form as { fields?: Record<string, string> } | null)?.fields ?? {});
</script>

<Seo title="Settings" description="Payments and delivery." noindex />

<div class="dk-title-row">
	<div>
		<h1 class="dk-h1">Settings</h1>
		<p class="dk-date">What your shop looks like, how customers pay, and how parcels get out.</p>
	</div>
</div>

<ThemePicker themes={data.themes} applied={data.applied} shopName={data.shop?.name ?? ''} />

<div class="dk-grid-3 pair">
	<CredentialsCard
		eyebrow="Payments"
		title="Taking payment"
		status={sslLive ? 'Switched on' : 'Cash only'}
		blurb="Card, bKash and Nagad all come through SSLCommerz. Put your merchant details in and customers can pay online as well as with cash."
		action="?/payments"
		saved="Payment details saved."
	>
		<Field label="Store ID" required error={fields.store_id}>
			{#snippet control(props)}
				<input {...props} class="dk-input" name="store_id" autocomplete="off" required />
			{/snippet}
		</Field>
		<Field label="Store password" required error={fields.store_password}>
			{#snippet control(props)}
				<input
					{...props}
					class="dk-input"
					name="store_password"
					type="password"
					autocomplete="off"
					required
				/>
			{/snippet}
		</Field>
		<Toggle
			bind:checked={paySandbox}
			label="Testing mode"
			description="Leave on until you have tested a real payment."
		/>
		<input type="hidden" name="is_sandbox" value={paySandbox ? 'on' : ''} />
		<Toggle bind:checked={payEnabled} label="Let customers pay online" />
		<input type="hidden" name="is_enabled" value={payEnabled ? 'on' : ''} />
		<div class="dk-acts">
			<Button type="submit" icon={CheckmarkCircle02Icon}>Save</Button>
		</div>
	</CredentialsCard>

	<CredentialsCard
		eyebrow="Delivery"
		title="Getting parcels out"
		status={courierReady ? 'Switched on' : 'Not set up'}
		blurb="Your Steadfast account. Once this is in you can book a pickup straight from an order and the parcel status comes back on its own."
		action="?/courier"
		saved="Delivery details saved."
	>
		<Field label="API key" required error={fields.api_key}>
			{#snippet control(props)}
				<input {...props} class="dk-input" name="api_key" autocomplete="off" required />
			{/snippet}
		</Field>
		<Field label="Secret key" required error={fields.secret_key}>
			{#snippet control(props)}
				<input
					{...props}
					class="dk-input"
					name="secret_key"
					type="password"
					autocomplete="off"
					required
				/>
			{/snippet}
		</Field>
		<Field
			label="Webhook token"
			hint="Steadfast sends parcel updates with this. Make up a long random one."
			error={fields.webhook_token}
		>
			{#snippet control(props)}
				<input {...props} class="dk-input" name="webhook_token" autocomplete="off" />
			{/snippet}
		</Field>
		<Toggle bind:checked={courierEnabled} label="Book pickups with Steadfast" />
		<input type="hidden" name="is_enabled" value={courierEnabled ? 'on' : ''} />
		<div class="dk-acts">
			<Button type="submit" icon={CheckmarkCircle02Icon}>Save</Button>
		</div>
	</CredentialsCard>
</div>

<div class="people">
	<StaffList staff={data.staff} {fields} />
</div>

<p class="dk-hint footnote">
	For safety these are never shown again once saved. Type them in again to change them.
</p>

<style>
	/* Two panels, not three: each holds a form rather than a figure. */
	.pair {
		align-items: start;
	}

	.people {
		margin-top: 14px;
	}

	.footnote {
		margin-top: 8px;
	}

	@media (min-width: 900px) {
		.pair {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
</style>
