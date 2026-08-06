/* What a seller sees. Deliberately narrow: a seller's unit of work is their own
   package, and none of these shapes has a field for the order total, another
   seller's lines, or what the shop kept from anybody else. */

export interface SellerShop {
	id: string;
	slug: string;
	name: string;
	tagline: string | null;
	status: string;
}

export interface SellerLine {
	title: string;
	variant_title: string | null;
	unit_price_minor: number;
	quantity: number;
	line_total_minor: number;
	commission_minor: number;
}

export interface SellerOrder {
	id: string;
	order_id: string;
	order_number: string;
	placed_at: string;
	status: string;
	currency: string;
	recipient: string;
	district_name: string;
	item_count: number;
	subtotal_minor: number;
	commission_minor: number;
	payable_minor: number;
	payment_method: string;
	payment_state: string;
}

export interface SellerOrderDetail extends SellerOrder {
	phone: string;
	thana: string;
	area: string | null;
	street: string;
	postcode: string | null;
	note: string | null;
	lines: SellerLine[];
	shipments: {
		provider: string;
		tracking_code: string | null;
		status: string;
		delivered_at: string | null;
	}[];
}

/* What a seller is waiting on. Not a ledger and not a balance: no payout has
   ever been recorded, so nothing here is ever marked paid. */
export interface SellerOwed {
	currency: string;
	open_packages: number;
	open_minor: number;
	delivered_minor: number;
	commission_minor: number;
}
