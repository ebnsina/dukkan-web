<script lang="ts">
	/* What the shop says about itself.
	 *
	 * The theme picker in Settings decides how the storefront looks; this is
	 * what is on it. Before this every shop's home page read the same — its
	 * name, a count of items, and a line about cash on delivery that we wrote.
	 */
	import { enhance } from '$app/forms';
	import Seo from '$lib/seo/Seo.svelte';
	import { announce } from '$lib/admin/announce';
	import { CheckmarkCircle02Icon, Delete02Icon, PlusSignIcon } from '@hugeicons/core-free-icons';
	import { Button, Chip, Field, Frame, Toggle } from '$lib/ui';
	import DataTable from '$lib/admin/DataTable.svelte';
	import PageTop from '$lib/admin/PageTop.svelte';
	import RowActions from '$lib/admin/RowActions.svelte';
	import FormSheet from '$lib/admin/FormSheet.svelte';
	import type { StorefrontPage } from '$lib/api/types';

	let { data, form } = $props();

	const front = $derived(data.settings);

	/* Writable derived: it opens on what the shop actually has set, and follows
	   the reload after a save, so the switch never shows what was there before. */
	let notice = $derived(data.settings.notice_enabled);

	/* Null means "not editing"; a page object means editing that one. Writing a
	   new page is the same sheet with an empty page in it, because to the shop
	   owner it is the same act. */
	let editing = $state<StorefrontPage | null>(null);

	const blank = (): StorefrontPage => ({
		id: '',
		slug: '',
		title: '',
		body: '',
		is_published: true,
		position: 0,
		updated_at: ''
	});

	let published = $state(true);

	const fields = $derived((form as { fields?: Record<string, string> } | null)?.fields ?? {});
	const only = (section: string): Record<string, string> =>
		(form as { section?: string } | null)?.section === section ? fields : {};

	const shut = (clear: () => void) => (open: boolean) => {
		if (!open) clear();
	};

	function edit(page: StorefrontPage) {
		editing = page;
		published = page.is_published;
	}
</script>

<Seo title="Your shop front" description="What your shop says about itself." noindex />

<PageTop trail={[{ label: 'Your shop front' }]}>
	{#snippet actions()}
		<Button icon={PlusSignIcon} onclick={() => edit(blank())}>Write a page</Button>
	{/snippet}
</PageTop>

<form method="POST" action="?/front" use:enhance={announce('Saved. Your shop shows it now.')}>
	<div class="dk-grid-3 pair">
		<Frame eyebrow="Notice" title="The line across the top" variant="pad">
			<p class="dk-note">
				For the thing that changes: free delivery this week, closed for Eid, something new in.
			</p>
			<Field label="What it says" error={only('front').notice}>
				{#snippet control(props)}
					<input
						{...props}
						class="dk-input"
						name="notice"
						value={front.notice}
						placeholder="Free delivery on orders over ৳2,000"
					/>
				{/snippet}
			</Field>
			<Toggle bind:checked={notice} label="Show it on my shop" />
			<input type="hidden" name="notice_enabled" value={notice ? 'on' : ''} />
		</Frame>

		<Frame eyebrow="Front" title="The first thing they see" variant="pad">
			<p class="dk-note">
				Left empty, your shop's name is used. Write in whatever script you write in — it is shown
				exactly as you type it.
			</p>
			<Field label="Headline">
				{#snippet control(props)}
					<input {...props} class="dk-input" name="headline" value={front.headline} />
				{/snippet}
			</Field>
			<Field label="The line under it">
				{#snippet control(props)}
					<input {...props} class="dk-input" name="tagline" value={front.tagline} />
				{/snippet}
			</Field>
			<Field label="Button words" hint="Optional. Leave both empty for no button.">
				{#snippet control(props)}
					<input {...props} class="dk-input" name="hero_link_label" value={front.hero_link_label} />
				{/snippet}
			</Field>
			<Field
				label="Where it goes"
				hint="A page on your shop, like /c/sarees."
				error={only('front').hero_link_href}
			>
				{#snippet control(props)}
					<input {...props} class="dk-input" name="hero_link_href" value={front.hero_link_href} />
				{/snippet}
			</Field>
		</Frame>

		<Frame eyebrow="You" title="Who is behind the shop" variant="pad">
			<p class="dk-note">
				A shop with no way to reach it reads as a shop nobody is behind, and customers here notice.
			</p>
			<Field label="About your shop">
				{#snippet control(props)}
					<textarea {...props} class="dk-textarea" name="about" rows="3">{front.about}</textarea>
				{/snippet}
			</Field>
			<Field label="Phone">
				{#snippet control(props)}
					<input {...props} class="dk-input" name="contact_phone" value={front.contact_phone} />
				{/snippet}
			</Field>
			<Field label="Email">
				{#snippet control(props)}
					<input {...props} class="dk-input" name="contact_email" value={front.contact_email} />
				{/snippet}
			</Field>
			<Field label="Address">
				{#snippet control(props)}
					<input {...props} class="dk-input" name="contact_address" value={front.contact_address} />
				{/snippet}
			</Field>
			<Field label="WhatsApp number" hint="Optional.">
				{#snippet control(props)}
					<input {...props} class="dk-input" name="whatsapp_number" value={front.whatsapp_number} />
				{/snippet}
			</Field>
			<Field label="Facebook page" hint="The full address." error={only('front').facebook_url}>
				{#snippet control(props)}
					<input {...props} class="dk-input" name="facebook_url" value={front.facebook_url} />
				{/snippet}
			</Field>
		</Frame>
	</div>

	<div class="dk-acts save">
		<Button type="submit" icon={CheckmarkCircle02Icon}>Save</Button>
	</div>
</form>

<div class="pages">
	<DataTable
		title="Your written pages"
		rows={data.pages}
		noun="page"
		paged={false}
		emptyTitle="Nothing written yet"
		emptyBody="Delivery, returns and privacy. A payment gateway will ask to see these before it lets you take money, so they are worth writing early."
	>
		{#snippet emptyAction()}
			<Button size="sm" icon={PlusSignIcon} onclick={() => edit(blank())}>Write a page</Button>
		{/snippet}

		{#snippet head()}
			<th scope="col">Page</th>
			<th scope="col">Address</th>
			<th scope="col">Shown</th>
			<th scope="col"><span class="sr-only">Actions</span></th>
		{/snippet}

		{#snippet row(page)}
			<tr>
				<td class="dk-strong">{page.title}</td>
				<td class="dk-num">/pages/{page.slug}</td>
				<td>
					{#if page.is_published}
						<Chip tone="success" label="On your shop" />
					{:else}
						<Chip tone="neutral" label="Not shown" />
					{/if}
				</td>
				<td class="right">
					<form method="POST" action="?/removePage" id="remove-{page.id}" use:enhance>
						<input type="hidden" name="id" value={page.id} />
					</form>
					<RowActions
						label={page.title}
						items={[
							{ label: 'Edit', icon: CheckmarkCircle02Icon, onselect: () => edit(page) },
							{
								label: 'Take it off',
								icon: Delete02Icon,
								danger: true,
								formId: `remove-${page.id}`
							}
						]}
					/>
				</td>
			</tr>
		{/snippet}
	</DataTable>
</div>

{#if editing}
	{@const page = editing}
	<FormSheet
		bind:open={() => editing !== null, shut(() => (editing = null))}
		title={page.id ? page.title : 'Write a page'}
		description="Plain writing. It is shown exactly as you type it, so nothing you write can break the page."
		action="?/page"
		saved="Saved."
	>
		<Field label="Page name" required error={only('page').title}>
			{#snippet control(props)}
				<input {...props} class="dk-input" name="title" value={page.title} required />
			{/snippet}
		</Field>

		<Field
			label="Web address"
			hint="English letters. Left empty, one is made from the name."
			error={only('page').slug}
		>
			{#snippet control(props)}
				<input {...props} class="dk-input" name="slug" value={page.slug} placeholder="returns" />
			{/snippet}
		</Field>

		<Field label="What it says" required>
			{#snippet control(props)}
				<textarea {...props} class="dk-textarea" name="body" rows="10" required
					>{page.body}</textarea
				>
			{/snippet}
		</Field>

		<Toggle bind:checked={published} label="Show it on my shop" />
		<input type="hidden" name="is_published" value={published ? 'on' : ''} />
		<input type="hidden" name="position" value={page.position} />
	</FormSheet>
{/if}

<style>
	.pair {
		align-items: start;
	}

	.save {
		margin-top: 14px;
	}

	.pages {
		margin-top: 14px;
	}

	.right {
		text-align: right;
	}

	@media (min-width: 900px) {
		.pair {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}
</style>
