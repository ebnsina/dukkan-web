<script lang="ts">
	import { enhance } from '$app/forms';
	import {
		CheckmarkCircle02Icon,
		Delete02Icon,
		EyeIcon,
		ImageAdd02Icon,
		PencilEdit02Icon,
		Store01Icon
	} from '@hugeicons/core-free-icons';
	import Seo from '$lib/seo/Seo.svelte';
	import { Button, Chip, Field, Frame } from '$lib/ui';
	import Photo from '$lib/shop/Photo.svelte';
	import { SIZES } from '$lib/shop/photo';
	import { announce } from '$lib/admin/announce';
	import DataTable from '$lib/admin/DataTable.svelte';
	import RowActions from '$lib/admin/RowActions.svelte';
	import PageTop from '$lib/admin/PageTop.svelte';
	import PageActions from '$lib/admin/PageActions.svelte';
	import FormSheet from '$lib/admin/FormSheet.svelte';
	import { productState } from '$lib/admin/state';
	import { formatMinor, fromMinor } from '$lib/utils/money';
	import { formatNumber } from '$lib/utils/format';
	import type { Variant } from '$lib/api/types';

	let { data, form } = $props();

	// Named `badge`, not `state`: a local `state` shadows the `$state` rune.
	const badge = $derived(productState(data.product.status));
	const next = $derived(data.product.status === 'active' ? 'draft' : 'active');
	const value = (key: string) =>
		(form?.values as Record<string, string> | undefined)?.[key] ??
		(data.product as unknown as Record<string, string | null>)[key] ??
		'';

	const variants = $derived(data.product.variants ?? []);
	const category = $derived(data.categories.find((c) => c.id === data.product.category_id));

	let editingDetails = $state(false);
	let addingPhoto = $state(false);
	/* The choice being changed. Holding the row itself, rather than an id, keeps
	   the sheet's title and its starting values in one place. */
	let editing = $state<Variant | null>(null);
</script>

<Seo title={data.product.title} description="Change what you sell." noindex />

<PageTop trail={[{ label: 'Products', href: '/admin/products' }, { label: data.product.title }]}>
	{#snippet meta()}
		{#if data.product.title_bn}<span class="bn">{data.product.title_bn}</span> ·{/if}
		<Chip tone={badge.tone} label={badge.word} icon={badge.icon} />
	{/snippet}

	{#snippet actions()}
		<!-- The form is here so the page owns it; the menu only names it. -->
		<form
			method="POST"
			action="?/setStatus"
			id="product-status"
			use:enhance={announce('Saved. The shop shows it now.')}
		>
			<input type="hidden" name="status" value={next} />
		</form>
		<PageActions
			label={data.product.title}
			items={[
				{
					label: next === 'active' ? 'Put on sale' : 'Take off sale',
					description:
						next === 'active'
							? 'Customers can find it and buy it.'
							: 'It stays here, but nobody can buy it.',
					icon: next === 'active' ? CheckmarkCircle02Icon : EyeIcon,
					formId: 'product-status'
				},
				{
					label: 'View in the shop',
					description: 'Open the page a customer sees.',
					icon: Store01Icon,
					href: `/p/${data.product.slug}`
				}
			]}
		/>
	{/snippet}
</PageTop>

<div class="sheet">
	<Frame eyebrow="Details" title="What it is" variant="pad">
		<!-- The name and its Bangla spelling are already the page heading, so this
		     list carries only what the heading does not say. -->
		<dl class="facts">
			<div>
				<dt>Category</dt>
				<dd>
					{#if category}
						{category.name}{#if category.name_bn}
							— <span class="bn">{category.name_bn}</span>{/if}
					{:else}
						<span class="none">No category</span>
					{/if}
				</dd>
			</div>
			<div>
				<dt>One-line summary</dt>
				<dd>
					{#if data.product.summary}
						{data.product.summary}
					{:else}
						<span class="none">Not written yet</span>
					{/if}
				</dd>
			</div>
			<div>
				<dt>Description</dt>
				<dd class="prose">
					{#if data.product.description}
						{data.product.description}
					{:else}
						<span class="none">Not written yet</span>
					{/if}
				</dd>
			</div>
		</dl>

		{#snippet footer()}
			<Button
				size="sm"
				variant="quiet"
				icon={PencilEdit02Icon}
				onclick={() => (editingDetails = true)}
			>
				Edit details
			</Button>
		{/snippet}
	</Frame>

	<DataTable
		title="Choices and price"
		rows={variants}
		noun="choice"
		paged={false}
		emptyTitle="No choices yet"
		emptyBody="A product needs at least one choice before it can be bought. Add one and its price shows in the shop."
	>
		{#snippet head()}
			<th scope="col">Choice</th>
			<th scope="col" data-numeric>Price</th>
			<th scope="col" data-numeric>In stock</th>
			<th scope="col">Your code</th>
			<th scope="col"><span class="sr-only">Actions</span></th>
		{/snippet}

		{#snippet row(variant)}
			<tr>
				<td><span class="dk-strong">{variant.title || 'The only one'}</span></td>
				<td data-numeric>{formatMinor(variant.price_minor)}</td>
				<td data-numeric>
					{formatNumber(variant.stock.on_hand)}
					{#if variant.stock.reserved > 0}
						<span class="held">{formatNumber(variant.stock.reserved)} held by orders</span>
					{/if}
				</td>
				<td><span class="dk-num">{variant.sku || '—'}</span></td>
				<td class="right">
					<RowActions
						label={variant.title ?? 'this choice'}
						items={[
							{
								label: 'Edit',
								icon: PencilEdit02Icon,
								onselect: () => (editing = variant)
							}
						]}
					/>
				</td>
			</tr>
		{/snippet}
	</DataTable>

	<Frame eyebrow="Photos" title="What it looks like" variant="pad">
		{#if (data.product.images ?? []).length > 0}
			<ul class="shots">
				{#each data.product.images ?? [] as image (image.id)}
					<li>
						<div class="shot">
							<Photo {image} sizes={SIZES.list} fallbackAlt={data.product.title} />
						</div>
						<form method="POST" action="?/removePhoto" use:enhance={announce('Photo removed.')}>
							<input type="hidden" name="media_id" value={image.id} />
							<Button
								type="submit"
								variant="quiet"
								size="sm"
								icon={Delete02Icon}
								aria-label="Remove this photo"
							>
								Remove
							</Button>
						</form>
					</li>
				{/each}
			</ul>
		{:else}
			<p class="dk-note">No photos yet. A product without one rarely sells.</p>
		{/if}

		{#snippet footer()}
			<Button size="sm" icon={ImageAdd02Icon} onclick={() => (addingPhoto = true)}>
				Add a photo
			</Button>
		{/snippet}
	</Frame>
</div>

<FormSheet
	bind:open={editingDetails}
	title="Edit details"
	description="Wording only. The price and how many you have live with each choice."
	action="?/details"
	saved="Saved. Your change is live."
>
	<div class="pair">
		<Field label="Name" required error={form?.fields?.title}>
			{#snippet control(props)}
				<input {...props} class="dk-input" name="title" value={value('title')} required />
			{/snippet}
		</Field>
		<Field label="Name in Bangla" hint="Shown to customers reading in Bangla.">
			{#snippet control(props)}
				<input {...props} class="dk-input" name="title_bn" value={value('title_bn')} />
			{/snippet}
		</Field>
	</div>

	<Field label="Category">
		{#snippet control(props)}
			<select {...props} class="dk-select" name="category_id" value={value('category_id')}>
				<option value="">No category</option>
				{#each data.categories as c (c.id)}
					<option value={c.id}>
						{c.name_bn ? `${c.name} — ${c.name_bn}` : c.name}
					</option>
				{/each}
			</select>
		{/snippet}
	</Field>

	<Field label="One-line summary">
		{#snippet control(props)}
			<input {...props} class="dk-input" name="summary" value={value('summary')} />
		{/snippet}
	</Field>

	<Field label="Description">
		{#snippet control(props)}
			<textarea {...props} class="dk-textarea" name="description" rows="4"
				>{value('description')}</textarea
			>
		{/snippet}
	</Field>
</FormSheet>

<FormSheet
	bind:open={() => !!editing, (v) => (editing = v ? editing : null)}
	title="Edit {editing?.title || 'this choice'}"
	description="A price change shows in the shop straight away. Stock reserved by orders already placed is left alone."
	action="?/variant"
	saved="Saved. The shop shows the new price."
>
	{#if editing}
		<input type="hidden" name="variant_id" value={editing.id} />
		<div class="pair">
			<Field label="Choice" hint="Like “Red” or “Large”.">
				{#snippet control(props)}
					<input {...props} class="dk-input" name="title" value={editing?.title ?? ''} />
				{/snippet}
			</Field>
			<Field label="Your code" hint="Optional.">
				{#snippet control(props)}
					<input {...props} class="dk-input" name="sku" value={editing?.sku ?? ''} />
				{/snippet}
			</Field>
		</div>
		<div class="pair">
			<Field label="Price in taka" required error={form?.fields?.[`variant.${editing.id}.price`]}>
				{#snippet control(props)}
					<input
						{...props}
						class="dk-input"
						name="price"
						value={fromMinor(editing?.price_minor ?? 0)}
						inputmode="decimal"
						required
					/>
				{/snippet}
			</Field>
			<Field
				label="In stock"
				hint={editing.stock.reserved > 0
					? `${formatNumber(editing.stock.reserved)} held by orders`
					: undefined}
				error={form?.fields?.[`variant.${editing.id}.on_hand`]}
			>
				{#snippet control(props)}
					<input
						{...props}
						class="dk-input"
						name="on_hand"
						value={editing?.stock.on_hand ?? 0}
						inputmode="numeric"
					/>
				{/snippet}
			</Field>
		</div>
	{/if}
</FormSheet>

<FormSheet
	bind:open={addingPhoto}
	title="Add a photo"
	description="Customers buy what they can see. One clear picture on a plain background does most of the work."
	action="?/addPhoto"
	saved="Uploaded. It is on the product now."
	enctype="multipart/form-data"
>
	<Field label="The photo" error={form?.fields?.file} hint="JPEG or PNG, under 12 MB.">
		{#snippet control(props)}
			<input {...props} class="dk-input" type="file" name="file" accept="image/*" required />
		{/snippet}
	</Field>
	<Field label="Describe it" hint="For customers who cannot see the picture.">
		{#snippet control(props)}
			<input {...props} class="dk-input" name="alt_text" />
		{/snippet}
	</Field>
</FormSheet>

<style>
	.right {
		text-align: right;
	}

	.bn {
		color: var(--d-faint);
	}

	.sheet {
		display: flex;
		flex-direction: column;
		gap: 14px;
		max-width: 900px;
	}

	.facts {
		display: flex;
		flex-direction: column;
		gap: 14px;
		margin: 0;
	}

	.facts dt {
		font-size: 12px;
		color: var(--d-faint);
	}

	.facts dd {
		margin: 3px 0 0;
		color: var(--d-ink);
	}

	/* A description is typed with its own line breaks; showing it as one
	   paragraph would lose them. */
	.prose {
		white-space: pre-wrap;
		line-height: 1.6;
	}

	.none {
		color: var(--d-faint);
	}

	.held {
		display: block;
		margin-top: 3px;
		font-size: 12px;
		color: var(--d-faint);
	}

	.pair {
		display: grid;
		gap: 14px;
	}

	.shots {
		display: flex;
		flex-wrap: wrap;
		gap: 16px;
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.shots li {
		display: flex;
		flex-direction: column;
		gap: 8px;
		align-items: center;
	}

	.shot {
		width: 96px;
		height: 96px;
		border-radius: 8px;
		overflow: hidden;
	}

	@media (min-width: 620px) {
		.pair {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
</style>
