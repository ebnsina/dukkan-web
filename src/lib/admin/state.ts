import {
	Alert02Icon,
	Archive02Icon,
	ArrowTurnBackwardIcon,
	Cancel01Icon,
	CheckmarkCircle02Icon,
	Clock01Icon,
	CreditCardIcon,
	DeliveryTruck01Icon,
	PackageDeliveredIcon,
	PackageIcon,
	PackageRemoveIcon,
	PencilEdit02Icon
} from '@hugeicons/core-free-icons';
import type { IconSvgElement } from '@hugeicons/svelte';

export type Tone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info';

export interface State {
	word: string;
	tone: Tone;
	/** A glyph so the badge is not read by colour alone. */
	icon: IconSvgElement;
}

/* One vocabulary per column, so a colour always means the same thing: green is
   finished, amber needs a person, red is money or stock at risk. */
const ORDER: Record<string, State> = {
	placed: { word: 'Placed', tone: 'info', icon: Clock01Icon },
	confirmed: { word: 'Confirmed', tone: 'info', icon: CheckmarkCircle02Icon },
	processing: { word: 'Packing', tone: 'warning', icon: PackageIcon },
	packed: { word: 'Packed', tone: 'warning', icon: PackageIcon },
	shipped: { word: 'On its way', tone: 'accent', icon: DeliveryTruck01Icon },
	in_transit: { word: 'On its way', tone: 'accent', icon: DeliveryTruck01Icon },
	booked: { word: 'Booked', tone: 'accent', icon: DeliveryTruck01Icon },
	delivered: { word: 'Delivered', tone: 'success', icon: PackageDeliveredIcon },
	partially_delivered: { word: 'Part delivered', tone: 'warning', icon: PackageIcon },
	cancelled: { word: 'Cancelled', tone: 'neutral', icon: Cancel01Icon },
	returned: { word: 'Returned', tone: 'danger', icon: PackageRemoveIcon },
	pending: { word: 'Waiting', tone: 'warning', icon: Clock01Icon }
};

const PAYMENT: Record<string, State> = {
	pending: { word: 'Unpaid', tone: 'warning', icon: Clock01Icon },
	authorized: { word: 'Authorised', tone: 'info', icon: CreditCardIcon },
	paid: { word: 'Paid', tone: 'success', icon: CheckmarkCircle02Icon },
	failed: { word: 'Failed', tone: 'danger', icon: Alert02Icon },
	refunded: { word: 'Refunded', tone: 'neutral', icon: ArrowTurnBackwardIcon },
	partially_refunded: { word: 'Part refunded', tone: 'neutral', icon: ArrowTurnBackwardIcon }
};

const SEVERITY: Record<string, Tone> = {
	critical: 'danger',
	warning: 'warning',
	info: 'info'
};

const PRODUCT: Record<string, State> = {
	active: { word: 'On sale', tone: 'success', icon: CheckmarkCircle02Icon },
	draft: { word: 'Not published', tone: 'neutral', icon: PencilEdit02Icon },
	archived: { word: 'Put away', tone: 'neutral', icon: Archive02Icon }
};

const UNKNOWN = (word: string): State => ({ word, tone: 'neutral', icon: Clock01Icon });

export function orderState(status: string): State {
	return ORDER[status] ?? UNKNOWN(status);
}

export function paymentState(state: string): State {
	return PAYMENT[state] ?? UNKNOWN(state);
}

export function severityTone(severity: string): Tone {
	return SEVERITY[severity] ?? 'info';
}

export function productState(status: string): State {
	return PRODUCT[status] ?? UNKNOWN(status);
}

/* Stock is a number, not a vocabulary: nothing left is urgent, nearly nothing
   needs an order placed, the rest is fine and stays quiet. */
export function stockTone(available: number, threshold: number): Tone {
	if (available <= 0) return 'danger';
	if (available <= threshold) return 'warning';
	return 'neutral';
}
