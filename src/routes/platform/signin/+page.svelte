<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import Seo from '$lib/seo/Seo.svelte';
	import { ArrowRight01Icon } from '@hugeicons/core-free-icons';
	import { Banner, Button, Field } from '$lib/ui';

	let { form } = $props();
	const stale = $derived(page.url.searchParams.get('stale') === '1');
</script>

<Seo title="Operator" description="Internal." noindex />

<div class="dk-title-row">
	<div>
		<h1 class="dk-h1">Operator</h1>
		<p class="dk-date">Every shop on this box. Not a customer's door.</p>
	</div>
</div>

<div class="dk-stack">
	{#if stale}
		<Banner title="That token no longer works" tone="warning">
			It was changed or expired. Paste the current one.
		</Banner>
	{/if}

	{#if form?.message}
		<Banner title="No" tone="danger">{form.message}</Banner>
	{/if}

	<form method="POST" action="?/enter" use:enhance class="dk-form">
		<Field
			label="Operator token"
			required
			hint="PLATFORM_API_TOKEN, from the server's environment."
		>
			{#snippet control(props)}
				<input
					{...props}
					class="dk-input"
					type="password"
					name="token"
					autocomplete="off"
					spellcheck="false"
					required
				/>
			{/snippet}
		</Field>
		<Button type="submit" icon={ArrowRight01Icon}>Open the console</Button>
	</form>
</div>
