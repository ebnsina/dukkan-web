import type { UsageLine } from '$lib/admin/types';

/* One shop as the operator sees it. The counts are the first thing worth
   knowing about a shop and the thing psql was being opened for. */
export interface PlatformShop {
	id: string;
	slug: string;
	name: string;
	status: 'trialing' | 'active' | 'past_due' | 'suspended' | 'cancelled';
	shop_mode: 'single' | 'marketplace';
	plan_code: string;
	plan_name: string;
	custom_domain: string | null;
	created_at: string;
	products: number;
	orders_total: number;
	orders_this_month: number;
	revenue_minor: number;
	last_order_at: string | null;
}

/* An entitlement set over the plan rather than into it, so the plans table
   stays the price list. `limit: null` is unlimited; removing it entirely is a
   different act from setting it to null. */
export interface Override {
	feature: string;
	enabled: boolean;
	limit: number | null;
}

export interface PlatformShopDetail {
	shop: PlatformShop;
	usage: UsageLine[];
	overrides: Override[] | null;
}

export interface PlatformPlan {
	code: string;
	name: string;
	price_minor: number;
	currency: string;
	interval: 'monthly' | 'yearly';
	is_public: boolean;
	shops: number;
}

export interface PlatformInvoice {
	id: string;
	tenant_id: string;
	number: string;
	period_start: string;
	period_end: string;
	plan_minor: number;
	overage_orders: number;
	overage_minor: number;
	total_minor: number;
	currency: string;
	status: 'open' | 'paid' | 'void';
	due_on: string;
	paid_at: string | null;
	paid_method: string | null;
	paid_reference: string | null;
	shop_slug: string;
	shop_name: string;
}
