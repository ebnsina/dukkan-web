<script lang="ts">
	/* Applying to sell here.
	 *
	 * The endpoint behind this has existed since the beginning and had no page,
	 * so the only way onto a marketplace was for somebody to write the row by
	 * hand. That also meant the "we are still looking at your application" state
	 * on the seller sign-in page could never occur.
	 */
	import { enhance } from '$app/forms';
	import Seo from '$lib/seo/Seo.svelte';
	import { Banner, Button, Field, Input, Select, Textarea } from '$lib/ui';

	let { data, form } = $props();

	const fields = $derived((form as { fields?: Record<string, string> } | null)?.fields ?? {});

	/* The value is the district's name, not its code: a seller's district is
	   stored as text and read by a person on the review screen, where "dhaka"
	   would be a worse answer than "Dhaka". Orders record the name for the same
	   reason. Both scripts are offered to whoever is choosing. */
	const districts = $derived(
		data.districts.map((d) => ({ value: d.name, label: `${d.name} — ${d.name_bn}` }))
	);
</script>

<Seo
	title="Sell on {data.shop.name}"
	description="Apply to sell your own products on {data.shop.name}."
/>

<div class="wrap container-page">
	<div class="panel">
		{#if data.existing}
			<!-- Somebody who has already applied gets where it got to, not a second
			     empty form. The API refuses a duplicate anyway, so offering one
			     would only produce a refusal they did nothing to deserve. -->
			<h1 class="t-sub">{data.existing.name}</h1>

			{#if data.existing.status === 'pending'}
				<Banner title="We are looking at your application" tone="info">
					Nothing more to do for now. You will get a text when it is decided, and you can sign in to
					your shop as soon as it is approved.
				</Banner>
			{:else if data.existing.status === 'approved'}
				<Banner title="You are selling here" tone="success">
					Your shop is open.
					{#snippet actions()}
						<Button href="/seller" variant="quiet">Go to your shop</Button>
					{/snippet}
				</Banner>
			{:else if data.existing.status === 'suspended'}
				<Banner title="Your shop has been stopped" tone="danger">
					{data.existing.rejection_reason ?? 'Get in touch with the shop to sort it out.'}
				</Banner>
			{/if}
		{:else}
			<h1 class="t-sub">Sell on {data.shop.name}</h1>
			<p class="lead">
				Tell us about your shop. Somebody reads every application, so this is not instant.
			</p>

			{#if form?.message}
				<Banner title="That did not work" tone="danger">{form.message}</Banner>
			{/if}

			<form method="POST" use:enhance class="form">
				<Field label="Your shop's name" required error={fields.name}>
					{#snippet control(props)}
						<!-- Bangla is expected here and kept exactly as typed. The web
						     address is made separately and is the only Latin part. -->
						<Input {...props} name="name" required />
					{/snippet}
				</Field>

				<Field label="One line about it" hint="Shown under your name. Optional.">
					{#snippet control(props)}
						<Input {...props} name="tagline" />
					{/snippet}
				</Field>

				<Field label="Contact mobile" required error={fields.phone}>
					{#snippet control(props)}
						<Input
							{...props}
							name="phone"
							numeric
							inputmode="tel"
							placeholder="01712345678"
							required
						/>
					{/snippet}
				</Field>

				<Field label="Email" hint="Optional." error={fields.email}>
					{#snippet control(props)}
						<Input {...props} name="email" type="email" />
					{/snippet}
				</Field>

				<Field label="Which district you send from" required error={fields.district}>
					{#snippet control(props)}
						<Select
							{...props}
							name="district"
							options={districts}
							placeholder="Choose a district"
							required
						/>
					{/snippet}
				</Field>

				<Field label="Your address" hint="Optional.">
					{#snippet control(props)}
						<Input {...props} name="address" />
					{/snippet}
				</Field>

				<Field label="What you sell" hint="Optional, but it helps whoever reads this.">
					{#snippet control(props)}
						<Textarea {...props} name="description" rows={3} />
					{/snippet}
				</Field>

				<Button type="submit" arrow>Apply to sell</Button>
			</form>
		{/if}
	</div>
</div>

<style>
	.wrap {
		display: grid;
		place-items: center;
		padding-block: clamp(56px, 10vw, 120px);
	}

	.panel {
		width: 100%;
		max-width: 460px;
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.lead {
		font-size: var(--size-body);
		line-height: 1.6;
		color: var(--muted);
	}

	.form {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}
</style>
