<script lang="ts">
	/* Every form in the admin opens in a sheet.
	 *
	 * A page that lays its forms out inline is a page of empty boxes asking to
	 * be filled in, and a shop owner who came to change one thing has to find it
	 * among them. A sheet means the page shows what *is*, and a form appears
	 * only once somebody has said what they want to change.
	 *
	 * Generalised from the card that did this for credentials — the reasoning
	 * was never specific to credentials.
	 */
	import type { Snippet } from 'svelte';
	import { enhance } from '$app/forms';
	import { Button, Drawer, toasts } from '$lib/ui';

	interface Props {
		/** What opens it. Omit to drive `open` from the outside. */
		trigger?: Snippet<[() => void]>;
		open?: boolean;
		title: string;
		description?: string;
		/** The action, like `?/create`. */
		action: string;
		/** Said in the toast once it works. */
		saved: string;
		/* Left alone it is just "Save". A sheet's own title already says what is
		   being saved, so repeating it on the button is a longer word for the
		   same thing. */
		submitLabel?: string;
		/** Multipart, for a form carrying a file. */
		enctype?: 'application/x-www-form-urlencoded' | 'multipart/form-data' | 'text/plain';
		children: Snippet;
	}

	let {
		trigger,
		open = $bindable(false),
		title,
		description,
		action,
		saved,
		submitLabel = 'Save',
		enctype,
		children
	}: Props = $props();

	/* Re-keyed after a success so the next open starts blank. A sheet that
	   reopens holding what was typed last time invites saving it twice. */
	let version = $state(0);

	/* The buttons live in the drawer's footer, outside the scrolling body, so a
	   long form does not hide its own Save at the bottom of a scroll. They are
	   still the form's buttons — `form=` associates a control with a form it is
	   not nested inside, which is exactly what that attribute is for. */
	const formId = $props.id();
</script>

{#if trigger}{@render trigger(() => (open = true))}{/if}

<Drawer bind:open size="wide" {title} {description} {footer}>
	{#key version}
		<form
			id={formId}
			method="POST"
			{action}
			{enctype}
			use:enhance={() =>
				async ({ result, update }) => {
					await update({ reset: false });
					if (result.type === 'success' || result.type === 'redirect') {
						toasts.success(saved);
						version += 1;
						open = false;
					} else if (result.type === 'failure') {
						/* Kept open on a failure: the message is about something in
						   the form, and closing would take away what it refers to. */
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

{#snippet footer()}
	<!-- Save last and on the right: it is the end of the sentence the sheet is,
	     and the place the eye finishes. -->
	<div class="acts">
		<Button variant="quiet" onclick={() => (open = false)}>Cancel</Button>
		<Button type="submit" form={formId}>{submitLabel}</Button>
	</div>
{/snippet}

<style>
	.acts {
		display: flex;
		justify-content: flex-end;
		gap: 8px;
	}
</style>
