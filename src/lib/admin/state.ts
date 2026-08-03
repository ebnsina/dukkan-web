export type Tone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info';

/* One vocabulary per column, so a colour always means the same thing: green is
   finished, amber needs a person, red is money or stock at risk. */
const ORDER: Record<string, { word: string; tone: Tone }> = {
	placed: { word: 'Placed', tone: 'info' },
	confirmed: { word: 'Confirmed', tone: 'info' },
	processing: { word: 'Packing', tone: 'warning' },
	packed: { word: 'Packed', tone: 'warning' },
	shipped: { word: 'On its way', tone: 'accent' },
	in_transit: { word: 'On its way', tone: 'accent' },
	booked: { word: 'Booked', tone: 'accent' },
	delivered: { word: 'Delivered', tone: 'success' },
	partially_delivered: { word: 'Part delivered', tone: 'warning' },
	cancelled: { word: 'Cancelled', tone: 'neutral' },
	returned: { word: 'Returned', tone: 'danger' },
	pending: { word: 'Waiting', tone: 'warning' }
};

const PAYMENT: Record<string, { word: string; tone: Tone }> = {
	pending: { word: 'Unpaid', tone: 'warning' },
	authorized: { word: 'Authorised', tone: 'info' },
	paid: { word: 'Paid', tone: 'success' },
	failed: { word: 'Failed', tone: 'danger' },
	refunded: { word: 'Refunded', tone: 'neutral' },
	partially_refunded: { word: 'Part refunded', tone: 'neutral' }
};

const SEVERITY: Record<string, Tone> = {
	critical: 'danger',
	warning: 'warning',
	info: 'info'
};

const PRODUCT: Record<string, { word: string; tone: Tone }> = {
	active: { word: 'Live', tone: 'success' },
	draft: { word: 'Draft', tone: 'neutral' },
	archived: { word: 'Archived', tone: 'neutral' }
};

export function orderState(status: string) {
	return ORDER[status] ?? { word: status, tone: 'neutral' as Tone };
}

export function paymentState(state: string) {
	return PAYMENT[state] ?? { word: state, tone: 'neutral' as Tone };
}

export function severityTone(severity: string): Tone {
	return SEVERITY[severity] ?? 'info';
}

export function productState(status: string) {
	return PRODUCT[status] ?? { word: status, tone: 'neutral' as Tone };
}

/* Stock is a number, not a vocabulary: nothing left is urgent, nearly nothing
   needs an order placed, the rest is fine and stays quiet. */
export function stockTone(available: number, threshold: number): Tone {
	if (available <= 0) return 'danger';
	if (available <= threshold) return 'warning';
	return 'neutral';
}
