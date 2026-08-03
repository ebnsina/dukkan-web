<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import Seo from '$lib/seo/Seo.svelte';
	import { ArrowRight01Icon, MessageNotification01Icon } from '@hugeicons/core-free-icons';
	import { Banner, Button, Field } from '$lib/admin/ui';

	let { form } = $props();
	const denied = $derived(page.url.searchParams.get('denied') === '1');
</script>

<Seo title="Sign in" description="Sign in to run your shop." noindex />

<!-- No rail here: there is nothing to navigate to until you are in. -->
<div class="dk-title-row">
	<div>
		<h1 class="dk-h1">Sign in</h1>
		<p class="dk-date">We text you a code. No password to remember.</p>
	</div>
</div>

<div class="dk-stack">
	{#if denied}
		<Banner title="That account cannot open the shop admin" tone="danger">
			Ask the owner to give you access, then sign in again.
		</Banner>
	{/if}

	{#if form?.message}
		<Banner title="Try again" tone="danger">{form.message}</Banner>
	{/if}

	{#if !form?.sent}
		<form method="POST" action="?/request" use:enhance class="dk-form">
			<Field label="Mobile number" id="phone" required>
				{#snippet children(props)}
					<input
						{...props}
						class="dk-input"
						type="tel"
						name="phone"
						inputmode="tel"
						autocomplete="tel"
						placeholder="01712345678"
						value={form?.phone ?? ''}
						required
					/>
				{/snippet}
			</Field>
			<Button type="submit" icon={MessageNotification01Icon}>Send the code</Button>
		</form>
	{:else}
		<form method="POST" action="?/verify" use:enhance class="dk-form">
			<input type="hidden" name="phone" value={form.phone} />
			<Field label="The code we sent" id="code" required hint="Six digits, sent to {form.phone}.">
				{#snippet children(props)}
					<input
						{...props}
						class="dk-input"
						name="code"
						inputmode="numeric"
						autocomplete="one-time-code"
						placeholder="000000"
						required
					/>
				{/snippet}
			</Field>
			<Button type="submit" icon={ArrowRight01Icon}>Sign in</Button>
		</form>
	{/if}
</div>
