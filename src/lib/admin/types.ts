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
