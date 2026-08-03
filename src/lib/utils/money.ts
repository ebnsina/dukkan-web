/* The API sends integer minor units: 450000 is ৳4,500.00. Never a float. */
export function fromMinor(minor: number): number {
	return minor / 100;
}

/*
 * `en-IN`, not `en-BD`: Bangladesh groups digits South Asian style — ৳1,00,000,
 * not ৳100,000 — and `en-BD` does not carry that grouping in ICU, it falls back
 * to thousands. `en-IN` is the Latin-digit locale that does. Bengali digits are
 * `bn-BD`, which is a separate decision from grouping.
 */
export function formatMinor(
	minor: number,
	currency = 'BDT',
	locale = 'en-IN',
	options: Intl.NumberFormatOptions = {}
): string {
	return new Intl.NumberFormat(locale, {
		style: 'currency',
		currency,
		currencyDisplay: 'narrowSymbol',
		...options
	}).format(fromMinor(minor));
}

export function formatMinorRange(
	minMinor: number,
	maxMinor: number,
	currency = 'BDT',
	locale = 'en-IN'
): string {
	if (minMinor === maxMinor) return formatMinor(minMinor, currency, locale);
	return `${formatMinor(minMinor, currency, locale)} – ${formatMinor(maxMinor, currency, locale)}`;
}

export function toMinor(amount: number): number {
	return Math.round(amount * 100);
}
