/* Display figures for the marketing surface; real amounts go through
   `$lib/utils/money`. `en-IN`, not `en-BD`: only it groups ৳1,00,000. */
const whole = new Intl.NumberFormat('en-IN', {
	style: 'currency',
	currency: 'BDT',
	currencyDisplay: 'narrowSymbol',
	maximumFractionDigits: 0
});

const exact = new Intl.NumberFormat('en-IN', {
	style: 'currency',
	currency: 'BDT',
	currencyDisplay: 'narrowSymbol',
	minimumFractionDigits: 2,
	maximumFractionDigits: 2
});

/** ৳4,620 — for prices and totals, where the paisa says nothing. */
export const taka = (amount: number) => whole.format(amount);

/** ৳3,570.84 — for a receipt, where the paisa is the point. */
export const takaExact = (amount: number) => exact.format(amount);
