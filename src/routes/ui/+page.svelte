<script lang="ts">
	/* The component library.
	 *
	 * Every component is shown on all three surfaces at once, because that is
	 * the claim being made: one component, and the surface it sits in decides
	 * the colours. If a component looks wrong in one column, the bug is in the
	 * token binding for that surface, not in the component. */
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { CheckmarkCircle02Icon, PlusSignIcon } from '@hugeicons/core-free-icons';
	import Seo from '$lib/seo/Seo.svelte';
	import {
		Banner,
		Button,
		Chip,
		Confirm,
		Empty,
		Field,
		Frame,
		Input,
		Stat,
		Status,
		Toggle
	} from '$lib/ui';

	const surfaces = [
		{ key: 'shop-surface', name: 'Storefront', note: 'Wears the shop’s own theme' },
		{ key: 'dk-app is-inline', name: 'Admin', note: 'Dukkan’s tool, light and dark' },
		{ key: 'mk-surface', name: 'Marketing', note: 'Pinned light' }
	];

	let toggled = $state(true);
	let open = $state(false);
</script>

<Seo title="Components" description="The Dukkan component library." noindex />

<div class="page">
	<header class="masthead">
		<span class="eyebrow">Library</span>
		<h1>One set of components, three surfaces.</h1>
		<p class="dek">
			Nothing here is forked per surface. A component reads the standard token names —
			<code>--paper</code>, <code>--ink</code>, <code>--accent</code> — and each surface rebinds
			those to its own values. Where one place needs something different it passes
			<code>class</code> at the call site, which every component merges last.
		</p>
	</header>

	{#snippet kit()}
		<div class="kit">
			<div class="row">
				<Button size="sm" icon={PlusSignIcon}>Add</Button>
				<Button variant="quiet" size="sm">Quiet</Button>
				<Button variant="ghost" size="sm">Ghost</Button>
				<Button variant="danger" size="sm">Danger</Button>
			</div>

			<div class="row">
				<Chip label="Neutral" />
				<Status status="delivered" />
				<Status status="pending" kind="payment" />
				<Status status="returned" />
			</div>

			<div class="stats">
				<Stat label="Orders today" value="37" sub="842 this month" />
				<Stat label="To send" value="26" sub="ready for a courier" tone="warning" />
			</div>

			<Frame
				eyebrow="Today"
				title="Recent orders"
				action="View all"
				actionHref="#top"
				variant="rows"
			>
				<a class="line" href="#top">
					<span class="line-main">
						<span class="line-title">Karim</span>
						<span class="line-meta">DK-1005 · Dhaka</span>
					</span>
					<span class="line-amt">৳6,100.00</span>
					<Status status="placed" />
				</a>
				<a class="line" href="#top">
					<span class="line-main">
						<span class="line-title">Rahim Uddin</span>
						<span class="line-meta">DK-1004 · Barguna</span>
					</span>
					<span class="line-amt">৳4,500.00</span>
					<Status status="delivered" />
				</a>
			</Frame>

			<Frame eyebrow="Empty" title="Nothing here" variant="flush">
				<Empty title="No orders yet" description="They appear the moment one comes in." />
			</Frame>

			<Banner title="Money is missing" tone="danger">
				Two parcels need chasing with a courier.
			</Banner>
			<Banner title="Saved" tone="success">Your payment details are in.</Banner>

			<Field label="Mobile number" required hint="We text a code to this number.">
				{#snippet control(props)}
					<Input {...props} name="phone" placeholder="01712345678" />
				{/snippet}
			</Field>

			<Field label="Store ID" error="We could not read that.">
				{#snippet control(props)}
					<Input {...props} name="store" value="bad-value" />
				{/snippet}
			</Field>

			<Toggle bind:checked={toggled} label="Take cash on delivery" description="Most orders." />
			<Toggle checked={false} disabled label="Turned off" />
		</div>
	{/snippet}

	<div class="grid">
		{#each surfaces as surface (surface.key)}
			<section class="col">
				<header class="colhead">
					<h2>{surface.name}</h2>
					<span class="note">{surface.note}</span>
				</header>
				<div class={surface.key}>
					<div class="stage">{@render kit()}</div>
				</div>
			</section>
		{/each}
	</div>

	<section class="single">
		<h2>Confirm</h2>
		<p class="dek">
			A modal renders in the top layer, outside every surface wrapper, so it reads the ramp
			directly.
		</p>
		<Button variant="quiet" onclick={() => (open = true)}>Open it</Button>
		<Confirm bind:open title="Cancel DK-1005?" description="The customer will be told.">
			{#snippet footer()}
				<Button variant="quiet" size="sm" onclick={() => (open = false)}>Keep it</Button>
				<Button variant="danger" size="sm" onclick={() => (open = false)}>Cancel the order</Button>
			{/snippet}
		</Confirm>
	</section>

	<footer class="rule-note">
		<HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} strokeWidth={1.8} />
		Values live in <code>src/lib/tokens.css</code>. Surfaces bind them in
		<code>src/lib/styles/</code>. Components live in <code>src/lib/ui/</code> and read only the standard
		names.
	</footer>
</div>

<style>
	.page {
		max-width: 1500px;
		margin-inline: auto;
		padding: 40px 24px 80px;
	}

	.masthead {
		max-width: 68ch;
		margin-bottom: 32px;
	}

	.eyebrow {
		font-family: var(--font-mono);
		font-size: 11px;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--faint);
	}

	h1 {
		margin: 10px 0 0;
		font-size: clamp(26px, 3.2vw, 34px);
		font-weight: 700;
		letter-spacing: -0.03em;
		text-wrap: balance;
	}

	.dek {
		margin: 12px 0 0;
		color: var(--muted);
		line-height: 1.6;
	}

	code {
		font-family: var(--font-mono);
		font-size: 12.5px;
		color: var(--ink);
	}

	.grid {
		display: grid;
		gap: 18px;
		grid-template-columns: minmax(0, 1fr);
	}

	.col {
		min-width: 0;
	}

	.colhead {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 10px;
		margin-bottom: 10px;
	}

	.colhead h2 {
		margin: 0;
		font-size: 16px;
		font-weight: 650;
	}

	.note {
		font-size: 12.5px;
		color: var(--faint);
	}

	.stage {
		padding: 18px;
		border-radius: var(--r-card);
		background: var(--paper);
		box-shadow: 0 1px 2px -1px rgba(20, 20, 24, 0.06);
	}

	.kit {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.row {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

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

	.single {
		margin-top: 40px;
		padding-top: 28px;
		border-top: 1px solid var(--rule);
	}

	.single h2 {
		margin: 0 0 8px;
		font-size: 18px;
		font-weight: 650;
	}

	.single .dek {
		margin-bottom: 16px;
	}

	.rule-note {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-top: 44px;
		padding-top: 22px;
		border-top: 1px solid var(--rule);
		font-size: 13px;
		color: var(--muted);
	}

	@media (min-width: 1100px) {
		.grid {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}
</style>
