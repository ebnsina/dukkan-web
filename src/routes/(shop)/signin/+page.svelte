<script lang="ts">
	import { enhance } from '$app/forms';
	import Seo from '$lib/seo/Seo.svelte';
	import { Button, Field, Input, Note } from '$lib/ui';

	let { form } = $props();
</script>

<Seo title="Sign in" description="Sign in to see your orders." noindex />

<div class="wrap container-page">
	<div class="panel">
		<h1 class="t-sub">Sign in</h1>
		<p class="lead">We text you a code. No password to remember.</p>

		{#if form?.message}
			<Note title="Try again" tone="firm">{form.message}</Note>
		{/if}

		{#if !form?.sent}
			<form method="POST" action="?/request" use:enhance class="form">
				<Field label="Mobile number" required>
					{#snippet control(props)}
						<Input
							{...props}
							name="phone"
							numeric
							inputmode="tel"
							placeholder="01712345678"
							value={form?.phone ?? ''}
						/>
					{/snippet}
				</Field>
				<Button type="submit" arrow>Send the code</Button>
			</form>
		{:else}
			<form method="POST" action="?/verify" use:enhance class="form">
				<input type="hidden" name="phone" value={form.phone} />
				<Field label="The code we sent" required hint="Six digits, sent to {form.phone}.">
					{#snippet control(props)}
						<Input
							{...props}
							name="code"
							numeric
							inputmode="numeric"
							placeholder="000000"
							autocomplete="one-time-code"
						/>
					{/snippet}
				</Field>
				<Button type="submit" arrow>Sign in</Button>
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
		max-width: 380px;
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
