<script lang="ts">
	import { enhance } from '$app/forms';
	import Seo from '$lib/seo/Seo.svelte';
	import { PlusSignIcon, Search01Icon } from '@hugeicons/core-free-icons';
	import { Banner, Button, Chip, Empty, Frame } from '$lib/ui';
	import { productState } from '$lib/admin/state';
	import { formatMinorRange } from '$lib/utils/money';
	import { formatNumber } from '$lib/utils/format';

	let { data, form } = $props();
</script>

<Seo title="Products" description="What you sell." noindex />

<div class="dk-title-row">
	<div>
		<h1 class="dk-h1">Products</h1>
		<p class="dk-date">Everything your shop has for sale.</p>
	</div>
	<div class="dk-acts">
		<Button href="/admin/products/new" icon={PlusSignIcon}>Add a product</Button>
	</div>
</div>

{#if form?.message}
	<div class="dk-stack" style="margin-bottom:14px">
		<Banner title="That did not work" tone="danger">{form.message}</Banner>
	</div>
{/if}

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
	<select id="products-status" class="dk-select" name="status" value={data.filters.status}>
		<option value="">Any status</option>
		<option value="draft">Not published</option>
		<option value="active">On sale</option>
		<option value="archived">Put away</option>
	</select>
	<Button type="submit" size="sm" icon={Search01Icon}>Search</Button>
</form>

<Frame eyebrow="Everything you sell" variant="flush">
	{#if data.products.length === 0}
		<Empty
			title="Nothing here"
			description="Add your first product and it will show up in the shop."
		>
			{#snippet actions()}
				<Button href="/admin/products/new" size="sm" icon={PlusSignIcon}>Add a product</Button>
			{/snippet}
		</Empty>
	{:else}
		<div class="dk-scroll">
			<table class="dk-table">
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
						{@const state = productState(product.status)}
						<tr>
							<td>
								<span class="dk-strong">{product.title}</span>
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
							<td data-numeric>
								<form method="POST" action="?/setStatus" use:enhance class="act">
									<input type="hidden" name="id" value={product.id} />
									<input
										type="hidden"
										name="status"
										value={product.status === 'active' ? 'draft' : 'active'}
									/>
									<Button
										type="submit"
										variant="quiet"
										size="sm"
										aria-label="{product.status === 'active'
											? 'Take off sale'
											: 'Put on sale'}: {product.title}"
									>
										{product.status === 'active' ? 'Take off sale' : 'Put on sale'}
									</Button>
								</form>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}

	{#snippet footer()}
		<span>{formatNumber(data.products.length)} shown</span>
	{/snippet}
</Frame>

<style>
	.bn {
		display: block;
		margin-top: 3px;
		font-size: 12px;
		color: var(--d-faint);
	}

	.act {
		display: inline;
	}
</style>
