<script lang="ts">
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import {
		Store01Icon,
		WalletAdd01Icon,
		DeliveryTruck01Icon,
		MoneyBag02Icon,
		Globe02Icon,
		UserGroupIcon
	} from '@hugeicons/core-free-icons';
	import { Section } from '$lib/ui';

	/* Not numbered: these are not a sequence. */
	const features = [
		{
			icon: Store01Icon,
			name: 'Sellers who sign themselves up',
			body: 'They fill in their shop, their products and their papers. You approve or you do not.'
		},
		{
			icon: WalletAdd01Icon,
			name: 'bKash, Nagad and cards',
			body: 'Money comes in the way your customers already pay. Refunds split across sellers on their own.'
		},
		{
			icon: DeliveryTruck01Icon,
			name: 'Steadfast and Pathao pickups',
			body: 'Book a pickup, print the label, watch the parcel move, all from the order.'
		},
		{
			icon: MoneyBag02Icon,
			name: 'Cash on delivery that adds up',
			body: 'The courier sends money, Dukkan matches it order by order and shows you what is short.'
		},
		{
			icon: Globe02Icon,
			name: 'Your name, your web address',
			body: 'Your logo, your address, Bangla or English. Customers never see ours.'
		},
		{
			icon: UserGroupIcon,
			name: 'A team with the right keys',
			body: 'Owner, shop floor, accounts and support each see only what they should.'
		}
	];
</script>

<Section
	id="what-you-get"
	eyebrow="What you get"
	heading="Everything a marketplace needs, already joined up."
	lead="Built for many sellers from the first screen. Sign-up, commissions, split refunds and separate payouts are the middle of the product, not an extra you bolt on later."
	rule
>
	<ul class="grid">
		{#each features as feature (feature.name)}
			<li>
				<span class="glyph" aria-hidden="true">
					<HugeiconsIcon icon={feature.icon} size={22} strokeWidth={1.5} />
				</span>
				<h3 class="t-sub">{feature.name}</h3>
				<p class="body">{feature.body}</p>
			</li>
		{/each}
	</ul>
</Section>

<style>
	.grid {
		display: grid;
		gap: 44px 40px;
	}

	li {
		padding-top: 24px;
		border-top: 1px solid var(--rule);
	}

	.glyph {
		display: block;
		margin-bottom: 20px;
		color: var(--muted);
	}

	.body {
		margin-top: 12px;
		font-size: var(--size-body);
		line-height: 1.6;
		color: var(--muted);
		max-width: 42ch;
	}

	@media (min-width: 680px) {
		.grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (min-width: 1040px) {
		.grid {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}
</style>
