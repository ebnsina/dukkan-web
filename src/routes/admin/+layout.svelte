<script lang="ts">
	/* The admin shell: a fixed rail on a grey ground, and one white sheet that
	   scrolls. Everything a shop owner does happens on that sheet. */
	import { page } from '$app/state';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import {
		DashboardSquare01Icon,
		Invoice01Icon,
		Moon02Icon,
		PackageIcon,
		Settings01Icon,
		Store01Icon,
		Sun03Icon,
		Wallet01Icon
	} from '@hugeicons/core-free-icons';
	import { theme } from '$lib/theme/theme.svelte';
	import '$lib/admin/dashboard.css';

	let { data, children } = $props();

	// One stroke weight everywhere, so the icons read as one set.
	const stroke = 1.6;

	const main = [
		{ href: '/admin', icon: DashboardSquare01Icon, label: 'Dashboard' },
		{ href: '/admin/orders', icon: Invoice01Icon, label: 'Orders' },
		{ href: '/admin/products', icon: PackageIcon, label: 'Products' }
	];

	const others = [
		{ href: '/admin/reconciliation', icon: Wallet01Icon, label: 'Money owed' },
		{ href: '/admin/settings', icon: Settings01Icon, label: 'Settings' }
	];

	const active = (href: string) =>
		href === '/admin' ? page.url.pathname === '/admin' : page.url.pathname.startsWith(href);

	// The first letter of the shop's own name, in its own script.
	const initial = $derived(data.shop?.name?.trim().charAt(0) ?? '');
</script>

<div class="dk-app" class:is-bare={!data.shop}>
	{#if data.shop}
		<aside class="dk-rail">
			<a class="dk-brand" href="/admin">
				<span class="dk-logo">{initial}</span>
				<span class="dk-bname">{data.shop.name}</span>
			</a>

			<span class="dk-group">Main</span>
			{#each main as item (item.href)}
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

			<span class="dk-group">Others</span>
			{#each others as item (item.href)}
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

			<a class="dk-nav dk-foot" href="/shop">
				<HugeiconsIcon icon={Store01Icon} size={17} strokeWidth={stroke} />
				<span class="dk-nav-txt">View shop</span>
			</a>
		</aside>
	{/if}

	<main class="dk-body">
		{#if data.shop}
			<header class="dk-top">
				<form class="dk-search" method="GET" action="/admin/orders">
					<label class="sr-only" for="admin-search">Search orders</label>
					<input
						id="admin-search"
						type="search"
						name="q"
						placeholder="Search orders by number, name or mobile…"
					/>
				</form>
				<span class="dk-top-right">
					<button
						type="button"
						class="dk-round"
						onclick={() => theme.toggle()}
						aria-label="Switch to {theme.resolved === 'dark' ? 'light' : 'dark'} theme"
					>
						<HugeiconsIcon
							icon={theme.resolved === 'dark' ? Sun03Icon : Moon02Icon}
							size={17}
							strokeWidth={stroke}
						/>
					</button>
					<span class="dk-face">{initial}</span>
				</span>
			</header>
		{/if}
		{@render children()}
	</main>
</div>
