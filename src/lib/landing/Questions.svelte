<script lang="ts">
	import { Disclosure, Section } from '$lib/ui';

	const questions = [
		{
			question: 'How is this different from Dokan?',
			answer:
				'Dokan is a WordPress add-on. You keep the hosting alive, you keep the updates coming, and nothing in Bangladesh works out of the box. Dukkan is hosted for you, with bKash, Nagad, SSLCommerz, Steadfast and Pathao already inside.'
		},
		{
			question: 'How is this different from getcommerce.xyz?',
			answer:
				'They start from one shop and one owner. Dukkan starts from many sellers: sign-up, your cut, split refunds and separate payouts are the middle of the product, not an extra.'
		},
		{
			question: 'Do you take a share of my sales?',
			answer:
				'No. You pay one price a month and keep whatever cut you charge your sellers. Payment and courier companies still charge their own fees.'
		},
		{
			question: 'How does cash on delivery get sorted out?',
			answer:
				'When the courier sends your money, Dukkan lines it up against delivered orders one by one, shows you what is missing or returned, and fixes each seller balance before the next payout.'
		},
		{
			question: 'Can I use my own web address?',
			answer:
				'Yes, from Growth upward. Starter runs on a Dukkan address and you can move across later without losing anything.'
		},
		{
			question: 'What happens if I go past my limits?',
			answer:
				'Nothing stops and no order is lost. We tell you in your dashboard and give you time to move up a plan.'
		},
		{
			question: 'Does it work in Bangla?',
			answer:
				'Yes. The shopfront and the seller dashboard both read in Bangla or English, and you can run the two side by side.'
		},
		{
			question: 'Can I take my data with me?',
			answer:
				'Yes. Products, sellers, orders, payouts and customers all download as CSV. Your data is yours.'
		}
	];
</script>

<Section id="questions" label="Questions" rule>
	<h2 class="t-heading">Asked before signing up.</h2>
	<div class="list">
		{#each questions as item (item.question)}
			<Disclosure {...item} />
		{/each}
	</div>
</Section>

<style>
	.list {
		margin-top: 48px;
		border-top: 1px solid var(--rule);
		max-width: 68ch;
	}
</style>
