<script lang="ts">
	/* The six things that stop someone signing up.
	 *
	 * Native `details` rows: they open without JavaScript, they are in the page
	 * whether open or not, and they print. The answers are the honest ones —
	 * onboarding really is done by hand at this size, and saying so reads
	 * better than implying a wizard that does not exist.
	 */
	const questions = [
		[
			'What do you take out of each order?',
			'Nothing. You pay one flat fee a month for the platform and keep the whole order. Your payment gateway and your courier charge you their own rates directly, at the rates you agreed with them.'
		],
		[
			'Whose account does the money arrive in?',
			'Yours. The gateway account, the courier account and the SMS account are all in your name — Dukkàn holds none of it and cannot move it. That is also why the credentials are yours to add and only an owner or an admin can change them.'
		],
		[
			'Can I start without a payment gateway?',
			'Yes. Cash on delivery needs no gateway at all, and most orders here are paid at the door anyway. Add the online payment page whenever your merchant application comes through.'
		],
		[
			'What happens when the courier report does not match?',
			'The line is raised against the orders it belongs to and left for you. Nothing is quietly absorbed to make a day look balanced, and no unmatched line is dropped.'
		],
		[
			'Can I use my own domain?',
			'Your free address works from the first day. Your own domain connects on the plans that include it, with the certificate issued and renewed for you.'
		],
		[
			'How do my existing products get in?',
			'We are onboarding the first shops by hand, on purpose. Send the list in whatever shape you keep it — a spreadsheet, photographs, a page of notes — and we will set the catalogue up with you.'
		]
	];
</script>

<div class="border-t border-lg-ink">
	{#each questions as [question, answer] (question)}
		<details class="group border-b border-lg-rule-soft">
			<summary
				class="flex cursor-pointer list-none items-baseline justify-between gap-6 py-5 text-[17px] tracking-tight marker:hidden hover:text-lg-brand"
			>
				{question}
				<span
					aria-hidden="true"
					class="lg-num shrink-0 text-lg-faint transition-transform duration-200 group-open:rotate-45 motion-reduce:transition-none"
					>+</span
				>
			</summary>
			<p class="max-w-[62ch] pb-6 text-[15px] text-lg-muted">{answer}</p>
		</details>
	{/each}
</div>
