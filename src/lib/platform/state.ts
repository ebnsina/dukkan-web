import type { Tone } from '$lib/ui/tone';
import type { PlatformShop } from './types';

/* The same four-colour rule the shop admin follows: green is finished, blue is
   still moving, amber needs a person, red is money or stock at risk.
 *
 * `past_due` is amber, not red. A shop behind on payment is still open and
 * still selling — that is the design, and colouring it as a failure would
 * invite somebody to treat it like one. */
export const SHOP_STATE: Record<PlatformShop['status'], { word: string; tone: Tone }> = {
	trialing: { word: 'Trialing', tone: 'info' },
	active: { word: 'Active', tone: 'success' },
	past_due: { word: 'Behind', tone: 'warning' },
	suspended: { word: 'Suspended', tone: 'danger' },
	cancelled: { word: 'Cancelled', tone: 'neutral' }
};

export const INVOICE_STATE: Record<string, { word: string; tone: Tone }> = {
	open: { word: 'Unpaid', tone: 'warning' },
	paid: { word: 'Paid', tone: 'success' },
	void: { word: 'Written off', tone: 'neutral' }
};
