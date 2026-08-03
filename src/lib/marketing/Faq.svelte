<script lang="ts">
	import { reveal } from './motion';
	import MkSectionHead from './ui/MkSectionHead.svelte';

	const questions = [
		{
			q: 'Can you move my existing store over?',
			a: 'Yes, and we do it for you above 500 products. Products, variants, images, customers, order history and redirects all come across from Shopify, WooCommerce, Magento or a CSV. Typical migration takes three to five working days with no downtime — we move the domain only once you sign off on staging.'
		},
		{
			q: 'What does it actually cost me per month?',
			a: 'Your plan fee plus 1.9% of what you process. No per-order cents, no charge for extra storefronts inside your plan, no upsell for abandoned cart or multi-currency. Local wallet rates are set by the provider and passed through at cost — the exact number is on every receipt before you confirm.'
		},
		{
			q: 'Do you support cash on delivery properly?',
			a: 'Properly — it is a first-class payment method, not a plugin. Couriers can take cash at the door or push a wallet request to the customer on arrival, and every collection is matched against the courier remittance automatically. Your cash ledger reconciles itself.'
		},
		{
			q: 'Which languages and scripts do you handle?',
			a: 'Right-to-left and left-to-right scripts are both first-class, in the storefront and the admin — layout, checkout, invoices and shipping labels. You can run an RTL and an LTR storefront side by side off the same catalogue.'
		},
		{
			q: 'Can I use my own domain?',
			a: 'On every paid plan. Connect an existing domain in a few minutes or buy one through us. Certificates are issued and renewed automatically, and you can point several domains at the same shop.'
		},
		{
			q: 'What happens if I want to leave?',
			a: 'You export everything — products, customers, orders, theme files — and go. No exit fee, no notice period, open formats. We would rather keep you because the platform earns it.'
		}
	];

	let open = $state<number | null>(null);
</script>

<section id="faq" class="py-mk-section">
	<div class="mk-wrap max-w-[980px]">
		<div class="text-center">
			<MkSectionHead kicker="FAQ" heading="What merchants ask before they start." centered />

			<div use:reveal class="border-t border-mk-rule-soft text-left">
				{#each questions as item, i (item.q)}
					{@const isOpen = open === i}
					<div class="border-b border-mk-rule-soft">
						<h3>
							<button
								type="button"
								onclick={() => (open = isOpen ? null : i)}
								aria-expanded={isOpen}
								aria-controls="mk-faq-{i}"
								class="flex w-full cursor-pointer items-center justify-between gap-5 py-6 text-left mk-display text-[clamp(17px,1.7vw,21px)] font-bold transition-colors duration-200 hover:text-mk-lime-ink {isOpen
									? 'text-mk-lime-ink'
									: ''}"
							>
								{item.q}
								<!-- Plus → minus: the vertical bar rotates flat, the horizontal one stays. -->
								<span aria-hidden="true" class="relative size-4 flex-none">
									<i
										class="absolute top-[7.5px] left-0 h-[1.5px] w-4 {isOpen
											? 'bg-mk-lime-ink'
											: 'bg-mk-ink'}"
									></i>
									<i
										class="absolute top-0 left-[7.5px] h-4 w-[1.5px] origin-center transition-transform duration-300 {isOpen
											? 'rotate-90 bg-mk-lime-ink'
											: 'bg-mk-ink'}"
									></i>
								</span>
							</button>
						</h3>
						<div
							id="mk-faq-{i}"
							class="grid transition-[grid-template-rows] duration-[400ms] ease-mk {isOpen
								? 'grid-rows-[1fr]'
								: 'grid-rows-[0fr]'}"
						>
							<div class="overflow-hidden">
								<p class="max-w-[70ch] pb-[26px] text-[15px] text-mk-muted">{item.a}</p>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>
