/* The API sends integer minor units: 450000 is ৳4,500.00. Never a float. */
export function fromMinor(minor: number): number {
	return minor / 100;
}

export function formatMinor(
	minor: number,
	currency = 'BDT',
	locale = 'en-BD',
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
	locale = 'en-BD'
): string {
	if (minMinor === maxMinor) return formatMinor(minMinor, currency, locale);
	return `${formatMinor(minMinor, currency, locale)} – ${formatMinor(maxMinor, currency, locale)}`;
}

export function toMinor(amount: number): number {
	return Math.round(amount * 100);
}
