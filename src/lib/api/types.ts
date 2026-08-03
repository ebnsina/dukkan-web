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

/* ─ Theme ─ what a shop wears. The storefront paints itself from these. */

export type ThemeLayout = 'grid-dense' | 'grid-roomy' | 'editorial' | 'list';

export interface ThemeTokens {
	accent: string;
	'accent-ink': string;
	surface: string;
	density: string;
}

export interface AppliedTheme {
	theme_code: string;
	theme_name: string;
	layout: ThemeLayout;
	preset_code: string;
	preset_name: string;
	tokens: ThemeTokens;
}

export interface ThemePreset {
	code: string;
	name: string;
	tokens: ThemeTokens;
	is_default: boolean;
}

export interface ThemeSummary {
	code: string;
	name: string;
	description: string;
	industries: string[];
	layout: ThemeLayout;
	presets: ThemePreset[];
}

/* ─ Signup ─ the tenant-less surface where a shop is created. */

export interface Industry {
	code: string;
	theme_count: number;
}

export interface Availability {
	slug: string;
	available: boolean;
	reason?: string;
}

export interface SignupResult {
	slug: string;
	storefront: string;
	theme_code: string;
	preset_code: string;
}

/* ─ Admin ─ */

export interface Dashboard {
	currency: string;
	orders_today: number;
	orders_this_month: number;
	sales_today_minor: number;
	sales_month_minor: number;
	awaiting_confirmation: number;
	awaiting_dispatch: number;
	in_transit: number;
	outstanding_cod_minor: number;
	outstanding_parcels: number;
	open_issues: number;
	critical_issues: number;
	active_products: number;
	out_of_stock: number;
}

export interface Customer {
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
	failed_count: number;
}

export interface LowStockItem {
	product_id: string;
	title: string;
	variant_id: string;
	sku: string | null;
	variant_title: string | null;
	available: number;
	threshold: number;
}

export interface NotificationPrefs {
	sms_enabled: boolean;
	sms_sender_name: string;
	notify_placed: boolean;
	notify_shipped: boolean;
	notify_delivered: boolean;
	notify_cancelled: boolean;
	configured: boolean;
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

export interface ShippingZone {
	id: string;
	name: string;
	is_default: boolean;
	districts: string[];
	rates: ShippingRate[] | null;
}

export interface ConfiguredProvider {
	provider: string;
	enabled: boolean;
	sandbox: boolean;
	configured: boolean;
	hint?: string;
}

export interface ShopSettings {
	name: string;
	slug: string;
	shop_mode: string;
	country: string;
	currency: string;
	timezone: string;
	locale: string;
}

export interface SettingsOverview {
	payment: ConfiguredProvider[];
	courier: ConfiguredProvider[];
	shop: ShopSettings;
}
