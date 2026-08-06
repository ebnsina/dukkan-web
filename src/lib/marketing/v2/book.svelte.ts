/* The one day the whole page is arguing about.
 *
 * Thirty-four orders go out, the courier hands back less than they were worth,
 * and the difference has an explanation. The figures are illustrative — one
 * worked example, labelled as one — but they are arithmetic, not decoration:
 * returns, delivery charges and a short payment account for the gap exactly,
 * and the page's closing line is only true because they do.
 */

export const DAY = {
	orders: 34,
	collect: 41_200,
	remitted: 38_600,
	returns: 1_850,
	delivery: 700,
	short: 50
} as const;

export const GAP = DAY.collect - DAY.remitted;
export const EXPLAINED = DAY.returns + DAY.delivery + DAY.short;

/* Four of the day's orders, named, so the entry that explains the gap can
   point at the same order the entry that showed it did. */
export const ORDERS = [
	{ no: '1042', district: 'Cumilla', cod: 1_240 },
	{ no: '1043', district: 'Rangpur', cod: 2_900 },
	{ no: '1044', district: 'Dhanmondi', cod: 780 },
	{ no: '1045', district: 'Sylhet', cod: 1_070 }
] as const;

const SHOWN = ORDERS.reduce((sum, order) => sum + order.cod, 0);
export const REST = { orders: DAY.orders - ORDERS.length, cod: DAY.collect - SHOWN };

/* Stages the rail passes through as the page is read: the orders, the gap the
 * courier's remittance leaves, and the gap accounted for.
 */
export const PLACED = 0;
export const SHORT = 1;
export const SETTLED = 2;

class Book {
	stage = $state(PLACED);

	/* Forward only. A ledger is written once, and a rail that unsettles itself
	   when you scroll back up is a fidget rather than a record. */
	reach(stage: number) {
		if (stage > this.stage) this.stage = stage;
	}
}

export const book = new Book();
