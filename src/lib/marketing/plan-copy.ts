import type { Plan, PlanFeature } from '$lib/api/types';

/* What a plan's features are called in front of a shop owner.
 *
 * The API sends what it enforces — `orders_per_month`, a limit, a null for
 * unlimited. Turning that into a sentence is marketing's job and lives here,
 * so the wording can change without touching what is billed.
 *
 * The order is this list's order, not the API's: it runs from what a shop
 * owner counts first to what only some of them ask about. A key the API grows
 * later shows up nowhere until it is named here, which is deliberate — an
 * unnamed feature reaching the page would read as jargon.
 */
const count = new Intl.NumberFormat('en-IN');

type Phrase = (limit: number | null) => string;

const NAMED: Array<{ key: string; phrase: Phrase }> = [
	{
		key: 'products',
		phrase: (n) => (n === null ? 'Unlimited products' : `${count.format(n)} products`)
	},
	{
		key: 'orders_per_month',
		phrase: (n) => (n === null ? 'Unlimited orders' : `${count.format(n)} orders a month`)
	},
	{
		key: 'staff_seats',
		phrase: (n) => (n === null ? 'Unlimited staff accounts' : `${count.format(n)} staff accounts`)
	},
	{
		key: 'vendors',
		phrase: (n) => (n === null ? 'Unlimited sellers' : `${count.format(n)} sellers`)
	},
	{ key: 'custom_domain', phrase: () => 'Your own domain' },
	{ key: 'webhooks', phrase: () => 'Webhooks' },
	{ key: 'vendor_subscriptions', phrase: () => 'Charge your sellers a subscription' },
	{
		key: 'ai_credits',
		phrase: (n) => (n === null ? 'Unlimited AI credits' : `${count.format(n)} AI credits`)
	}
];

/* Only what a plan includes. A card listing everything it does not do is a
   list of reasons not to buy, and the tiers already read against each other. */
export function included(plan: Plan): string[] {
	const byKey = new Map(plan.features.map((f: PlanFeature) => [f.key, f]));

	return NAMED.flatMap(({ key, phrase }) => {
		const feature = byKey.get(key);
		if (!feature?.enabled) return [];
		return [phrase(feature.limit)];
	});
}

/* Yearly plans exist in the same table as monthly ones, so the page offers the
   choice only when there is one to make — rather than showing a discount that
   nothing in the product would honour. */
export function byInterval(plans: Plan[], interval: Plan['interval']): Plan[] {
	return plans.filter((p) => p.interval === interval);
}

/* A line about who each plan is for. Copy, not billing — but written from the
   limits the plan actually grants, so it cannot drift from what is enforced. */
const BLURB: Record<string, string> = {
	starter:
		'One shop finding its feet. A full catalogue, five hundred orders a month, two people on it.',
	growth: 'The working shop. Your own domain, ten staff, and webhooks when you outgrow the screen.',
	scale: 'No ceilings. Products, orders and staff unmetered, for a shop that stopped counting.'
};

export function blurb(plan: Plan): string {
	return BLURB[plan.code] ?? '';
}
