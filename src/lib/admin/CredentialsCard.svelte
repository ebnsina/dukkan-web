<script lang="ts">
	/* A credential a shop keeps with us: whether it is set, and a sheet to set it.
	 *
	 * The card is the state; the sheet is the typing. These are entered once and
	 * then left alone for months, so a permanent form for them was a page of
	 * empty boxes asking to be filled in every time a shop owner came to change
	 * something else.
	 *
	 * The values are never read back — they are sealed at rest and the API does
	 * not return them — so the form is always blank and the card says whether
	 * something is behind it. */
	import type { Snippet } from 'svelte';
	import { enhance } from '$app/forms';
	import { Button, Drawer, Frame, toasts } from '$lib/ui';

	interface Props {
		eyebrow: string;
		title: string;
		/** What the card says on the right: the live state, in two words. */
		status: string;
		blurb: string;
		action: string;
		saved: string;
		children: Snippet;
	}

	let { eyebrow, title, status, blurb, action, saved, children }: Props = $props();

	let editing = $state(false);
	let formVersion = $state(0);
</script>

<Frame {eyebrow} {title} action={status} variant="pad">
	<p class="dk-note">{blurb}</p>
	<div class="dk-acts act">
		<Button size="sm" variant="quiet" onclick={() => (editing = true)}>Edit</Button>
	</div>
</Frame>

<Drawer bind:open={editing} size="wide" {title}>
	{#key formVersion}
		<form
			method="POST"
			{action}
			use:enhance={() =>
				async ({ result, update }) => {
					await update({ reset: false });
					if (result.type === 'success') {
						toasts.success(saved);
						formVersion += 1;
						editing = false;
					} else if (result.type === 'failure') {
						const message = (result.data as { message?: string } | undefined)?.message;
						if (message) toasts.error(message);
					}
				}}
			class="dk-form"
		>
			{@render children()}
		</form>
	{/key}
</Drawer>

<style>
	.act {
		margin-top: 16px;
	}
</style>
