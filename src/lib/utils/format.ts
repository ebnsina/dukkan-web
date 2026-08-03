/*
 * `en-IN`, not `en-BD`, for the same reason `money.ts` says so: Bangladesh
 * groups digits South Asian style and ICU's `en-BD` has no such grouping — it
 * prints 100,000 where a shop owner expects 1,00,000. This is the default for
 * counts as well as amounts, since an order count passes a lakh eventually.
 */
export const DEFAULT_LOCALE = 'en-IN';
export const DEFAULT_CURRENCY = 'BDT';

export function formatCurrency(
	amount: number,
	currency: string = DEFAULT_CURRENCY,
	locale: string = DEFAULT_LOCALE,
	options: Intl.NumberFormatOptions = {}
): string {
	return new Intl.NumberFormat(locale, {
		style: 'currency',
		currency,
		currencyDisplay: 'narrowSymbol',
		...options
	}).format(amount);
}

export function formatNumber(
	value: number,
	locale: string = DEFAULT_LOCALE,
	options: Intl.NumberFormatOptions = {}
): string {
	return new Intl.NumberFormat(locale, options).format(value);
}

export function formatCompact(value: number, locale: string = DEFAULT_LOCALE): string {
	return new Intl.NumberFormat(locale, { notation: 'compact', maximumFractionDigits: 1 }).format(
		value
	);
}

export function formatPercent(
	fraction: number,
	locale: string = DEFAULT_LOCALE,
	options: Intl.NumberFormatOptions = {}
): string {
	return new Intl.NumberFormat(locale, {
		style: 'percent',
		maximumFractionDigits: 1,
		...options
	}).format(fraction);
}

export function formatDate(
	value: Date | string | number,
	locale: string = DEFAULT_LOCALE,
	options: Intl.DateTimeFormatOptions = { dateStyle: 'medium' }
): string {
	return new Intl.DateTimeFormat(locale, options).format(new Date(value));
}

export function formatDateTime(
	value: Date | string | number,
	locale: string = DEFAULT_LOCALE
): string {
	return new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(
		new Date(value)
	);
}

const RELATIVE_UNITS: Array<[Intl.RelativeTimeFormatUnit, number]> = [
	['year', 31_536_000_000],
	['month', 2_592_000_000],
	['week', 604_800_000],
	['day', 86_400_000],
	['hour', 3_600_000],
	['minute', 60_000],
	['second', 1000]
];

export function formatRelativeTime(
	value: Date | string | number,
	locale: string = DEFAULT_LOCALE,
	now: Date = new Date()
): string {
	const formatter = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
	const delta = new Date(value).getTime() - now.getTime();
	for (const [unit, ms] of RELATIVE_UNITS) {
		if (Math.abs(delta) >= ms || unit === 'second') {
			return formatter.format(Math.round(delta / ms), unit);
		}
	}
	return formatter.format(0, 'second');
}

export function formatList(
	items: readonly string[],
	locale: string = DEFAULT_LOCALE,
	options: Intl.ListFormatOptions = { style: 'long', type: 'conjunction' }
): string {
	return new Intl.ListFormat(locale, options).format(items);
}
