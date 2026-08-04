<script lang="ts">
	/* The rows are the library's Accordion rather than a second one written
	   here: same keyboard, same region wiring, same open-one-at-a-time. What
	   this page adds is the display size, which the surface's heading rule
	   supplies on its own. */
	import { Accordion, SectionHead, type AccordionItem } from '$lib/ui';
	import { reveal } from './motion';

	const answers: Record<string, string> = {
		migrate:
			'Yes, and we do it for you above 500 products. Products, variants, images, customers, order history and redirects all come across from Shopify, WooCommerce, Magento or a CSV. Typical migration takes three to five working days with no downtime — we move the domain only once you sign off on staging.',
		cost: 'Your plan fee plus 1.9% of what you process. No per-order cents, no charge for extra storefronts inside your plan, no upsell for abandoned cart or multi-currency. Local wallet rates are set by the provider and passed through at cost — the exact number is on every receipt before you confirm.',
		cod: 'Properly — it is a first-class payment method, not a plugin. Couriers can take cash at the door or push a wallet request to the customer on arrival, and every collection is matched against the courier remittance automatically. Your cash ledger reconciles itself.',
		scripts:
			'Right-to-left and left-to-right scripts are both first-class, in the storefront and the admin — layout, checkout, invoices and shipping labels. You can run an RTL and an LTR storefront side by side off the same catalogue.',
		domain:
			'On every paid plan. Connect an existing domain in a few minutes or buy one through us. Certificates are issued and renewed automatically, and you can point several domains at the same shop.',
		leave:
			'You export everything — products, customers, orders, theme files — and go. No exit fee, no notice period, open formats. We would rather keep you because the platform earns it.'
	};

	const questions: AccordionItem[] = [
		{ value: 'migrate', label: 'Can you move my existing store over?' },
		{ value: 'cost', label: 'What does it actually cost me per month?' },
		{ value: 'cod', label: 'Do you support cash on delivery properly?' },
		{ value: 'scripts', label: 'Which languages and scripts do you handle?' },
		{ value: 'domain', label: 'Can I use my own domain?' },
		{ value: 'leave', label: 'What happens if I want to leave?' }
	];
</script>

<section id="faq" class="bg-mk-shell py-mk-section">
	<div class="mk-wrap max-w-[900px]">
		<div class="text-center">
			<SectionHead kicker="FAQ" heading="What merchants ask before they start." centered />
		</div>

		<div use:reveal class="border-t border-mk-rule-soft text-left">
			<Accordion items={questions} single size="lg" panel={answer} />
		</div>
	</div>
</section>

{#snippet answer(value: string)}
	<p class="max-w-[70ch]">{answers[value]}</p>
{/snippet}
