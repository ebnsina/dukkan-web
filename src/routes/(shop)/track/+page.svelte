<script lang="ts">
	import { enhance } from '$app/forms';
	import Seo from '$lib/seo/Seo.svelte';
	import { Banner, Button, Field, Input } from '$lib/ui';
	import OrderDetail from '$lib/shop/OrderDetail.svelte';

	let { form } = $props();
</script>

<Seo
	title="Track an order"
	description="Look up an order with its number and your mobile."
	noindex
/>

<div class="wrap container-page">
	<h1 class="t-heading">Track an order</h1>

	{#if !form?.order}
		<p class="lead t-lead">
			Enter the order number from your confirmation and the mobile number you ordered with.
		</p>

		{#if form?.message}
			<Banner title="We could not find it" tone="danger">{form.message}</Banner>
		{/if}

		<form method="POST" use:enhance class="form">
			<Field label="Order number" required>
				{#snippet control(props)}
					<Input
						{...props}
						name="number"
						numeric
						placeholder="DK-1001"
						value={form?.values?.number ?? ''}
					/>
				{/snippet}
			</Field>
			<Field label="Mobile number" required>
				{#snippet control(props)}
					<Input
						{...props}
						name="phone"
						numeric
						inputmode="tel"
						placeholder="01712345678"
						value={form?.values?.phone ?? ''}
					/>
				{/snippet}
			</Field>
			<Button type="submit" arrow>Find the order</Button>
		</form>
	{:else}
		<OrderDetail order={form.order} />
	{/if}
</div>

<style>
	.wrap {
		padding-top: clamp(32px, 5vw, 56px);
		display: flex;
		flex-direction: column;
		gap: 28px;
	}

	.lead {
		color: var(--muted);
	}

	.form {
		display: flex;
		flex-direction: column;
		gap: 20px;
		max-width: 380px;
	}
</style>
