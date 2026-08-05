<script lang="ts">
	import { Breadcrumb, Button, PageHeader, Pagination, Tabs } from '$lib/ui';

	let tab = $state('orders');
	let page = $state(3);
</script>

<section id="navigation" class="group">
	<h2>Navigation</h2>
	<div class="cases">
		<div class="case is-wide">
			<span class="case-label">PageHeader and Breadcrumb</span>
			<div class="stack">
				<Breadcrumb
					items={[
						{ label: 'Admin', href: '#top' },
						{ label: 'Orders', href: '#top' },
						{ label: 'DK-1005' }
					]}
				/>
				<PageHeader eyebrow="Orders" title="DK-1005" standfirst="Placed by Karim, going to Dhaka.">
					{#snippet actions()}
						<Button size="sm" variant="quiet">Print label</Button>
						<Button size="sm">Book a courier</Button>
					{/snippet}
				</PageHeader>
			</div>
		</div>

		<div class="case is-wide">
			<span class="case-label">Tabs</span>
			<Tabs
				bind:value={tab}
				items={[
					{ value: 'orders', label: 'Orders' },
					{ value: 'products', label: 'Products' },
					{ value: 'payouts', label: 'Payouts' },
					{ value: 'staff', label: 'Staff', disabled: true }
				]}
			>
				{#snippet panel(value)}
					<p class="panel-note">The {value} panel.</p>
				{/snippet}
			</Tabs>
		</div>

		<div class="case is-wide">
			<span class="case-label">Pagination</span>
			<Pagination bind:page pageCount={12} />
		</div>
	</div>
</section>

<style>
	.panel-note {
		margin: 0;
		font-size: 14px;
		color: var(--muted);
	}
</style>
