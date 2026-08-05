<script lang="ts">
	import { enhance } from '$app/forms';
	import Seo from '$lib/seo/Seo.svelte';
	import { CheckmarkCircle02Icon } from '@hugeicons/core-free-icons';
	import { Button, Field, Frame, Toggle } from '$lib/ui';
	import SectionResult from '$lib/admin/SectionResult.svelte';
	import ThemePicker from '$lib/admin/ThemePicker.svelte';

	let { data, form } = $props();

	let payEnabled = $state(false);
	let paySandbox = $state(true);
	let courierEnabled = $state(false);

	const sslLive = $derived(data.live.some((m) => m.provider === 'sslcommerz'));
</script>

<Seo title="Settings" description="Payments and delivery." noindex />

<div class="dk-title-row">
	<div>
		<h1 class="dk-h1">Settings</h1>
		<p class="dk-date">What your shop looks like, how customers pay, and how parcels get out.</p>
	</div>
</div>

<ThemePicker
	themes={data.themes}
	applied={data.applied}
	shopName={data.shop?.name ?? ''}
	result={form}
/>

<div class="dk-grid-3 pair">
	<Frame
		eyebrow="Payments"
		title="Taking payment"
		action={sslLive ? 'Switched on' : 'Cash only'}
		variant="pad"
	>
		<p class="dk-note">
			Card, bKash and Nagad all come through SSLCommerz. Put your merchant details in and customers
			can pay online as well as with cash.
		</p>

		<SectionResult result={form} section="payments" />

		<form method="POST" action="?/payments" use:enhance class="dk-form">
			<Field label="Store ID" required error={form?.fields?.store_id}>
				{#snippet control(props)}
					<input {...props} class="dk-input" name="store_id" autocomplete="off" required />
				{/snippet}
			</Field>
			<Field label="Store password" required error={form?.fields?.store_password}>
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
				<Button type="submit" icon={CheckmarkCircle02Icon}>Save payment details</Button>
			</div>
		</form>
	</Frame>

	<Frame eyebrow="Delivery" title="Getting parcels out" variant="pad">
		<p class="dk-note">
			Your Steadfast account. Once this is in you can book a pickup straight from an order and the
			parcel status comes back on its own.
		</p>

		<SectionResult result={form} section="courier" />

		<form method="POST" action="?/courier" use:enhance class="dk-form">
			<Field label="API key" required error={form?.fields?.api_key}>
				{#snippet control(props)}
					<input {...props} class="dk-input" name="api_key" autocomplete="off" required />
				{/snippet}
			</Field>
			<Field label="Secret key" required error={form?.fields?.secret_key}>
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
				error={form?.fields?.webhook_token}
			>
				{#snippet control(props)}
					<input {...props} class="dk-input" name="webhook_token" autocomplete="off" />
				{/snippet}
			</Field>
			<Toggle bind:checked={courierEnabled} label="Book pickups with Steadfast" />
			<input type="hidden" name="is_enabled" value={courierEnabled ? 'on' : ''} />
			<div class="dk-acts">
				<Button type="submit" icon={CheckmarkCircle02Icon}>Save delivery details</Button>
			</div>
		</form>
	</Frame>
</div>

<p class="dk-hint footnote">
	For safety these are never shown again once saved. Type them in again to change them.
</p>

<style>
	/* Two panels, not three: each holds a form rather than a figure. */
	.pair {
		align-items: start;
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
