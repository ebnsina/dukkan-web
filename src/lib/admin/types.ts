import type { Variant } from '$lib/api/types';

export type IssueKind =
	| 'amount_mismatch'
	| 'unknown_consignment'
	| 'duplicate_remittance'
	| 'delivered_not_remitted'
	| 'remitted_but_returned'
	| 'missing_shipment';

export interface ReconciliationIssue {
	id: string;
	kind: IssueKind;
	severity: 'info' | 'warning' | 'critical';
	expected_minor: number | null;
	actual_minor: number | null;
	detail: string;
	created_at: string;
	resolved_at: string | null;
}

export interface AdminProduct {
	id: string;
	category_id: string | null;
	slug: string;
	title: string;
	title_bn: string | null;
	summary: string | null;
	description: string | null;
	status: 'draft' | 'active' | 'archived';
	price_min_minor: number | null;
	price_max_minor: number | null;
	has_variants: boolean;
	published_at: string | null;
	created_at: string;
	variants?: Variant[];
}

export interface Shipment {
	id: string;
	package_id: string;
	provider: string;
	consignment_id: string | null;
	tracking_code: string | null;
	cod_amount_minor: number;
	status: string;
	courier_status: string | null;
	delivered_at: string | null;
	settled_at: string | null;
}

export interface Coupon {
	id: string;
	code: string;
	kind: 'percent' | 'fixed';
	percent_bp: number | null;
	amount_minor: number | null;
	max_discount_minor: number | null;
	min_order_minor: number;
	starts_at: string | null;
	ends_at: string | null;
	max_redemptions: number | null;
	max_per_customer: number | null;
	redeemed_count: number;
	is_active: boolean;
	created_at: string;
}

/* Grouped by phone, not by account: most shoppers here check out as a guest
   every time, and to the shop they are plainly the same person. */
export interface AdminCustomer {
	user_id: string | null;
	name: string;
	phone: string;
	email: string | null;
	district: string;
	order_count: number;
	spent_minor: number;
	currency: string;
	first_order_at: string;
	last_order_at: string;
	/** Cancelled and returned. The number that says whether COD is safe here. */
	failed_count: number;
}

/* What one courier remittance file turned into. `declared` is what they say
   they sent, `matched` what our own records say is owed; the gap is the point. */
export interface SettlementImport {
	settlement_id: string;
	reference: string;
	line_count: number;
	matched_count: number;
	declared_minor: number;
	matched_minor: number;
	issue_count: number;
}

/* The SMS account is the shop's own, so the API seals the key and never sends
   it back — `configured` is the only honest thing it can say about one. */
export interface NotificationPrefs {
	sms_enabled: boolean;
	sms_sender_name: string;
	notify_placed: boolean;
	notify_shipped: boolean;
	notify_delivered: boolean;
	notify_cancelled: boolean;
	configured: boolean;
}

/* A record of money already given back elsewhere, not an instruction to give it
   back: the money never passed through Dukkàn. */
export interface Refund {
	id: string;
	order_id: string;
	amount_minor: number;
	currency: string;
	method: 'manual' | 'cash' | 'bkash' | 'nagad' | 'bank' | 'gateway';
	reference: string | null;
	reason: string;
	refunded_by: string | null;
	created_at: string;
}

/* One line of what the plan grants and where the shop stands against it.
   `limit: null` is unlimited, which reads differently from a large number. */
export interface UsageLine {
	feature:
		| 'products'
		| 'orders_per_month'
		| 'staff_seats'
		| 'vendors'
		| 'ai_credits'
		| 'custom_domain'
		| 'vendor_subscriptions'
		| 'webhooks';
	enabled: boolean;
	limit: number | null;
	used: number;
	/** Metered features reset monthly; counted ones free up when you delete. */
	metered: boolean;
	/** Only ever true where going over is allowed — see the orders allowance. */
	over: boolean;
}

export interface UsageReport {
	plan: string;
	usage: UsageLine[];
	period_start: string;
}

/* What the shop is signed up to, and what it has been billed. Nothing here
   charges a card: an operator marks a bill paid, because collecting from the
   first customers happens by bKash or bank transfer. */
export interface Subscription {
	id: string;
	plan_code: string;
	status: 'trialing' | 'active' | 'past_due' | 'cancelled';
	price_minor: number;
	currency: string;
	interval: 'monthly' | 'yearly';
	current_period_start: string;
	current_period_end: string;
	trial_ends_on: string | null;
}

export interface SubscriptionInvoice {
	id: string;
	number: string;
	period_start: string;
	period_end: string;
	plan_minor: number;
	/** Counted always; charged only if the plan carries an overage price. */
	overage_orders: number;
	overage_minor: number;
	total_minor: number;
	currency: string;
	status: 'open' | 'paid' | 'void';
	due_on: string;
	paid_at: string | null;
	paid_method: string | null;
	paid_reference: string | null;
}

export interface BillingReport {
	subscription: Subscription | null;
	invoices: SubscriptionInvoice[];
	shop_status: string;
}

/* Where a shop's storefront lives. Unverified until a TXT record proves the
   shop owns the name — until then it neither serves nor gets a certificate. */
export interface DomainStatus {
	domain: string;
	verified: boolean;
	claimed_at: string | null;
	verified_at: string | null;
	record_name?: string;
	record_type?: string;
	record_value?: string;
	claim_expires_at?: string;
}

export interface ShippingRate {
	id: string;
	zone_id: string;
	name: string;
	price_minor: number;
	free_above_minor: number | null;
	min_days: number | null;
	max_days: number | null;
	is_active: boolean;
}

/* A district belongs to exactly one zone, so the areas partition the country
   and the default zone catches whatever is left. */
export interface ShippingZone {
	id: string;
	name: string;
	is_default: boolean;
	districts: string[];
	rates: ShippingRate[];
}

export interface StaffMember {
	user_id: string;
	phone: string;
	name: string;
	role: 'owner' | 'admin' | 'staff';
	status: string;
	last_login_at: string | null;
	created_at: string;
}

/* A shop selling on somebody else's marketplace, as its owner reviews it.
   Only a marketplace ever has these; a single shop's one seller is created at
   provisioning and never surfaces. */
export interface AdminSeller {
	id: string;
	slug: string;
	name: string;
	tagline: string | null;
	description: string | null;
	phone: string;
	email: string | null;
	address: string | null;
	district: string | null;
	status: 'pending' | 'approved' | 'rejected' | 'suspended' | 'closed';
	rejection_reason?: string | null;
	approved_at: string | null;
	created_at: string;
	/* Their own agreed rate, in thousandths of a percent, and a flat fee taken
	   once per order. Null means they have no rate of their own and the shop
	   default answers — which is not the same as an agreed rate of zero. */
	commission_milli: number | null;
	commission_fixed_minor: number | null;
}

/* What a seller is owed, read from the ledger rather than summed over orders:
   the difference between the two is every payout already made. */
export interface VendorOwing {
	vendor_id: string;
	name: string;
	phone: string;
	owed_minor: number;
}

/* A record that a person sent money — Dukkàn never holds or moves any, so
   there is no pending state and nothing to reconcile. */
export interface PayoutRecord {
	id: string;
	vendor_id: string;
	vendor_name: string;
	amount_minor: number;
	method: 'bkash' | 'nagad' | 'bank' | 'cash' | 'other';
	reference: string | null;
	note: string | null;
	paid_on: string;
	created_at: string;
}

/* Somebody asking the shop a question. `open` is waiting on the shop and
   `answered` is waiting on the customer — the statuses are named for who is
   holding the ball, which is the only thing a queue needs to say. */
export interface TicketMessage {
	id: string;
	author: 'customer' | 'staff';
	body: string;
	created_at: string;
}

export interface Ticket {
	id: string;
	number: string;
	name: string;
	phone: string;
	email: string | null;
	order_id: string | null;
	order_number: string | null;
	subject: string;
	status: 'open' | 'answered' | 'closed';
	last_reply_at: string;
	created_at: string;
	messages?: TicketMessage[];
}

/* Reading a catalogue export before any of it is created. Previewing is a
   separate step because somebody handing over four hundred products deserves
   to see what we made of their file before it is theirs. */
export interface ImportNote {
	row: number;
	product: string;
	message: string;
}

export interface ImportPreview {
	source: 'shopify' | 'woocommerce' | 'generic';
	product_count: number;
	variant_count: number;
	skipped_rows: number;
	notes: ImportNote[] | null;
	sample: { title: string; variants: number; price_minor: number; status: string }[];
	category_names: string[] | null;
}

export interface ImportOutcome {
	created: number;
	skipped: number;
	categories_created: number;
	notes: ImportNote[];
}
