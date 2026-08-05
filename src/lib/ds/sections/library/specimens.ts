/* Sample content the specimens are built from.
 *
 * Three sections need the same courier list and would otherwise each invent
 * one, which is how a page ends up demonstrating four different products. */

export const couriers = [
	{ value: 'pathao', label: 'Pathao' },
	{ value: 'steadfast', label: 'Steadfast' },
	{ value: 'redx', label: 'RedX', disabled: true }
];

export const faq = [
	{ value: 'fees', label: 'What does Dukkàn cost?', meta: 'Per order, nothing monthly' },
	{ value: 'cod', label: 'How does cash on delivery settle?' },
	{ value: 'courier', label: 'Which couriers can I book?' }
];

export const answers: Record<string, string> = {
	fees: 'A flat cut of each order that goes through. No monthly charge, and nothing to pay in a month you sell nothing.',
	cod: 'The courier collects the cash and pays it into your bank account. The reconciliation queue shows what is still out with a rider.',
	courier: 'Pathao and Steadfast today, from the order page. RedX is next.'
};
