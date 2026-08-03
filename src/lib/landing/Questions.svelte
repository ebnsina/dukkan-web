<script lang="ts">
	import { Disclosure, Section } from '$lib/ui';

	const questions = [
		{
			question: 'Do I need to install or host anything?',
			answer:
				'No. Dukkan is hosted for you, with bKash, Nagad, SSLCommerz, Steadfast and Pathao already connected. You will not touch a server or write a line of code.'
		},
		{
			question: 'Is this built for more than one seller?',
			answer:
				'Yes, from the ground up. Sign-up, your commission, split refunds and separate payouts are the middle of the product, not an extra.'
		},
		{
			question: 'How do sellers get paid, and how often?',
			answer:
				'Every seven days by default, or on the day you pick. Each seller gets a statement showing every order, your commission and the courier charge, so the number is never a surprise.'
		},
		{
			question: 'What happens with cash on delivery?',
			answer:
				'When the courier sends your money, Dukkan lines it up against delivered orders one by one and shows you anything missing or returned. Seller balances are corrected before the next payout runs.'
		},
		{
			question: 'Can I take a different cut from different sellers?',
			answer:
				'Yes. Set one rate for the whole marketplace, or a different rate per seller or per category. Changes apply to new orders, never to ones already placed.'
		},
		{
			question: 'Which payment methods can customers use?',
			answer:
				'bKash, Nagad, cards through SSLCommerz, and cash on delivery. You choose which ones to switch on.'
		},
		{
			question: 'Can I use my own web address?',
			answer:
				'Yes, from Growth upward. Starter runs on a Dukkan address and you can move across later without losing anything.'
		},
		{
			question: 'What if a seller does not deliver?',
			answer:
				'You can hold their payout, refund the customer from the order screen, and pause the shop. The refund is split correctly so your commission comes back out too.'
		},
		{
			question: 'How long does it take to open?',
			answer:
				'A day. Name the marketplace, add your logo and set your commission, and the shopfront is live. Connecting payments and a courier takes an afternoon.'
		},
		{
			question: 'Can I take my data with me?',
			answer:
				'Yes. Products, sellers, orders, payouts and customers all download as CSV. Your data is yours.'
		}
	];
</script>

<Section id="questions" eyebrow="Questions" heading="Asked before signing up." rule>
	<div class="list">
		{#each questions as item (item.question)}
			<Disclosure {...item} />
		{/each}
	</div>
</Section>

<style>
	.list {
		border-top: 1px solid var(--rule);
		max-width: 68ch;
	}
</style>
