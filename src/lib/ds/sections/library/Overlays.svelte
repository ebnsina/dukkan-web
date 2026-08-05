<script lang="ts">
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { InformationCircleIcon, MoreHorizontalIcon } from '@hugeicons/core-free-icons';
	import {
		Avatar,
		Button,
		Confirm,
		Dialog,
		Divider,
		Drawer,
		Field,
		HoverCard,
		Menu,
		Select,
		Stat,
		Textarea,
		Tooltip
	} from '$lib/ui';
	import { couriers } from './specimens';

	let courier = $state('pathao');
	let dialogOpen = $state(false);
	let confirmOpen = $state(false);
	let drawerOpen = $state(false);
</script>

<section id="overlays" class="group">
	<h2>Overlays</h2>
	<p class="note">
		A modal renders in the top layer, outside every surface wrapper, so it reads the ramp directly
		rather than a rebound name.
	</p>
	<div class="cases">
		<div class="case">
			<span class="case-label">Dialog, Confirm, Drawer</span>
			<div class="row">
				<Button variant="quiet" size="sm" onclick={() => (dialogOpen = true)}>Dialog</Button>
				<Button variant="quiet" size="sm" onclick={() => (confirmOpen = true)}>Confirm</Button>
				<Button variant="quiet" size="sm" onclick={() => (drawerOpen = true)}>Drawer</Button>
			</div>
		</div>

		<div class="case">
			<span class="case-label">Menu and Tooltip</span>
			<div class="row is-baseline">
				<Menu
					align="start"
					label="Order actions"
					items={[
						{ label: 'Print the label', onselect: () => {} },
						{ label: 'Book a courier', onselect: () => {} },
						{ label: 'Cancel the order', separatorBefore: true, onselect: () => {} },
						{ label: 'Refund', disabled: true }
					]}
				>
					{#snippet trigger()}
						<span class="icon-btn">
							<HugeiconsIcon icon={MoreHorizontalIcon} size={16} strokeWidth={1.8} />
						</span>
					{/snippet}
				</Menu>

				<Tooltip text="Only orders paid before dispatch count here.">
					<span class="inline">
						Paid up front
						<HugeiconsIcon icon={InformationCircleIcon} size={15} strokeWidth={1.8} />
					</span>
				</Tooltip>
			</div>
		</div>

		<div class="case">
			<span class="case-label">Hover card</span>
			<p class="prose">
				Point at
				<HoverCard>
					{#snippet trigger()}
						<button type="button" class="hc-link">
							<span class="hc-name">Karim</span>
						</button>
					{/snippet}
					<div class="who">
						<Avatar name="Karim Hossain" />
						<div>
							<p class="who-name">Karim Hossain</p>
							<p class="who-meta">Dhaka · 14 orders · ৳48,200 lifetime</p>
						</div>
					</div>
					<Divider />
					<p class="who-note">Last order DK-1005, cash on delivery, still with a rider.</p>
				</HoverCard>
				to see who they are without leaving the list. A tooltip holds a sentence; this holds a
				record.
			</p>
		</div>
	</div>
</section>

<!-- The three that open live with the buttons that open them. They render in
     the top layer, outside `.library`, so their contents carry their own
     spacing rather than the page's. -->
<Dialog
	bind:open={dialogOpen}
	title="Book a courier"
	description="The rider collects from your address."
	size="md"
>
	<div class="body">
		<Field label="Courier">
			{#snippet control(props)}
				<Select {...props} options={couriers} bind:value={courier} />
			{/snippet}
		</Field>
		<Field label="Note for the rider" hint="Optional.">
			{#snippet control(props)}
				<Textarea {...props} rows={3} placeholder="Ring the bell twice" />
			{/snippet}
		</Field>
	</div>
	{#snippet footer()}
		<Button variant="quiet" size="sm" onclick={() => (dialogOpen = false)}>Not now</Button>
		<Button size="sm" onclick={() => (dialogOpen = false)}>Book it</Button>
	{/snippet}
</Dialog>

<Confirm bind:open={confirmOpen} title="Cancel DK-1005?" description="The customer will be told.">
	{#snippet footer()}
		<Button variant="quiet" size="sm" onclick={() => (confirmOpen = false)}>Keep it</Button>
		<Button variant="danger" size="sm" onclick={() => (confirmOpen = false)}>
			Cancel the order
		</Button>
	{/snippet}
</Confirm>

<Drawer bind:open={drawerOpen} title="DK-1005" description="Placed by Karim, going to Dhaka.">
	<div class="body">
		<Stat label="Total" value="৳6,100.00" sub="Cash on delivery" />
		<Divider label="Items" />
		<p class="drawer-note">Two shirts and a scarf, packed and waiting on a rider.</p>
	</div>
	{#snippet footer()}
		<Button variant="quiet" size="sm" onclick={() => (drawerOpen = false)}>Close</Button>
		<Button size="sm" onclick={() => (drawerOpen = false)}>Book a courier</Button>
	{/snippet}
</Drawer>

<style>
	.icon-btn {
		display: grid;
		place-items: center;
		width: 34px;
		height: 34px;
		border: 1px solid var(--rule-strong);
		border-radius: var(--r-control);
		color: var(--ink);
	}

	/* A dotted underline says there is more behind the name; the pointer says
	   it is a thing you can use. `cursor: help` — which draws a question mark —
	   is for a definition, not for a record. */
	.hc-link {
		padding: 0;
		border: 0;
		background: none;
		color: var(--ink);
		font: inherit;
		cursor: pointer;
	}

	.hc-name {
		text-decoration: underline;
		text-decoration-style: dotted;
		text-underline-offset: 3px;
		text-decoration-color: var(--rule-hover);
	}

	.hc-link:hover .hc-name {
		text-decoration-color: var(--accent);
		color: var(--accent);
	}

	.who {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-bottom: 12px;
	}

	.who-name {
		margin: 0;
		font-weight: 650;
	}

	.who-meta {
		margin: 2px 0 0;
		font-size: 12.5px;
		color: var(--faint);
	}

	.who-note {
		margin: 12px 0 0;
		font-size: 13px;
		color: var(--muted);
	}

	/* The overlays sit outside `.library`, so specimen.css cannot reach them. */
	.body {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.drawer-note {
		margin: 0;
		font-size: 14px;
		line-height: 1.65;
		color: var(--muted);
	}
</style>
