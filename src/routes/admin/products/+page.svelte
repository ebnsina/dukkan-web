<script lang="ts">
	import { enhance } from '$app/forms';
	import Seo from '$lib/seo/Seo.svelte';
	import { Button, Empty, Note } from '$lib/ui';
	import { formatMinorRange } from '$lib/utils/money';
	import { formatNumber } from '$lib/utils/format';

	let { data, form } = $props();

	const WORD: Record<string, string> = {
		draft: 'Not published',
		active: 'On sale',
		archived: 'Put away'
	};
</script>

<Seo title="Products" description="What you sell." noindex />

<div class="head">
	<h1 class="t-heading">Products</h1>
	<Button href="/admin/products/new" arrow>Add a product</Button>
</div>

{#if form?.message}
	<Note title="That did not work" tone="firm">{form.message}</Note>
{/if}

<form method="GET" class="filters">
	<label>
		<span class="sr-only">Search products</span>
		<input type="search" name="q" value={data.filters.q} placeholder="Name in English or Bangla" />
	</label>
	<label>
		<span class="sr-only">Status</span>
		<select name="status" value={data.filters.status}>
			<option value="">Any status</option>
			<option value="draft">Not published</option>
			<option value="active">On sale</option>
			<option value="archived">Put away</option>
		</select>
	</label>
	<button class="go t-button" type="submit">Search</button>
</form>

{#if data.products.length === 0}
	<Empty title="Nothing here" description="Add your first product and it will show up in the shop.">
		{#snippet actions()}
			<Button href="/admin/products/new" arrow>Add a product</Button>
		{/snippet}
	</Empty>
{:else}
	<div class="scroll">
		<table>
			<thead>
				<tr>
					<th scope="col">Name</th>
					<th scope="col">Status</th>
					<th scope="col" data-numeric>Price</th>
					<th scope="col"><span class="sr-only">Actions</span></th>
				</tr>
			</thead>
			<tbody>
				{#each data.products as product (product.id)}
					<tr>
						<td>
							<span class="name">{product.title}</span>
							{#if product.title_bn}<span class="bn">{product.title_bn}</span>{/if}
						</td>
						<td class="quiet">{WORD[product.status] ?? product.status}</td>
						<td data-numeric>
							{#if product.price_min_minor !== null && product.price_max_minor !== null}
								{formatMinorRange(product.price_min_minor, product.price_max_minor)}
							{:else}
								—
							{/if}
						</td>
						<td>
							<form method="POST" action="?/setStatus" use:enhance class="act">
								<input type="hidden" name="id" value={product.id} />
								<input
									type="hidden"
									name="status"
									value={product.status === 'active' ? 'draft' : 'active'}
								/>
								<button class="toggle t-button" type="submit">
									{product.status === 'active' ? 'Take off sale' : 'Put on sale'}
								</button>
							</form>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
	<p class="count t-label">{formatNumber(data.products.length)} shown</p>
{/if}

<style>
	.head {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
	}

	.filters {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		margin: 28px 0 20px;
	}

	input,
	select {
		height: 40px;
		padding-inline: 12px;
		background: var(--paper);
		color: var(--ink);
		border: 1px solid var(--rule-strong);
		font-family: var(--font-display);
		font-size: 14px;
	}

	input {
		width: min(320px, 70vw);
	}

	input:focus,
	select:focus {
		outline: none;
		border-color: var(--ink);
	}

	.go {
		height: 40px;
		padding-inline: 20px;
		background: var(--inverse-paper);
		color: var(--inverse-ink);
		border: none;
		cursor: pointer;
	}

	.scroll {
		overflow-x: auto;
	}

	table {
		width: 100%;
		border-collapse: collapse;
	}

	th {
		padding: 12px 16px 12px 0;
		text-align: left;
		font-family: var(--font-mono);
		font-size: 10.5px;
		font-weight: 400;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--faint);
		border-bottom: 1px solid var(--rule-strong);
		white-space: nowrap;
	}

	td {
		padding: 14px 16px 14px 0;
		font-size: 14px;
		border-bottom: 1px solid var(--rule);
		color: var(--muted);
	}

	th[data-numeric],
	td[data-numeric] {
		text-align: right;
		font-family: var(--font-mono);
		font-variant-numeric: tabular-nums;
		font-feature-settings: 'zero' 1;
		color: var(--ink);
		white-space: nowrap;
	}

	th:last-child,
	td:last-child {
		padding-right: 0;
		text-align: right;
	}

	.name {
		display: block;
		color: var(--ink);
	}

	.bn {
		display: block;
		margin-top: 3px;
		font-size: 12px;
		color: var(--faint);
	}

	.quiet {
		color: var(--faint);
	}

	.act {
		display: inline;
	}

	.toggle {
		height: 32px;
		padding-inline: 12px;
		background: none;
		border: 1px solid var(--rule-strong);
		color: var(--muted);
		cursor: pointer;
		white-space: nowrap;
	}

	.toggle:hover {
		color: var(--ink);
		border-color: var(--ink);
	}

	.count {
		margin-top: 20px;
		color: var(--faint);
	}
</style>
