<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import Seo from '$lib/seo/Seo.svelte';
	import { ArrowRight01Icon, MessageNotification01Icon } from '@hugeicons/core-free-icons';
	import { Banner, Button, Field } from '$lib/ui';

	let { form } = $props();

	/* Two different refusals, and telling them apart matters. One is "you are not
	   a seller here", which is somebody in the wrong place. The other is "we have
	   not finished looking at your application", which is somebody in the right
	   place who has only to wait — and being told to go away would be wrong. */
	const denied = $derived(page.url.searchParams.get('denied') === '1');
	const pending = $derived(page.url.searchParams.get('pending') === '1');
</script>

<Seo title="Sign in" description="Sign in to your shop." noindex />

<div class="dk-title-row">
	<div>
		<h1 class="dk-h1">Sign in</h1>
		<p class="dk-date">We text you a code. No password to remember.</p>
	</div>
</div>

<div class="dk-stack">
	{#if pending}
		<Banner title="Your shop is still being looked at" tone="info">
			You will be able to sign in as soon as it is approved. Nothing is lost in the meantime.
		</Banner>
	{/if}

	{#if denied}
		<Banner title="That account does not sell here" tone="danger">
			If you run the shop itself rather than selling on it, sign in at the shop admin instead.
		</Banner>
	{/if}

	{#if form?.message}
		<Banner title="Try again" tone="danger">{form.message}</Banner>
	{/if}

	{#if !form?.sent}
		<form method="POST" action="?/request" use:enhance class="dk-form">
			<Field label="Mobile number" required>
				{#snippet control(props)}
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
			<Field label="The code we sent" required hint="Six digits, sent to {form.phone}.">
				{#snippet control(props)}
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
