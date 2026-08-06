<script lang="ts">
	/* Bringing a catalogue over from somewhere else.
	 *
	 * Nobody with four hundred products retypes them to try something, so this
	 * is less a feature than a door. It is two steps on purpose: a shop owner
	 * handing over their whole catalogue gets to see what we made of their file
	 * before any of it is theirs.
	 */
	import { enhance } from '$app/forms';
	import Seo from '$lib/seo/Seo.svelte';
	import { ArrowRight01Icon, CheckmarkCircle02Icon } from '@hugeicons/core-free-icons';
	import { Banner, Button, Field, Frame } from '$lib/ui';
	import DataTable from '$lib/admin/DataTable.svelte';
	import PageTop from '$lib/admin/PageTop.svelte';
	import { formatMinor } from '$lib/utils/money';
	import { formatNumber } from '$lib/utils/format';
	import type { ImportOutcome, ImportPreview } from '$lib/admin/types';

	let { data, form } = $props();

	/* The action returns a different shape at each step, so the union narrows to
	   nothing useful without saying which one is being read — the same pattern
	   the rest of the admin uses for form data. */
	const preview = $derived((form as { preview?: ImportPreview } | null)?.preview ?? null);
	const outcome = $derived((form as { outcome?: ImportOutcome } | null)?.outcome ?? null);
	const fields = $derived((form as { fields?: Record<string, string> } | null)?.fields ?? {});
	const currency = $derived(data.shop?.currency ?? 'BDT');

	const WHERE: Record<string, string> = {
		shopify: 'Shopify',
		woocommerce: 'WooCommerce',
		generic: 'a spreadsheet'
	};
</script>

<Seo title="Bring your products over" description="Import a catalogue." noindex />

<PageTop trail={[{ label: 'Bring your products over' }]} />

{#if outcome}
	<div class="msg">
		<Banner
			title="{formatNumber(outcome.created)} {outcome.created === 1
				? 'product'
				: 'products'} brought over"
			tone={outcome.created > 0 ? 'success' : 'info'}
		>
			{#if outcome.categories_created > 0}
				{formatNumber(outcome.categories_created)}
				{outcome.categories_created === 1 ? 'category was' : 'categories were'} made to put them in.
			{/if}
			{#if outcome.skipped > 0}
				{formatNumber(outcome.skipped)}
				{outcome.skipped === 1 ? 'was' : 'were'} left out — the list is below.
			{/if}
			{#snippet actions()}
				<Button href="/admin/products" variant="quiet">See your products</Button>
			{/snippet}
		</Banner>
	</div>

	{#if outcome.notes.length > 0}
		<Frame eyebrow="Left out" title="What did not come over" variant="pad">
			{#each outcome.notes as note, index (index)}
				<div class="note">
					<span class="dk-strong">{note.product || 'A row'}</span>
					<span class="dk-quiet">{note.message}</span>
				</div>
			{/each}
		</Frame>
	{/if}
{:else if preview}
	<!-- Nothing has been created yet. This is what we made of their file, and
	     the shop owner decides whether that is right before it is theirs. -->
	<div class="msg">
		<Banner title="This is what we found in your file" tone="info">
			{formatNumber(preview.product_count)}
			{preview.product_count === 1 ? 'product' : 'products'} and {formatNumber(
				preview.variant_count
			)}
			{preview.variant_count === 1 ? 'choice' : 'choices'}, read as an export from {WHERE[
				preview.source
			] ?? 'a spreadsheet'}. Nothing has been added to your shop yet.
		</Banner>
	</div>

	<DataTable
		title="The first few"
		rows={preview.sample}
		noun="product"
		paged={false}
		emptyTitle="Nothing we could read"
		emptyBody="We could not find any products in that file."
	>
		{#snippet head()}
			<th scope="col">Name</th>
			<th scope="col">Choices</th>
			<th scope="col" data-numeric>Price</th>
			<th scope="col">Will be</th>
		{/snippet}

		{#snippet row(item)}
			<tr>
				<td class="dk-strong">{item.title}</td>
				<td>{formatNumber(item.variants)}</td>
				<td data-numeric>{formatMinor(item.price_minor, currency)}</td>
				<td class="dk-quiet">{item.status === 'active' ? 'On sale' : 'Not published'}</td>
			</tr>
		{/snippet}
	</DataTable>

	{#if preview.category_names && preview.category_names.length > 0}
		<div class="after">
			<Frame eyebrow="Categories" title="These will be made" variant="pad">
				<p class="dk-note">{preview.category_names.join(', ')}</p>
				<p class="dk-hint">Any you already have are used rather than made again.</p>
			</Frame>
		</div>
	{/if}

	{#if preview.notes && preview.notes.length > 0}
		<div class="after">
			<Frame eyebrow="Watch out" title="Rows we could not take" variant="pad">
				{#each preview.notes as note, index (index)}
					<div class="note">
						<span class="dk-strong">{note.product || `Line ${note.row}`}</span>
						<span class="dk-quiet">{note.message}</span>
					</div>
				{/each}
			</Frame>
		</div>
	{/if}

	<div class="after">
		<Frame eyebrow="Ready" title="Bring them over" variant="pad">
			<p class="dk-note">
				Choose the same file again and we will add these to your shop. Anything already in your shop
				is left alone.
			</p>
			<form method="POST" action="?/commit" enctype="multipart/form-data" use:enhance>
				<Field label="Your file" required error={fields.file}>
					{#snippet control(props)}
						<input
							{...props}
							class="dk-input"
							type="file"
							name="file"
							accept=".csv,text/csv"
							required
						/>
					{/snippet}
				</Field>
				<div class="dk-acts">
					<Button type="submit" icon={CheckmarkCircle02Icon}>Add them to my shop</Button>
				</div>
			</form>
		</Frame>
	</div>
{:else}
	{#if form?.message}
		<div class="msg">
			<Banner title="We could not read that" tone="danger">{form.message}</Banner>
		</div>
	{/if}

	<Frame eyebrow="Your file" title="Where are your products now?" variant="pad">
		<p class="dk-note">
			Export your products from wherever you sell now and choose the file here. We read Shopify's
			and WooCommerce's exports as they come, and a plain spreadsheet needs only a name and a price.
		</p>

		<form method="POST" action="?/preview" enctype="multipart/form-data" use:enhance>
			<Field
				label="The file you exported"
				hint="A CSV. Nothing is added to your shop until you have seen what is in it."
				required
				error={fields.file}
			>
				{#snippet control(props)}
					<input
						{...props}
						class="dk-input"
						type="file"
						name="file"
						accept=".csv,text/csv"
						required
					/>
				{/snippet}
			</Field>
			<div class="dk-acts">
				<Button type="submit" icon={ArrowRight01Icon}>See what is in it</Button>
			</div>
		</form>
	</Frame>

	<div class="after">
		<Frame eyebrow="Getting your file" title="How to export" variant="pad">
			<dl class="how">
				<dt>Shopify</dt>
				<dd>Products → the ⋯ menu → Export → Plain CSV file.</dd>
				<dt>WooCommerce</dt>
				<dd>Products → Export → Generate CSV.</dd>
				<dt>A spreadsheet</dt>
				<dd>
					Columns called Name and Price are enough. Stock, SKU, Category and a Bangla name are used
					if they are there.
				</dd>
			</dl>
		</Frame>
	</div>
{/if}

<style>
	.msg {
		margin-bottom: 14px;
	}

	.after {
		margin-top: 14px;
	}

	.note {
		display: flex;
		flex-direction: column;
		gap: 2px;
		padding-block: 10px;
	}

	.note + .note {
		border-top: 1px solid var(--d-card);
	}

	.how {
		display: grid;
		gap: 4px 16px;
		margin-top: 12px;
	}

	.how dt {
		font-weight: 550;
		margin-top: 10px;
	}

	.how dd {
		color: var(--d-faint);
	}
</style>
