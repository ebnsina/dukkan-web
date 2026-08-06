<script lang="ts">
	/* The seller's shell. Deliberately the same shape as the shop owner's — one
	   rail, one sheet — because a seller on a marketplace is running a shop too,
	   and teaching them a second set of habits buys nothing.

	   It is a much shorter rail, and that is the honest state of it: a seller can
	   see and send their own orders. Managing their own catalogue has an API and
	   no screen yet, so it is not named here as though it were a click away. */
	import { page } from '$app/state';
	import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/svelte';
	import {
		DashboardSquare01Icon,
		Invoice01Icon,
		Store01Icon,
		ArrowUpRight01Icon
	} from '@hugeicons/core-free-icons';
	import '$lib/styles/admin.css';

	let { data, children } = $props();

	const stroke = 1.6;

	interface NavItem {
		href: string;
		icon: IconSvgElement;
		label: string;
	}

	const items: NavItem[] = [{ href: '/seller/orders', icon: Invoice01Icon, label: 'Orders' }];

	const active = (href: string) => page.url.pathname.startsWith(href);

	// The first letter of the seller's own shop name, in its own script.
	const initial = $derived(data.seller?.name?.trim().charAt(0) ?? '');
</script>

<div class="dk-app" class:is-bare={!data.seller}>
	{#if data.seller}
		<aside class="dk-rail">
			<a class="dk-brand" href="/seller">
				<span class="dk-logo">{initial}</span>
				<span class="dk-bname">{data.seller.name}</span>
			</a>

			<nav class="rail-nav">
				<a
					class="dk-nav"
					class:is-on={page.url.pathname === '/seller'}
					href="/seller"
					aria-current={page.url.pathname === '/seller' ? 'page' : undefined}
				>
					<HugeiconsIcon icon={DashboardSquare01Icon} size={17} strokeWidth={stroke} />
					<span class="dk-nav-txt">Overview</span>
				</a>

				{#each items as item (item.label)}
					<a
						class="dk-nav"
						class:is-on={active(item.href)}
						href={item.href}
						aria-current={active(item.href) ? 'page' : undefined}
					>
						<HugeiconsIcon icon={item.icon} size={17} strokeWidth={stroke} />
						<span class="dk-nav-txt">{item.label}</span>
					</a>
				{/each}
			</nav>

			<div class="rail-foot">
				<a class="dk-nav" href="/shop" target="_blank" rel="noreferrer">
					<HugeiconsIcon icon={Store01Icon} size={17} strokeWidth={stroke} />
					<span class="dk-nav-txt">View shop</span>
					<span class="away" aria-label="Opens in a new tab">
						<HugeiconsIcon icon={ArrowUpRight01Icon} size={14} strokeWidth={2} />
					</span>
				</a>
				<span class="who">
					<span class="dk-face">{initial}</span>
					<span class="who-txt">
						<span class="who-name">{data.seller.name}</span>
						<!-- The marketplace they sell on, so a seller who is on more than
						     one is never in doubt about which they are looking at. -->
						<span class="who-role">on {data.shop?.name}</span>
					</span>
				</span>
			</div>
		</aside>
	{/if}

	<main class="dk-body">
		{@render children()}
	</main>
</div>

<style>
	.rail-nav {
		display: flex;
		flex-direction: column;
		gap: 2px;
		flex: 1;
		min-height: 0;
		overflow-y: auto;
		margin-top: 14px;
	}

	.rail-foot {
		display: flex;
		flex-direction: column;
		gap: 2px;
		padding-top: 10px;
	}

	.away {
		display: inline-flex;
		margin-left: auto;
		color: var(--d-faint);
	}

	.who {
		display: flex;
		align-items: center;
		gap: 9px;
		padding: 8px 10px;
		border-radius: 9px;
	}

	.who-txt {
		display: flex;
		flex-direction: column;
		min-width: 0;
	}

	.who-name {
		font-size: 13px;
		color: var(--d-ink);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.who-role {
		font-size: 11px;
		color: var(--d-faint);
	}
</style>
