<script lang="ts">
	import {
		Store01Icon,
		WalletAdd01Icon,
		DeliveryTruck01Icon,
		MoneyBag02Icon,
		Globe02Icon,
		UserGroupIcon
	} from '@hugeicons/core-free-icons';
	import { Section, ServiceRow } from '$lib/ui';

	/* Not numbered: these are not a sequence. */
	const rows = [
		{
			icon: Store01Icon,
			name: 'Sellers who sign themselves up',
			summary:
				'They fill in their shop, their products and their papers. You approve or you do not.',
			meta: 'Sellers'
		},
		{
			icon: WalletAdd01Icon,
			name: 'bKash, Nagad and cards',
			summary:
				'Money comes in the way your customers already pay. Refunds split across sellers on their own.',
			meta: 'Money in'
		},
		{
			icon: DeliveryTruck01Icon,
			name: 'Steadfast and Pathao pickups',
			summary: 'Book a pickup, print the label, watch the parcel move, all from the order.',
			meta: 'Delivery'
		},
		{
			icon: MoneyBag02Icon,
			name: 'Cash on delivery that adds up',
			summary:
				'The courier sends money, Dukkan matches it order by order and shows you what is short.',
			meta: 'Cash'
		},
		{
			icon: Globe02Icon,
			name: 'Your name, your web address',
			summary: 'Your logo, your address, Bangla or English. Customers never see ours.',
			meta: 'Brand'
		},
		{
			icon: UserGroupIcon,
			name: 'A team with the right keys',
			summary: 'Owner, shop floor, accounts and support each see only what they should.',
			meta: 'Team'
		}
	];
</script>

<Section id="what-you-get" label="What you get" rule>
	<h2 class="t-heading">Everything a marketplace needs, already joined up.</h2>
	<p class="lead t-lead">
		Not a plugin you have to keep alive. Not a single-shop cart stretched to fit. One thing, built
		for many sellers from the first screen.
	</p>

	<div class="rows">
		{#each rows as row (row.name)}
			<div data-reveal-item>
				<ServiceRow {...row} href="/#pricing" />
			</div>
		{/each}
	</div>
</Section>

<style>
	.lead {
		margin-top: 24px;
		color: var(--muted);
	}

	.rows {
		margin-top: 56px;
		border-top: 1px solid var(--rule);
	}
</style>
