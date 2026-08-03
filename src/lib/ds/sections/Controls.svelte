<script lang="ts">
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { MoreHorizontalIcon } from '@hugeicons/core-free-icons';
	import { Breadcrumb, Button, Menu, Pagination, Section, Tabs, Tag, toasts } from '$lib/ui';
	import DsBlock from '../DsBlock.svelte';

	let busy = $state(false);
	let page = $state(4);

	function run() {
		busy = true;
		setTimeout(() => (busy = false), 1600);
	}

	const tabs = [
		{ value: 'orders', label: 'Orders' },
		{ value: 'payouts', label: 'Payouts' },
		{ value: 'products', label: 'Products' },
		{ value: 'closed', label: 'Closed', disabled: true }
	];

	const panels: Record<string, string> = {
		orders: 'Every order across every seller, filtered by courier, payment or state.',
		payouts: 'Payouts due and paid, with a statement each seller can check themselves.',
		products: 'Products from every seller, with the queue of ones waiting for your nod.',
		closed: 'Finished periods, kept read-only.'
	};

	const menu = [
		{ label: 'Open seller', onselect: () => toasts.push({ title: 'Open seller' }) },
		{ label: 'Change the cut', onselect: () => toasts.push({ title: 'Change the cut' }) },
		{ label: 'Download statement', disabled: true },
		{
			label: 'Pause seller',
			separatorBefore: true,
			onselect: () => toasts.push({ title: 'Seller paused' })
		}
	];
</script>

<Section
	id="controls"
	eyebrow="04 / Controls"
	heading="Buttons and ways through."
	lead="A button is 46px tall with a mono uppercase label. Hover changes surface or border, never hue, and the arrow shifts 4px on a plain CSS transition."
	rule
>
	<DsBlock label="Button — variants and states">
		<Button>Solid</Button>
		<Button variant="ghost">Ghost</Button>
		<Button arrow>With arrow</Button>
		<Button variant="ghost" arrow>Ghost arrow</Button>
		<Button disabled>Disabled</Button>
		<Button variant="ghost" disabled>Disabled</Button>
		<Button loading>Saving</Button>
		<Button variant="ghost" loading={busy} onclick={run}>Run a payout</Button>
		<Button href="/ds#controls" arrow>As a link</Button>
	</DsBlock>

	<DsBlock label="Tag">
		<Tag>Outline</Tag>
		<Tag variant="solid">Solid</Tag>
		<Tag variant="bare">Bare</Tag>
	</DsBlock>

	<DsBlock label="Tabs" note="Arrow keys, Home and End move between tabs." flow="stack">
		<Tabs items={tabs}>
			{#snippet panel(value)}
				<p class="panel">{panels[value]}</p>
			{/snippet}
		</Tabs>
	</DsBlock>

	<DsBlock label="Menu and breadcrumb" flow="stack">
		<Breadcrumb
			items={[
				{ label: 'Dashboard', href: '/ds' },
				{ label: 'Sellers', href: '/ds' },
				{ label: 'Nokshi Home' }
			]}
		/>
		<div class="menus">
			<Menu items={menu}>
				{#snippet trigger()}
					<span class="icon-box">
						<HugeiconsIcon icon={MoreHorizontalIcon} size={16} strokeWidth={1.6} />
					</span>
				{/snippet}
			</Menu>
			<Menu items={menu} align="end">
				{#snippet trigger({ open })}
					<span class="text-trigger t-button">{open ? 'Close' : 'Seller actions'}</span>
				{/snippet}
			</Menu>
		</div>
	</DsBlock>

	<DsBlock label="Pagination" flow="stack">
		<Pagination bind:page pageCount={24} />
		<p class="current t-mono">Page {page}</p>
	</DsBlock>
</Section>

<style>
	.panel {
		font-size: var(--size-body);
		line-height: 1.6;
		color: var(--muted);
		max-width: var(--measure);
	}

	.menus {
		display: flex;
		flex-wrap: wrap;
		gap: 16px;
		margin-top: 24px;
	}

	.icon-box {
		display: grid;
		place-items: center;
		width: 34px;
		height: 34px;
		border: 1px solid var(--rule-strong);
		color: var(--muted);
	}

	.text-trigger {
		display: inline-flex;
		align-items: center;
		height: 34px;
		padding-inline: 16px;
		border: 1px solid var(--rule-strong);
		color: var(--ink);
	}

	.current {
		margin-top: 16px;
		font-size: 12px;
		color: var(--faint);
	}
</style>
