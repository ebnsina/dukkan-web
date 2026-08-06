<script lang="ts">
	import { enhance } from '$app/forms';
	import Seo from '$lib/seo/Seo.svelte';
	import {
		CheckmarkCircle02Icon,
		Delete02Icon,
		EyeIcon,
		PencilEdit02Icon,
		PlusSignIcon
	} from '@hugeicons/core-free-icons';
	import { Banner, Button, Chip, Field, Toggle } from '$lib/ui';
	import DataTable from '$lib/admin/DataTable.svelte';
	import PageTop from '$lib/admin/PageTop.svelte';
	import RowActions from '$lib/admin/RowActions.svelte';
	import FormSheet from '$lib/admin/FormSheet.svelte';
	import { productState } from '$lib/admin/state';
	import { formatMinorRange } from '$lib/utils/money';
	import type { AdminProduct } from '$lib/admin/types';
	import type { Category } from '$lib/api/types';

	/* The same screen for the shop owner and for a seller on a marketplace.
	   They differ by a URL prefix and nothing else: the API mirrors every
	   catalogue route across /v1/admin and /v1/vendor, so two copies of this
	   would only be two places to fix the next thing. */
	interface Props {
		data: {
			products: AdminProduct[];
			categories: Category[];
			filters: { q: string; status: string };
		};
		form: { fields?: Record<string, string>; message?: string } | null;
		/** Where this surface lives: `/admin` or `/seller`. */
		base: string;
	}

	let { data, form, base }: Props = $props();

	/* Adding a product is a sheet like every other form, so a shop owner never
	   loses the list they were looking at to fill one in. */
	let adding = $state(false);

	interface Row {
		sku: string;
		title: string;
		price: string;
		on_hand: string;
	}

	const blank = (): Row => ({ sku: '', title: '', price: '', on_hand: '0' });
	let rows = $state<Row[]>([blank()]);
	let publish = $state(false);
</script>

<Seo title="Products" description="What you sell." noindex />

<PageTop trail={[{ label: 'Products' }]}>
	{#snippet filters()}
		<form method="GET" class="dk-filters">
			<label class="sr-only" for="products-q">Search products</label>
			<input
				id="products-q"
				class="dk-input"
				type="search"
				name="q"
				value={data.filters.q}
				placeholder="Name in English or Bangla"
			/>
			<label class="sr-only" for="products-status">Status</label>
			<select
				id="products-status"
				class="dk-select"
				name="status"
				onchange={(e) => e.currentTarget.form?.requestSubmit()}
				value={data.filters.status}
			>
				<option value="">Any status</option>
				<option value="draft">Not published</option>
				<option value="active">On sale</option>
				<option value="archived">Put away</option>
			</select>
		</form>
	{/snippet}

	{#snippet actions()}
		<Button icon={PlusSignIcon} onclick={() => (adding = true)}>Add a product</Button>
	{/snippet}
</PageTop>

{#if form?.message}
	<div class="dk-stack" style="margin-bottom:14px">
		<Banner title="That did not work" tone="danger">{form.message}</Banner>
	</div>
{/if}

<DataTable
	rows={data.products}
	noun="product"
	emptyTitle={data.filters.q || data.filters.status ? 'Nothing matches' : 'Nothing here yet'}
	emptyBody={data.filters.q || data.filters.status
		? 'Try a different search, or clear it to see everything.'
		: 'Add your first product and it will show up in the shop.'}
>
	{#snippet emptyAction()}
		<Button size="sm" icon={PlusSignIcon} onclick={() => (adding = true)}>Add a product</Button>
	{/snippet}

	{#snippet head()}
		<th scope="col">Name</th>
		<th scope="col">Status</th>
		<th scope="col" data-numeric>Price</th>
		<th scope="col"><span class="sr-only">Actions</span></th>
	{/snippet}

	{#snippet row(product)}
		{@const state = productState(product.status)}
		<tr>
			<td>
				<a class="dk-strong" href="{base}/products/{product.id}">{product.title}</a>
				{#if product.title_bn}<span class="bn">{product.title_bn}</span>{/if}
			</td>
			<td>
				<Chip tone={state.tone} label={state.word} icon={state.icon} />
			</td>
			<td data-numeric>
				{#if product.price_min_minor !== null && product.price_max_minor !== null}
					{formatMinorRange(product.price_min_minor, product.price_max_minor)}
				{:else}
					—
				{/if}
			</td>
			<td class="right">
				<!-- The form is here so the row owns it; the menu only names it. -->
				<form method="POST" action="?/setStatus" id="status-{product.id}" use:enhance>
					<input type="hidden" name="id" value={product.id} />
					<input
						type="hidden"
						name="status"
						value={product.status === 'active' ? 'draft' : 'active'}
					/>
				</form>
				<RowActions
					label={product.title}
					items={[
						{
							label: 'Edit',
							icon: PencilEdit02Icon,
							href: `${base}/products/${product.id}`
						},
						{
							label: product.status === 'active' ? 'Take off sale' : 'Put on sale',
							icon: product.status === 'active' ? EyeIcon : CheckmarkCircle02Icon,
							formId: `status-${product.id}`
						}
					]}
				/>
			</td>
		</tr>
	{/snippet}
</DataTable>

<FormSheet
	bind:open={adding}
	title="Add a product"
	description="Name it, price it, and decide whether customers can see it yet."
	action="?/create"
	saved="Added. It is in your shop now."
>
	<div class="pair">
		<Field label="Name" required error={form?.fields?.title}>
			{#snippet control(props)}
				<input {...props} class="dk-input" name="title" required />
			{/snippet}
		</Field>
		<Field label="Name in Bangla" hint="Shown to customers reading in Bangla.">
			{#snippet control(props)}
				<input {...props} class="dk-input" name="title_bn" />
			{/snippet}
		</Field>
	</div>

	<Field label="Category">
		{#snippet control(props)}
			<select {...props} class="dk-select" name="category_id">
				<option value="">No category</option>
				{#each data.categories as category (category.id)}
					<option value={category.id}>
						{category.name_bn ? `${category.name} — ${category.name_bn}` : category.name}
					</option>
				{/each}
			</select>
		{/snippet}
	</Field>

	<Field label="One-line summary">
		{#snippet control(props)}
			<input {...props} class="dk-input" name="summary" />
		{/snippet}
	</Field>

	<Field label="Description">
		{#snippet control(props)}
			<textarea {...props} class="dk-textarea" name="description" rows="3"></textarea>
		{/snippet}
	</Field>

	<p class="dk-note">
		One row is enough if the product comes only one way. Add a row for each size or colour.
	</p>

	{#each rows as row, index (index)}
		<div class="choice">
			<Field label="Choice" hint="Like “Red” or “Large”.">
				{#snippet control(props)}
					<input {...props} class="dk-input" name="variant_title" bind:value={row.title} />
				{/snippet}
			</Field>
			<Field label="Price in taka" required error={form?.fields?.[`variant.${index}.price`]}>
				{#snippet control(props)}
					<input
						{...props}
						class="dk-input"
						name="variant_price"
						bind:value={row.price}
						inputmode="decimal"
						placeholder="4500"
						required
					/>
				{/snippet}
			</Field>
			<Field label="In stock" error={form?.fields?.[`variant.${index}.on_hand`]}>
				{#snippet control(props)}
					<input
						{...props}
						class="dk-input"
						name="variant_stock"
						bind:value={row.on_hand}
						inputmode="numeric"
					/>
				{/snippet}
			</Field>
			<Field label="Your code" hint="Optional.">
				{#snippet control(props)}
					<input {...props} class="dk-input" name="variant_sku" bind:value={row.sku} />
				{/snippet}
			</Field>
			{#if rows.length > 1}
				<Button
					variant="quiet"
					size="sm"
					icon={Delete02Icon}
					aria-label="Remove choice {index + 1}"
					onclick={() => (rows = rows.filter((_, i) => i !== index))}
				>
					Remove this choice
				</Button>
			{/if}
		</div>
	{/each}

	<Button variant="quiet" size="sm" icon={PlusSignIcon} onclick={() => (rows = [...rows, blank()])}>
		Add another choice
	</Button>

	<Toggle
		bind:checked={publish}
		label="Put it on sale now"
		description="Otherwise it is saved but stays hidden."
	/>
	<input type="hidden" name="publish" value={publish ? 'on' : ''} />
</FormSheet>

<style>
	.bn {
		display: block;
		margin-top: 3px;
		font-size: 12px;
		color: var(--d-faint);
	}

	.right {
		text-align: right;
	}

	.pair,
	.choice {
		display: grid;
		gap: 14px;
	}

	/* Each choice is one block, ruled off, so four fields do not read as one
	   long column of boxes in the sheet. */
	.choice {
		padding-top: 14px;
		border-top: 1px solid var(--d-card);
	}

	@media (min-width: 620px) {
		.pair,
		.choice {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
</style>
