export interface StoreContext {
	name: string;
	slug: string;
	country: string;
	currency: string;
	timezone: string;
	locale: string;
}

export interface Category {
	id: string;
	parent_id: string | null;
	slug: string;
	name: string;
	name_bn: string | null;
	position: number;
	is_active: boolean;
}

export interface Seller {
	id: string;
	slug: string;
	name: string;
}

/* One upload, three renditions. Sending the large one into a 60px slot costs a
   shopper on mobile data real money, so the size is always chosen by context. */
export interface ProductImage {
	id: string;
	width: number;
	height: number;
	alt_text: string | null;
	urls: { thumb: string; medium: string; large: string };
	byte_size?: number;
}

export interface ProductListing {
	id: string;
	slug: string;
	title: string;
	title_bn: string | null;
	summary: string | null;
	price_min_minor: number | null;
	price_max_minor: number | null;
	has_variants: boolean;
	in_stock: boolean;
	category?: Category;
	seller?: Seller;
	images?: ProductImage[] | null;
}

export interface VariantStock {
	on_hand: number;
	reserved: number;
	track: boolean;
	allow_backorder: boolean;
}

export interface Variant {
	id: string;
	sku: string | null;
	title: string | null;
	price_minor: number;
	compare_at_minor: number | null;
	weight_grams: number | null;
	position: number;
	is_default: boolean;
	options?: Record<string, string>;
	stock: VariantStock;
}

export interface ProductDetail extends ProductListing {
	description: string | null;
	variants: Variant[];
}

export interface ProductPage {
	products: ProductListing[];
	total: number;
	limit: number;
	offset: number;
}

export interface District {
	code: string;
	name: string;
	name_bn: string;
	division: string;
}

export interface CartLine {
	variant_id: string;
	product_id: string;
	product_slug: string;
	title: string;
	variant_title: string | null;
	options?: Record<string, string>;
	unit_price_minor: number;
	quantity: number;
	line_total_minor: number;
	available: number;
	in_stock: boolean;
}

export interface Cart {
	token: string;
	currency: string;
	subtotal_minor: number;
	item_count: number;
	lines: CartLine[];
}

export interface OrderLine {
	title: string;
	variant_title: string | null;
	options?: Record<string, string>;
	unit_price_minor: number;
	quantity: number;
	line_total_minor: number;
}

export interface OrderPackage {
	id: string;
	subtotal_minor: number;
	shipping_minor: number;
	status: string;
	lines: OrderLine[];
}

export interface OrderSummary {
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
	placed_at: string;
}

export interface OrderEvent {
	kind: string;
	message: string | null;
	actor_type: string;
	created_at: string;
}

export interface Shipment {
	provider: string;
	tracking_code: string | null;
	status: string;
	delivered_at: string | null;
}

export interface OrderDetail extends OrderSummary {
	subtotal_minor: number;
	shipping_minor: number;
	discount_minor: number;
	email: string | null;
	thana: string;
	area: string | null;
	street: string;
	postcode: string | null;
	note: string | null;
	packages: OrderPackage[];
	events: OrderEvent[];
	shipments: Shipment[];
}

export interface PlacedOrder extends OrderDetail {
	redirect_url?: string;
}

export interface PaymentMethod {
	provider: 'cod' | 'sslcommerz';
	display_name: string;
	is_sandbox?: boolean;
}

export interface Tokens {
	access_token: string;
	refresh_token: string;
	expires_at: string;
}

export interface CheckoutBody {
	recipient: string;
	phone: string;
	email: string;
	district_code: string;
	thana: string;
	area: string;
	street: string;
	postcode: string;
	payment_method: string;
	note: string;
}
