/* Representative data for the dashboard design study — the real API shapes,
   with plausible BDT amounts and Bangla names, so the three directions compare. */
import type { Dashboard, LowStockItem } from '$lib/api/types';
import type { ReconciliationIssue } from '$lib/admin/types';
import { formatMinor } from '$lib/utils/money';
import { formatNumber } from '$lib/utils/format';

export const shopName = 'রঙধনু হ্যান্ডিক্রাফট';

export const figures: Dashboard = {
	currency: 'BDT',
	orders_today: 37,
	orders_this_month: 842,
	sales_today_minor: 4732000,
	sales_month_minor: 118640000,
	awaiting_confirmation: 12,
	awaiting_dispatch: 26,
	in_transit: 118,
	outstanding_cod_minor: 34278000,
	outstanding_parcels: 96,
	open_issues: 9,
	critical_issues: 2,
	active_products: 214,
	out_of_stock: 3
};

/* Times are pre-rendered strings, not live deltas: a preview that recomputes
   "14 minutes ago" between server and client hydrates with a mismatch. */
export interface PreviewOrder {
	id: string;
	number: string;
	recipient: string;
	phone: string;
	district_name: string;
	currency: string;
	total_minor: number;
	payment_method: string;
	payment_state: string;
	status: string;
	ago: string;
	clock: string;
	items: number;
}

export const recent: PreviewOrder[] = [
	{
		id: 'o-24817',
		number: 'DKN-24817',
		recipient: 'রুমানা আক্তার',
		phone: '01711 452 908',
		district_name: 'Dhaka',
		currency: 'BDT',
		total_minor: 289000,
		payment_method: 'cod',
		payment_state: 'pending',
		status: 'shipped',
		ago: '14m',
		clock: '14:42',
		items: 2
	},
	{
		id: 'o-24816',
		number: 'DKN-24816',
		recipient: 'তানভীর হাসান',
		phone: '01812 330 174',
		district_name: 'Chattogram',
		currency: 'BDT',
		total_minor: 145000,
		payment_method: 'cod',
		payment_state: 'pending',
		status: 'placed',
		ago: '38m',
		clock: '14:18',
		items: 1
	},
	{
		id: 'o-24815',
		number: 'DKN-24815',
		recipient: 'সাদিয়া ইসলাম',
		phone: '01933 918 660',
		district_name: 'Sylhet',
		currency: 'BDT',
		total_minor: 675000,
		payment_method: 'sslcommerz',
		payment_state: 'paid',
		status: 'delivered',
		ago: '1h',
		clock: '13:55',
		items: 4
	},
	{
		id: 'o-24814',
		number: 'DKN-24814',
		recipient: 'মেহেদী হাসান',
		phone: '01610 277 431',
		district_name: 'Khulna',
		currency: 'BDT',
		total_minor: 98000,
		payment_method: 'cod',
		payment_state: 'pending',
		status: 'confirmed',
		ago: '2h',
		clock: '12:40',
		items: 1
	},
	{
		id: 'o-24813',
		number: 'DKN-24813',
		recipient: 'নুসরাত জাহান',
		phone: '01755 604 219',
		district_name: 'Rajshahi',
		currency: 'BDT',
		total_minor: 1235000,
		payment_method: 'cod',
		payment_state: 'pending',
		status: 'processing',
		ago: '3h',
		clock: '11:26',
		items: 6
	},
	{
		id: 'o-24812',
		number: 'DKN-24812',
		recipient: 'আরিফুল ইসলাম',
		phone: '01521 087 553',
		district_name: 'Dhaka',
		currency: 'BDT',
		total_minor: 320000,
		payment_method: 'cod',
		payment_state: 'refunded',
		status: 'returned',
		ago: '4h',
		clock: '10:12',
		items: 2
	},
	{
		id: 'o-24811',
		number: 'DKN-24811',
		recipient: 'ফারহানা রহমান',
		phone: '01998 441 026',
		district_name: 'Barishal',
		currency: 'BDT',
		total_minor: 54000,
		payment_method: 'cod',
		payment_state: 'pending',
		status: 'packed',
		ago: '5h',
		clock: '09:47',
		items: 1
	},
	{
		id: 'o-24810',
		number: 'DKN-24810',
		recipient: 'শাহরিয়ার কবির',
		phone: '01677 235 890',
		district_name: 'Rangpur',
		currency: 'BDT',
		total_minor: 187500,
		payment_method: 'sslcommerz',
		payment_state: 'paid',
		status: 'in_transit',
		ago: '6h',
		clock: '08:31',
		items: 3
	}
];

export const issues: ReconciliationIssue[] = [
	{
		id: 'i-1',
		kind: 'delivered_not_remitted',
		severity: 'critical',
		expected_minor: 6845000,
		actual_minor: null,
		detail: '12 parcels delivered by Pathao nine days ago, nothing remitted yet',
		created_at: '2026-07-24T09:12:00Z',
		resolved_at: null
	},
	{
		id: 'i-2',
		kind: 'amount_mismatch',
		severity: 'critical',
		expected_minor: 1235000,
		actual_minor: 985000,
		detail: 'Steadfast remitted less than the COD collected on CN-88410',
		created_at: '2026-07-30T06:40:00Z',
		resolved_at: null
	},
	{
		id: 'i-3',
		kind: 'amount_mismatch',
		severity: 'warning',
		expected_minor: 289000,
		actual_minor: 264000,
		detail: 'RedX statement short against CN-77219',
		created_at: '2026-08-01T11:05:00Z',
		resolved_at: null
	},
	{
		id: 'i-4',
		kind: 'unknown_consignment',
		severity: 'warning',
		expected_minor: null,
		actual_minor: 412000,
		detail: 'Remittance references CN-90455, which matches no shipment of yours',
		created_at: '2026-08-01T15:22:00Z',
		resolved_at: null
	},
	{
		id: 'i-5',
		kind: 'duplicate_remittance',
		severity: 'info',
		expected_minor: null,
		actual_minor: 78000,
		detail: 'CN-71002 appears twice in the 12 July statement',
		created_at: '2026-08-02T08:00:00Z',
		resolved_at: null
	}
];

export const low: LowStockItem[] = [
	{
		product_id: 'p-1',
		variant_id: 'v-1',
		title: 'ঢাকাই জামদানি শাড়ি',
		variant_title: 'লাল',
		sku: 'JMD-RED-01',
		available: 0,
		threshold: 5
	},
	{
		product_id: 'p-2',
		variant_id: 'v-2',
		title: 'খাঁটি সরিষার তেল',
		variant_title: '১ লিটার',
		sku: 'OIL-MUS-1L',
		available: 2,
		threshold: 6
	},
	{
		product_id: 'p-3',
		variant_id: 'v-3',
		title: 'নকশি কাঁথা বেডকভার',
		variant_title: 'কিং',
		sku: 'NKS-BED-K',
		available: 3,
		threshold: 8
	},
	{
		product_id: 'p-4',
		variant_id: 'v-4',
		title: 'সুন্দরবনের মধু',
		variant_title: '৫০০ গ্রাম',
		sku: 'HNY-SUN-500',
		available: 4,
		threshold: 10
	},
	{
		product_id: 'p-5',
		variant_id: 'v-5',
		title: 'হাতে তৈরি মাটির চায়ের কাপ',
		variant_title: '৬ পিস',
		sku: 'CLY-CUP-6',
		available: 6,
		threshold: 12
	}
];

/* Fourteen days of sales in minor units, oldest first — enough for a sparkline. */
export const salesTrend = [
	3120000, 2860000, 4410000, 3980000, 3050000, 5240000, 6110000, 4870000, 3620000, 4180000, 5590000,
	4020000, 3740000, 4732000
];

/* Fourteen days of COD still outstanding — the line that should worry someone. */
export const codTrend = [
	21400000, 22800000, 24100000, 23600000, 25900000, 27300000, 28800000, 28100000, 29700000,
	31200000, 30400000, 32600000, 33500000, 34278000
];

export const money = (minor: number, currency = 'BDT') => formatMinor(minor, currency);

/* Whole taka, for figures big enough that two decimal places are noise. */
export const moneyRound = (minor: number, currency = 'BDT') =>
	formatMinor(minor, currency, 'en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

export const count = (value: number) => formatNumber(value);

/* An issue's number is the gap when both sides are known, the one side otherwise. */
export function issueAmount(issue: ReconciliationIssue): number {
	if (issue.expected_minor !== null && issue.actual_minor !== null) {
		return Math.abs(issue.expected_minor - issue.actual_minor);
	}
	return issue.expected_minor ?? issue.actual_minor ?? 0;
}

const KIND_WORDS: Record<string, string> = {
	amount_mismatch: 'Short paid',
	unknown_consignment: 'Unknown CN',
	duplicate_remittance: 'Duplicate',
	delivered_not_remitted: 'Not remitted',
	remitted_but_returned: 'Returned, paid',
	missing_shipment: 'No shipment'
};

export const issueKindWord = (kind: string) => KIND_WORDS[kind] ?? kind;
