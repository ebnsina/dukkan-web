<script lang="ts">
	import { enhance } from '$app/forms';
	import Seo from '$lib/seo/Seo.svelte';
	import { Button, Field, Input, Note, Select, Switch, Textarea } from '$lib/ui';

	let { data, form } = $props();

	interface Row {
		sku: string;
		title: string;
		price: string;
		on_hand: string;
	}

	let rows = $state<Row[]>([{ sku: '', title: '', price: '', on_hand: '0' }]);
	let publish = $state(false);

	const categoryOptions = $derived(
		data.categories.map((c) => ({
			value: c.id,
			label: c.name_bn ? `${c.name} — ${c.name_bn}` : c.name
		}))
	);
	const value = (key: keyof NonNullable<typeof form>['values']) => form?.values?.[key] ?? '';
</script>

<Seo title="Add a product" description="Put something new in the shop." noindex />

<a class="back t-button" href="/admin/products">← All products</a>
<h1 class="t-heading">Add a product</h1>

{#if form?.message}
	<Note title="Not saved" tone="firm">{form.message}</Note>
{/if}

<form method="POST" use:enhance class="form">
	<section>
		<h2 class="legend t-label">What it is</h2>
		<div class="pair">
			<Field label="Name" required error={form?.fields?.title}>
				{#snippet control(props)}
					<Input {...props} name="title" value={value('title')} />
				{/snippet}
			</Field>
			<Field label="Name in Bangla" hint="Shown to customers reading in Bangla.">
				{#snippet control(props)}
					<Input {...props} name="title_bn" value={value('title_bn')} />
				{/snippet}
			</Field>
		</div>

		<Field label="Category">
			{#snippet control(props)}
				<Select {...props} name="category_id" options={categoryOptions} placeholder="No category" />
			{/snippet}
		</Field>

		<Field label="One-line summary">
			{#snippet control(props)}
				<Input {...props} name="summary" value={value('summary')} />
			{/snippet}
		</Field>

		<Field label="Description">
			{#snippet control(props)}
				<Textarea {...props} name="description" rows={4} value={value('description')} />
			{/snippet}
		</Field>
	</section>

	<section>
		<div class="legend-row">
			<h2 class="legend t-label">Choices and price</h2>
			<button
				class="add t-button"
				type="button"
				onclick={() => (rows = [...rows, { sku: '', title: '', price: '', on_hand: '0' }])}
			>
				Add another choice
			</button>
		</div>

		<p class="hint">
			One row is enough if the product comes only one way. Add a row for each size or colour.
		</p>

		<div class="rows">
			{#each rows as row, index (index)}
				<div class="row">
					<Field
						label="Choice"
						hint="Like “Red” or “Large”. Leave blank if there is only one."
						error={form?.fields?.[`variant.${index}.title`]}
					>
						{#snippet control(props)}
							<Input {...props} name="variant_title" bind:value={row.title} />
						{/snippet}
					</Field>
					<Field label="Price in taka" required error={form?.fields?.[`variant.${index}.price`]}>
						{#snippet control(props)}
							<Input
								{...props}
								name="variant_price"
								bind:value={row.price}
								numeric
								inputmode="decimal"
								placeholder="4500"
							/>
						{/snippet}
					</Field>
					<Field label="In stock" error={form?.fields?.[`variant.${index}.on_hand`]}>
						{#snippet control(props)}
							<Input
								{...props}
								name="variant_stock"
								bind:value={row.on_hand}
								numeric
								inputmode="numeric"
							/>
						{/snippet}
					</Field>
					<Field label="Your code" hint="Optional.">
						{#snippet control(props)}
							<Input {...props} name="variant_sku" bind:value={row.sku} />
						{/snippet}
					</Field>
					{#if rows.length > 1}
						<button
							class="drop t-button"
							type="button"
							onclick={() => (rows = rows.filter((_, i) => i !== index))}
						>
							Remove
						</button>
					{/if}
				</div>
			{/each}
		</div>
	</section>

	<div class="finish">
		<Switch
			bind:checked={publish}
			label="Put it on sale now"
			description="Otherwise it is saved but stays hidden."
		/>
		<input type="hidden" name="publish" value={publish ? 'on' : ''} />
		<Button type="submit" arrow>Save the product</Button>
	</div>
</form>

<style>
	.back {
		display: inline-block;
		color: var(--faint);
		text-decoration: none;
		margin-bottom: 24px;
	}

	.back:hover {
		color: var(--ink);
	}

	.form {
		display: flex;
		flex-direction: column;
		gap: 48px;
		margin-top: 32px;
		max-width: 900px;
	}

	section {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.legend {
		color: var(--faint);
		padding-bottom: 14px;
		border-bottom: 1px solid var(--rule-strong);
	}

	.legend-row {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 16px;
	}

	.legend-row .legend {
		flex: 1;
	}

	.hint {
		font-size: 14px;
		line-height: 1.6;
		color: var(--muted);
	}

	.pair {
		display: grid;
		gap: 20px;
	}

	.rows {
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	.row {
		display: grid;
		gap: 16px;
		padding-bottom: 24px;
		border-bottom: 1px solid var(--rule);
	}

	.add,
	.drop {
		height: 34px;
		padding-inline: 14px;
		background: none;
		border: 1px solid var(--rule-strong);
		color: var(--muted);
		cursor: pointer;
		white-space: nowrap;
	}

	.add:hover,
	.drop:hover {
		color: var(--ink);
		border-color: var(--ink);
	}

	.drop {
		justify-self: start;
	}

	.finish {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 24px;
		padding-top: 8px;
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
