<script lang="ts">
	import { enhance } from '$app/forms';
	import Seo from '$lib/seo/Seo.svelte';
	import { Delete02Icon, PencilEdit02Icon, PlusSignIcon } from '@hugeicons/core-free-icons';
	import { Button, Chip, Confirm, Field, toasts } from '$lib/ui';
	import DataTable from '$lib/admin/DataTable.svelte';
	import PageTop from '$lib/admin/PageTop.svelte';
	import RowActions from '$lib/admin/RowActions.svelte';
	import FormSheet from '$lib/admin/FormSheet.svelte';
	import { formatNumber } from '$lib/utils/format';
	import type { Category } from '$lib/api/types';

	let { data } = $props();

	/* Parents first, each followed by its own children, so the list reads as
	   the shape a shopper browses rather than as rows in a table. */
	const tree = $derived(
		data.categories
			.filter((c) => !c.parent_id)
			.flatMap((parent) => [
				{ category: parent, depth: 0 },
				...data.categories
					.filter((c) => c.parent_id === parent.id)
					.map((child) => ({ category: child, depth: 1 }))
			])
	);
	// A child whose parent was deleted elsewhere would otherwise vanish here.
	const orphans = $derived(
		data.categories.filter((c) => c.parent_id && !data.categories.some((p) => p.id === c.parent_id))
	);
	const rows = $derived([...tree, ...orphans.map((category) => ({ category, depth: 0 }))]);

	let adding = $state(false);
	let editing = $state<Category | null>(null);
	let removing = $state<Category | null>(null);
	const parents = $derived(data.categories.filter((c) => !c.parent_id));
</script>

<Seo title="Categories" description="How your shop is arranged." noindex />

<PageTop trail={[{ label: 'Categories' }]}>
	{#snippet actions()}
		<Button icon={PlusSignIcon} onclick={() => (adding = true)}>Add a category</Button>
	{/snippet}
</PageTop>

<DataTable
	{rows}
	noun="category"
	nounPlural="categories"
	emptyTitle="No categories yet"
	emptyBody="Add one and it shows in your shop straight away. Until then everything sits together on one page."
>
	{#snippet emptyAction()}
		<Button size="sm" icon={PlusSignIcon} onclick={() => (adding = true)}>Add a category</Button>
	{/snippet}

	{#snippet head()}
		<th scope="col">Name</th>
		<th scope="col">Web address</th>
		<th scope="col" data-numeric>Items</th>
		<th scope="col">Shown</th>
		<th scope="col"><span class="sr-only">Actions</span></th>
	{/snippet}

	{#snippet row({ category, depth })}
		<tr>
			<td>
				<span class="dk-strong">
					{#if depth > 0}<span class="rail" aria-hidden="true"></span>{/if}
					{category.name}
				</span>
				{#if category.name_bn}<span class="bn">{category.name_bn}</span>{/if}
			</td>
			<td><span class="dk-num">/c/{category.slug}</span></td>
			<td data-numeric>{formatNumber(data.counts[category.id] ?? 0)}</td>
			<td>
				{#if category.is_active}
					<Chip tone="success" label="In the shop" />
				{:else}
					<Chip tone="neutral" label="Hidden" />
				{/if}
			</td>
			<td class="right">
				<RowActions
					label={category.name}
					items={[
						{
							label: 'Edit',
							icon: PencilEdit02Icon,
							onselect: () => (editing = category)
						},
						{
							label: 'Remove',
							icon: Delete02Icon,
							danger: true,
							separatorBefore: true,
							onselect: () => (removing = category)
						}
					]}
				/>
			</td>
		</tr>
	{/snippet}
</DataTable>

<FormSheet
	bind:open={adding}
	title="Add a category"
	description="A shelf customers can browse. You can move products into it afterwards."
	action="?/create"
	saved="Added. It shows in your shop straight away."
>
	<Field label="Name" required>
		{#snippet control(props)}
			<input {...props} class="dk-input" name="name" placeholder="Sarees" required />
		{/snippet}
	</Field>
	<Field label="Name in Bangla" hint="Shown to customers reading in Bangla.">
		{#snippet control(props)}
			<input {...props} class="dk-input" name="name_bn" placeholder="শাড়ি" />
		{/snippet}
	</Field>
	<Field label="Inside" hint="Leave as is for a top-level category.">
		{#snippet control(props)}
			<select {...props} class="dk-select" name="parent_id">
				<option value="">Nothing — top level</option>
				{#each parents as p (p.id)}
					<option value={p.id}>{p.name}</option>
				{/each}
			</select>
		{/snippet}
	</Field>
</FormSheet>

<FormSheet
	bind:open={() => !!editing, (v) => (editing = v ? editing : null)}
	title="Edit {editing?.name ?? 'category'}"
	action="?/update"
	saved="Saved."
>
	{#if editing}
		<input type="hidden" name="id" value={editing.id} />
		<Field label="Name" required>
			{#snippet control(props)}
				<input {...props} class="dk-input" name="name" value={editing?.name ?? ''} required />
			{/snippet}
		</Field>
		<Field label="Name in Bangla">
			{#snippet control(props)}
				<input {...props} class="dk-input" name="name_bn" value={editing?.name_bn ?? ''} />
			{/snippet}
		</Field>
		<Field label="Inside">
			{#snippet control(props)}
				<select {...props} class="dk-select" name="parent_id">
					<option value="">Nothing — top level</option>
					{#each parents.filter((p) => p.id !== editing?.id) as p (p.id)}
						<option value={p.id} selected={p.id === editing?.parent_id}>{p.name}</option>
					{/each}
				</select>
			{/snippet}
		</Field>
		<Field label="Order" hint="Lower shows first.">
			{#snippet control(props)}
				<input
					{...props}
					class="dk-input"
					name="position"
					inputmode="numeric"
					value={editing?.position ?? 0}
				/>
			{/snippet}
		</Field>
		<label class="tick">
			<input type="checkbox" name="is_active" checked={editing.is_active} />
			Show this in the shop
		</label>
	{/if}
</FormSheet>

<Confirm
	bind:open={() => !!removing, (v) => (removing = v ? removing : null)}
	title="Remove {removing?.name ?? ''}?"
>
	Nothing you sell is deleted. Items filed here stay in your shop with no category, and anything
	inside this one moves to the top level.
	{#snippet actions()}
		<form
			method="POST"
			action="?/remove"
			use:enhance={() =>
				async ({ result, update }) => {
					await update();
					if (result.type === 'success') {
						toasts.success('Removed. Anything filed there is still in your shop.');
					}
				}}
		>
			<input type="hidden" name="id" value={removing?.id ?? ''} />
			<Button type="submit" variant="danger" onclick={() => (removing = null)}>Remove it</Button>
		</form>
	{/snippet}
</Confirm>

<style>
	.bn {
		display: block;
		margin-top: 3px;
		font-size: 12px;
		color: var(--d-faint);
	}

	/* A child is one step in, drawn rather than indented by spaces, so the
	   nesting survives a narrow screen. */
	.rail {
		display: inline-block;
		width: 14px;
		margin-right: 8px;
		border-bottom: 1px solid var(--d-edge);
		vertical-align: middle;
	}

	.right {
		text-align: right;
	}

	.tick {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 13px;
	}
</style>
