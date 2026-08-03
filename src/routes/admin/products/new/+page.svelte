<script lang="ts">
	import { enhance } from '$app/forms';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import {
		ArrowLeft01Icon,
		CheckmarkCircle02Icon,
		Delete02Icon,
		PlusSignIcon
	} from '@hugeicons/core-free-icons';
	import Seo from '$lib/seo/Seo.svelte';
	import { Banner, Button, Field, Frame, Toggle } from '$lib/admin/ui';

	let { data, form } = $props();

	interface Row {
		sku: string;
		title: string;
		price: string;
		on_hand: string;
	}

	let rows = $state<Row[]>([{ sku: '', title: '', price: '', on_hand: '0' }]);
	let publish = $state(false);

	const value = (key: keyof NonNullable<typeof form>['values']) => form?.values?.[key] ?? '';
</script>

<Seo title="Add a product" description="Put something new in the shop." noindex />

<a class="back" href="/admin/products">
	<span aria-hidden="true"
		><HugeiconsIcon icon={ArrowLeft01Icon} size={15} strokeWidth={1.6} /></span
	>
	All products
</a>

<div class="dk-title-row">
	<div>
		<h1 class="dk-h1">Add a product</h1>
		<p class="dk-date">Name it, price it, and decide whether customers can see it yet.</p>
	</div>
</div>

{#if form?.message}
	<div class="msg"><Banner title="Not saved" tone="danger">{form.message}</Banner></div>
{/if}

<form method="POST" use:enhance class="sheet">
	<Frame eyebrow="Details" title="What it is" variant="pad">
		<div class="dk-form">
			<div class="pair">
				<Field label="Name" id="title" required error={form?.fields?.title}>
					{#snippet children(props)}
						<input {...props} class="dk-input" name="title" value={value('title')} required />
					{/snippet}
				</Field>
				<Field label="Name in Bangla" id="title_bn" hint="Shown to customers reading in Bangla.">
					{#snippet children(props)}
						<input {...props} class="dk-input" name="title_bn" value={value('title_bn')} />
					{/snippet}
				</Field>
			</div>

			<Field label="Category" id="category_id">
				{#snippet children(props)}
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

			<Field label="One-line summary" id="summary">
				{#snippet children(props)}
					<input {...props} class="dk-input" name="summary" value={value('summary')} />
				{/snippet}
			</Field>

			<Field label="Description" id="description">
				{#snippet children(props)}
					<textarea {...props} class="dk-textarea" name="description" rows="4"
						>{value('description')}</textarea
					>
				{/snippet}
			</Field>
		</div>
	</Frame>

	<Frame
		eyebrow="Stock"
		title="Choices and price"
		action="{rows.length} {rows.length === 1 ? 'row' : 'rows'}"
		variant="pad"
	>
		<p class="dk-note">
			One row is enough if the product comes only one way. Add a row for each size or colour.
		</p>

		<div class="rows">
			{#each rows as row, index (index)}
				<div class="row">
					<Field
						label="Choice"
						id="variant-title-{index}"
						hint="Like “Red” or “Large”."
						error={form?.fields?.[`variant.${index}.title`]}
					>
						{#snippet children(props)}
							<input {...props} class="dk-input" name="variant_title" bind:value={row.title} />
						{/snippet}
					</Field>
					<Field
						label="Price in taka"
						id="variant-price-{index}"
						required
						error={form?.fields?.[`variant.${index}.price`]}
					>
						{#snippet children(props)}
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
					<Field
						label="In stock"
						id="variant-stock-{index}"
						error={form?.fields?.[`variant.${index}.on_hand`]}
					>
						{#snippet children(props)}
							<input
								{...props}
								class="dk-input"
								name="variant_stock"
								bind:value={row.on_hand}
								inputmode="numeric"
							/>
						{/snippet}
					</Field>
					<Field label="Your code" id="variant-sku-{index}" hint="Optional.">
						{#snippet children(props)}
							<input {...props} class="dk-input" name="variant_sku" bind:value={row.sku} />
						{/snippet}
					</Field>
					{#if rows.length > 1}
						<div class="drop">
							<Button
								variant="quiet"
								size="sm"
								icon={Delete02Icon}
								label="Remove choice {index + 1}"
								onclick={() => (rows = rows.filter((_, i) => i !== index))}
							>
								Remove this choice
							</Button>
						</div>
					{/if}
				</div>
			{/each}
		</div>

		{#snippet footer()}
			<Button
				variant="quiet"
				size="sm"
				icon={PlusSignIcon}
				onclick={() => (rows = [...rows, { sku: '', title: '', price: '', on_hand: '0' }])}
			>
				Add another choice
			</Button>
		{/snippet}
	</Frame>

	<div class="finish">
		<Toggle
			bind:checked={publish}
			label="Put it on sale now"
			description="Otherwise it is saved but stays hidden."
		/>
		<input type="hidden" name="publish" value={publish ? 'on' : ''} />
		<Button type="submit" icon={CheckmarkCircle02Icon}>Save the product</Button>
	</div>
</form>

<style>
	.back {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		margin-bottom: 16px;
		font-size: 12.5px;
		color: var(--d-faint);
	}

	.back:hover {
		color: var(--d-ink);
	}

	.msg {
		margin-bottom: 14px;
	}

	.sheet {
		display: flex;
		flex-direction: column;
		gap: 14px;
		max-width: 900px;
	}

	.pair {
		display: grid;
		gap: 18px;
	}

	.rows {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.row {
		display: grid;
		gap: 16px;
		padding-bottom: 20px;
	}

	.row + .row {
		border-top: 1px solid var(--d-card);
		padding-top: 20px;
	}

	.drop {
		justify-self: start;
	}

	.finish {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 20px;
		padding: 4px 2px;
	}

	@media (min-width: 620px) {
		.pair {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.row {
			grid-template-columns: repeat(4, minmax(0, 1fr));
			align-items: start;
		}

		.drop {
			grid-column: 1 / -1;
		}
	}
</style>
