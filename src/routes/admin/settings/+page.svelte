<script lang="ts">
	import Seo from '$lib/seo/Seo.svelte';
	import { CheckmarkCircle02Icon } from '@hugeicons/core-free-icons';
	import { Button, Field, Frame, Toggle } from '$lib/ui';
	import { theme } from '$lib/theme/theme.svelte';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { Moon02Icon, Sun03Icon } from '@hugeicons/core-free-icons';
	import PageTop from '$lib/admin/PageTop.svelte';
	import CredentialsCard from '$lib/admin/CredentialsCard.svelte';
	import ThemePicker from '$lib/admin/ThemePicker.svelte';
	import StaffList from '$lib/admin/StaffList.svelte';
	import DomainCard from '$lib/admin/DomainCard.svelte';

	let { data, form } = $props();

	let payEnabled = $state(false);
	let paySandbox = $state(true);
	let courierEnabled = $state(false);

	/* Unlike a credential, these are readable, so the switches open on what the
	   shop actually has set rather than on a guess — and follow the reload after
	   a save, so the drawer never reopens showing what was there before. */
	let sms = $derived({ ...data.notifications });

	const sslLive = $derived(data.live.some((m) => m.provider === 'sslcommerz'));
	const courierReady = $derived(data.couriers.some((c) => c.configured));

	/* The actions fail with different shapes, so the field errors are narrowed
	   once here rather than asserted at each field. */
	let fields = $derived((form as { fields?: Record<string, string> } | null)?.fields ?? {});

	/* Two cards both call their credential `api_key`, so an error has to be
	   shown only on the card that caused it — every action says which it was. */
	const only = (section: string): Record<string, string> =>
		(form as { section?: string } | null)?.section === section ? fields : {};
</script>

<Seo title="Settings" description="Payments and delivery." noindex />

<PageTop trail={[{ label: 'Settings' }]} />

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
		<Field label="Store ID" required error={only('payments').store_id}>
			{#snippet control(props)}
				<input {...props} class="dk-input" name="store_id" autocomplete="off" required />
			{/snippet}
		</Field>
		<Field label="Store password" required error={only('payments').store_password}>
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
		<Field label="API key" required error={only('courier').api_key}>
			{#snippet control(props)}
				<input {...props} class="dk-input" name="api_key" autocomplete="off" required />
			{/snippet}
		</Field>
		<Field label="Secret key" required error={only('courier').secret_key}>
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
			error={only('courier').webhook_token}
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

	<CredentialsCard
		eyebrow="Messages"
		title="Telling customers"
		status={data.notifications.sms_enabled ? 'Sending' : 'Off'}
		blurb="Your own BulkSMSBD account. Customers get a text when an order is placed, sent and delivered — which is how most people here follow a parcel."
		action="?/notifications"
		saved="Text messages saved."
	>
		<Field label="Provider" required error={only('notifications').provider}>
			{#snippet control(props)}
				<select {...props} class="dk-select" name="provider" required>
					<option value="bulksmsbd">BulkSMSBD</option>
				</select>
			{/snippet}
		</Field>
		<Field label="API key" required error={only('notifications').api_key}>
			{#snippet control(props)}
				<input
					{...props}
					class="dk-input"
					name="api_key"
					type="password"
					autocomplete="off"
					required
				/>
			{/snippet}
		</Field>
		<Field
			label="Sender ID"
			hint="The approved short name messages come from."
			error={only('notifications').sender_id}
		>
			{#snippet control(props)}
				<input {...props} class="dk-input" name="sender_id" autocomplete="off" />
			{/snippet}
		</Field>
		<Field label="Shop name in the message" hint="Left blank, your shop's own name is used.">
			{#snippet control(props)}
				<input
					{...props}
					class="dk-input"
					name="sender_name"
					value={data.notifications.sms_sender_name}
				/>
			{/snippet}
		</Field>

		<p class="dk-hint">
			A Bangla message fits 70 characters a part against 160 in English, so each one you switch on
			costs about three times as much to send.
		</p>
		<Toggle bind:checked={sms.notify_placed} label="When an order is placed" />
		<input type="hidden" name="notify_placed" value={sms.notify_placed ? 'on' : ''} />
		<Toggle bind:checked={sms.notify_shipped} label="When it is sent" />
		<input type="hidden" name="notify_shipped" value={sms.notify_shipped ? 'on' : ''} />
		<Toggle bind:checked={sms.notify_delivered} label="When it arrives" />
		<input type="hidden" name="notify_delivered" value={sms.notify_delivered ? 'on' : ''} />
		<Toggle bind:checked={sms.notify_cancelled} label="When it is cancelled" />
		<input type="hidden" name="notify_cancelled" value={sms.notify_cancelled ? 'on' : ''} />

		<Toggle bind:checked={sms.sms_enabled} label="Send text messages" />
		<input type="hidden" name="sms_enabled" value={sms.sms_enabled ? 'on' : ''} />
		<div class="dk-acts">
			<Button type="submit" icon={CheckmarkCircle02Icon}>Save</Button>
		</div>
	</CredentialsCard>
</div>

<div class="people">
	<DomainCard
		domain={data.domain}
		shopSlug={data.shop?.slug ?? ''}
		included={data.domainIncluded || !!data.domain.domain}
		message={form?.section === 'domain' ? (form as { message?: string }).message : undefined}
	/>
</div>

<!-- Light or dark is a setting, not a control worth a permanent seat in the
     chrome of every page. It follows the device unless somebody says otherwise. -->
<div class="people">
	<Frame eyebrow="Appearance" title="How the admin looks" variant="pad">
		<p class="dk-note">
			This is only how the admin looks to you on this device. It does not change your shop.
		</p>
		<div class="dk-acts look">
			<Button
				variant={theme.preference === 'light' ? 'solid' : 'quiet'}
				size="sm"
				onclick={() => theme.set('light')}
			>
				<HugeiconsIcon icon={Sun03Icon} size={15} strokeWidth={1.7} />
				Light
			</Button>
			<Button
				variant={theme.preference === 'dark' ? 'solid' : 'quiet'}
				size="sm"
				onclick={() => theme.set('dark')}
			>
				<HugeiconsIcon icon={Moon02Icon} size={15} strokeWidth={1.7} />
				Dark
			</Button>
			<Button
				variant={theme.preference === 'system' ? 'solid' : 'quiet'}
				size="sm"
				onclick={() => theme.set('system')}
			>
				Follow my device
			</Button>
		</div>
	</Frame>
</div>

<div class="people">
	<StaffList staff={data.staff} fields={only('staff')} />
</div>

<p class="dk-hint footnote">
	For safety these are never shown again once saved. Type them in again to change them.
</p>

<style>
	/* Each panel holds a form rather than a figure, so they line up at the top. */
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
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}
</style>
