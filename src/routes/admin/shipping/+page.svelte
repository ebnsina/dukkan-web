<script lang="ts">
	import { enhance } from '$app/forms';
	import { Delete02Icon, PlusSignIcon, MapsLocation01Icon } from '@hugeicons/core-free-icons';
	import { announce } from '$lib/admin/announce';
	import Seo from '$lib/seo/Seo.svelte';
	import { Banner, Button, Checkbox, Empty, Field, Frame } from '$lib/ui';
	import DataTable from '$lib/admin/DataTable.svelte';
	import PageTop from '$lib/admin/PageTop.svelte';
	import RowActions from '$lib/admin/RowActions.svelte';
	import FormSheet from '$lib/admin/FormSheet.svelte';
	import { formatMinor } from '$lib/utils/money';
	import { formatNumber } from '$lib/utils/format';
	import type { ShippingRate } from '$lib/admin/types';

	let { data, form } = $props();

	/* One sheet, two ways in: the header button and the empty state, which is
	   what a new shop actually sees first. */
	let addingArea = $state(false);

	/* A district's name reads better than its code, and the shop owner never
	   typed the code in the first place. */
	const nameOf = (code: string) =>
		data.districts.find((district) => district.code === code)?.name ?? code;

	// Districts nobody has claimed fall to the default area, so say which.
	const claimed = $derived(new Set(data.zones.flatMap((zone) => zone.districts)));
	const spare = $derived(data.districts.filter((district) => !claimed.has(district.code)));
	const fallback = $derived(data.zones.find((zone) => zone.is_default));

	function takes(rate: ShippingRate): string {
		if (rate.min_days && rate.max_days) return `${rate.min_days}–${rate.max_days} days`;
		if (rate.max_days) return `up to ${rate.max_days} days`;
		return '—';
	}
</script>

<Seo title="Delivery charges" description="What you charge to deliver, and where." noindex />

<PageTop trail={[{ label: 'Delivery charges' }]}>
	<!-- Not a caption: it names the two steps the page expects, in order. -->
	{#snippet meta()}Group districts into areas, then price each area.{/snippet}

	{#snippet actions()}
		<FormSheet
			bind:open={addingArea}
			title="Another delivery area"
			description="Most shops need two: inside Dhaka, and outside it."
			action="?/addZone"
			saved="The area is added."
		>
			{#snippet trigger(open)}
				<Button icon={PlusSignIcon} onclick={open}>New area</Button>
			{/snippet}

			<Field label="What to call it" required error={form?.fields?.name}>
				{#snippet control(props)}
					<input {...props} class="dk-input" name="name" placeholder="Outside Dhaka" required />
				{/snippet}
			</Field>
			<Checkbox name="is_default" label="Use this for any district not listed elsewhere" />
			<p class="dk-note">
				Mark one area as the fallback so a district you forget still has a price.
			</p>
		</FormSheet>
	{/snippet}
</PageTop>

{#if spare.length > 0}
	<div class="msg">
		<Banner
			title="{formatNumber(spare.length)} districts are not in any area"
			tone={fallback ? 'info' : 'warning'}
		>
			{#if fallback}
				They are charged at your “{fallback.name}” rate.
			{:else if data.zones.length === 0}
				<!-- "Mark one as the fallback" is advice nobody can follow with no
				     areas to mark, which is exactly the state a new shop is in. -->
				Until you add one, checkout cannot quote delivery anywhere.
			{:else}
				Nothing covers them, so checkout will refuse those addresses. Mark one area as the fallback.
			{/if}
		</Banner>
	</div>
{/if}

<div class="sheet">
	<!-- Every shop starts here with nothing, so this is the first thing a new
	     shop owner reads on this page — not an edge case. -->
	{#if data.zones.length === 0}
		<Frame variant="flush">
			<div class="hollow">
				<Empty
					title="No delivery charges yet"
					description="Group your districts into areas — most shops need two, inside Dhaka and outside it — then set what each one costs."
				>
					{#snippet actions()}
						<Button size="sm" icon={PlusSignIcon} onclick={() => (addingArea = true)}>
							Add your first area
						</Button>
					{/snippet}
				</Empty>
			</div>
		</Frame>
	{/if}

	{#each data.zones as zone (zone.id)}
		<div>
			<!-- Both sheets act on this zone alone, so they sit with its table
			     rather than with the page. -->
			<div class="dk-acts zone-acts">
				<FormSheet
					title="A charge for {zone.name}"
					description="What a customer in this area pays to have an order delivered."
					action="?/addRate"
					saved="Checkout uses the new charge straight away."
				>
					{#snippet trigger(open)}
						<Button size="sm" variant="quiet" icon={PlusSignIcon} onclick={open}>
							Add a charge
						</Button>
					{/snippet}

					<input type="hidden" name="zone_id" value={zone.id} />
					<Field label="What to call it" required>
						{#snippet control(props)}
							<input {...props} class="dk-input" name="name" placeholder="Standard" required />
						{/snippet}
					</Field>
					<Field label="Charge in taka" required error={form?.fields?.price}>
						{#snippet control(props)}
							<input
								{...props}
								class="dk-input"
								name="price"
								inputmode="decimal"
								placeholder="80"
								required
							/>
						{/snippet}
					</Field>
					<Field
						label="Free above"
						hint="Leave blank to always charge."
						error={form?.fields?.free_above}
					>
						{#snippet control(props)}
							<input {...props} class="dk-input" name="free_above" inputmode="decimal" />
						{/snippet}
					</Field>
					<div class="pair-fields">
						<Field label="Days, at least">
							{#snippet control(props)}
								<input {...props} class="dk-input" name="min_days" inputmode="numeric" />
							{/snippet}
						</Field>
						<Field label="Days, at most">
							{#snippet control(props)}
								<input {...props} class="dk-input" name="max_days" inputmode="numeric" />
							{/snippet}
						</Field>
					</div>
				</FormSheet>

				<FormSheet
					title="Districts in {zone.name}"
					description="A district belongs to one area, so ticking it here takes it out of another."
					action="?/setDistricts"
					saved="Those districts are in this area now."
				>
					{#snippet trigger(open)}
						<Button size="sm" variant="quiet" icon={MapsLocation01Icon} onclick={open}>
							{formatNumber(zone.districts.length)} districts
						</Button>
					{/snippet}

					<input type="hidden" name="zone_id" value={zone.id} />
					<div class="ticks">
						{#each data.districts as district (district.code)}
							<Checkbox
								name="districts"
								value={district.code}
								checked={zone.districts.includes(district.code)}
								label={district.name}
							/>
						{/each}
					</div>
				</FormSheet>
			</div>

			<DataTable
				title={zone.name}
				rows={zone.rates}
				noun="charge"
				paged={false}
				emptyTitle="No charge set"
				emptyBody="Until you add one, checkout cannot quote delivery here."
			>
				{#snippet head()}
					<th scope="col">Charge</th>
					<th scope="col" data-numeric>Price</th>
					<th scope="col">Free above</th>
					<th scope="col">Takes</th>
					<th scope="col"><span class="sr-only">Actions</span></th>
				{/snippet}

				{#snippet row(rate: ShippingRate)}
					<tr>
						<td><span class="dk-strong">{rate.name}</span></td>
						<td data-numeric>{formatMinor(rate.price_minor)}</td>
						<td>{rate.free_above_minor === null ? '—' : formatMinor(rate.free_above_minor)}</td>
						<td>{takes(rate)}</td>
						<td class="right">
							<!-- The form is here so the row owns it; the menu only names it. -->
							<form
								method="POST"
								action="?/removeRate"
								id="remove-rate-{rate.id}"
								use:enhance={announce('Charge removed.')}
							>
								<input type="hidden" name="rate_id" value={rate.id} />
							</form>
							<RowActions
								label="the {rate.name} charge"
								items={[
									{
										label: 'Remove the charge',
										icon: Delete02Icon,
										danger: true,
										formId: `remove-rate-${rate.id}`
									}
								]}
							/>
						</td>
					</tr>
				{/snippet}
			</DataTable>

			<p class="where dk-hint">
				{zone.districts.length > 0 ? zone.districts.map(nameOf).join(', ') : 'No districts yet'}
			</p>
		</div>
	{/each}
</div>

<style>
	.msg {
		margin-bottom: 14px;
	}

	.hollow {
		padding: 8px;
	}

	.sheet {
		display: flex;
		flex-direction: column;
		gap: 14px;
		max-width: 900px;
	}

	.where {
		margin: 8px 2px 0;
	}

	.zone-acts {
		justify-content: flex-end;
		margin-bottom: 10px;
	}

	.right {
		text-align: right;
	}

	.pair-fields {
		display: grid;
		gap: 14px;
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.ticks {
		display: grid;
		gap: 8px 16px;
		grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
	}
</style>
