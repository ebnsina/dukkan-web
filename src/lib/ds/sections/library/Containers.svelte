<script lang="ts">
	import { Avatar, Button, Divider, Empty, Frame, Stat, Status } from '$lib/ui';
</script>

<section id="containers" class="group">
	<h2>Containers</h2>
	<p class="note">
		<code>Frame</code> is the one bordered box: a tinted shell carrying the header, and the content
		on paper inset by a 3px rail. Nothing else draws its own card.
	</p>
	<div class="cases">
		<div class="case">
			<span class="case-label">Frame · rows</span>
			<Frame
				eyebrow="Today"
				title="Recent orders"
				action="View all"
				actionHref="#top"
				variant="rows"
			>
				<a class="line" href="#top">
					<Avatar name="Karim Hossain" size="sm" />
					<span class="line-main">
						<span class="line-title">Karim</span>
						<span class="line-meta">DK-1005 · Dhaka</span>
					</span>
					<span class="line-amt">৳6,100.00</span>
					<Status status="placed" />
				</a>
				<a class="line" href="#top">
					<Avatar name="Rahim Uddin" size="sm" />
					<span class="line-main">
						<span class="line-title">Rahim Uddin</span>
						<span class="line-meta">DK-1004 · Barguna</span>
					</span>
					<span class="line-amt">৳4,500.00</span>
					<Status status="delivered" />
				</a>
			</Frame>
		</div>

		<div class="case">
			<span class="case-label">Frame · pad, with a footer</span>
			<Frame eyebrow="Payouts" title="Next payment" variant="pad" tag="Thursday">
				<p class="prose">
					৳18,240.00 clears on Thursday, once the two parcels still with a rider are settled.
				</p>
				{#snippet footer()}
					<span>Paid into City Bank ····4821</span>
				{/snippet}
			</Frame>
		</div>

		<div class="case">
			<span class="case-label">Stat</span>
			<div class="stats">
				<Stat label="Orders today" value="37" sub="842 this month" href="#top" />
				<Stat label="To send" value="26" sub="ready for a courier" tone="warning" />
			</div>
		</div>

		<div class="case">
			<span class="case-label">Empty and Divider</span>
			<div class="stack">
				<Frame eyebrow="Empty" title="Nothing here" variant="flush">
					<Empty title="No orders yet" description="They appear the moment one comes in.">
						{#snippet actions()}
							<Button size="sm" variant="quiet">Share your shop</Button>
						{/snippet}
					</Empty>
				</Frame>
				<Divider label="Or" />
			</div>
		</div>
	</div>
</section>

<style>
	.stats {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 10px;
	}

	.line {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 9px 10px;
		border-radius: var(--r-control);
		color: inherit;
		text-decoration: none;
	}

	.line:hover {
		background: var(--surface);
	}

	.line-main {
		flex: 1;
		min-width: 0;
	}

	.line-title {
		display: block;
		font-size: 13.5px;
		font-weight: 600;
	}

	.line-meta {
		display: block;
		font-size: 12px;
		color: var(--faint);
	}

	.line-amt {
		font-size: 12.5px;
		font-weight: 650;
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
	}
</style>
