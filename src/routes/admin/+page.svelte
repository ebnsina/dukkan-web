<script lang="ts">
	/* An overview and nothing else.
	 *
	 * This page used to carry six panels: recent orders, issues needing a
	 * person, stock running out, parcels in flight, money owed. Every one of
	 * those has its own page that shows the whole list rather than the first
	 * five rows, so keeping a copy here meant two places to maintain, two
	 * places that could disagree, and a landing page a shop owner had to read
	 * rather than glance at.
	 *
	 * So this answers one question — is anything wrong, and how is today going —
	 * and every figure is a door to the page that owns the detail behind it.
	 */
	import Seo from '$lib/seo/Seo.svelte';
	import { Banner, Button, Stat } from '$lib/ui';
	import PageTop from '$lib/admin/PageTop.svelte';
	import { formatMinor } from '$lib/utils/money';
	import { formatNumber } from '$lib/utils/format';

	let { data } = $props();

	const f = $derived(data.figures);

	const today = new Intl.DateTimeFormat('en-GB', {
		weekday: 'long',
		day: 'numeric',
		month: 'long'
	}).format(new Date());

	/* Money the courier is holding is the one figure nothing else can tell a
	   shop owner, and the reason reconciliation exists. It leads. */
	const chasing = $derived(f.critical_issues > 0);
</script>

<Seo title="Overview" description="Your shop today." noindex />

<PageTop trail={[{ label: 'Overview' }]}>
	{#snippet meta()}{today}{/snippet}

	{#snippet actions()}
		<Button href="/admin/orders">See today's orders</Button>
	{/snippet}
</PageTop>

{#if chasing}
	<div class="msg">
		<Banner title="Money is missing" tone="danger">
			{formatNumber(f.critical_issues)}
			{f.critical_issues === 1 ? 'statement does' : 'statements do'} not add up. Every taka a courier
			collected should reach you.
			{#snippet actions()}
				<Button href="/admin/reconciliation" variant="quiet">Open money owed</Button>
			{/snippet}
		</Banner>
	</div>
{/if}

<!-- Today first, because that is what a shop owner opens this for. -->
<section class="dk-stats">
	<Stat
		label="Orders today"
		value={formatNumber(f.orders_today)}
		sub="{formatNumber(f.orders_this_month)} this month"
		href="/admin/orders"
	/>
	<Stat
		label="Sales today"
		value={formatMinor(f.sales_today_minor, f.currency)}
		sub="{formatMinor(f.sales_month_minor, f.currency)} this month"
		href="/admin/orders"
	/>
	<Stat
		label="Waiting on you"
		value={formatNumber(f.awaiting_confirmation + f.awaiting_dispatch)}
		sub="to confirm or send"
		tone={f.awaiting_confirmation + f.awaiting_dispatch > 0 ? 'warning' : 'neutral'}
		href="/admin/orders?status=placed"
	/>
	<Stat
		label="On its way"
		value={formatNumber(f.in_transit)}
		sub="with the courier"
		href="/admin/orders?status=shipped"
	/>
</section>

<section class="dk-stats second">
	<Stat
		label="Owed to you"
		value={formatMinor(f.outstanding_cod_minor, f.currency)}
		sub="{formatNumber(f.outstanding_parcels)} {f.outstanding_parcels === 1
			? 'parcel'
			: 'parcels'} collected, not paid over"
		tone={f.outstanding_cod_minor > 0 ? 'info' : 'neutral'}
		href="/admin/reconciliation"
	/>
	<Stat
		label="Needs a person"
		value={formatNumber(f.open_issues)}
		sub="{formatNumber(f.critical_issues)} serious"
		tone={chasing ? 'danger' : f.open_issues > 0 ? 'warning' : 'neutral'}
		href="/admin/reconciliation"
	/>
	<Stat
		label="Running out"
		value={formatNumber(f.out_of_stock)}
		sub="nothing left to sell"
		tone={f.out_of_stock > 0 ? 'warning' : 'neutral'}
		href="/admin/low-stock"
	/>
	<Stat
		label="On sale"
		value={formatNumber(f.active_products)}
		sub="customers can buy these"
		href="/admin/products"
	/>
</section>

<style>
	.msg {
		margin-bottom: 14px;
	}

	.second {
		margin-top: 12px;
	}
</style>
