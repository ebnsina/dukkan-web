<script lang="ts">
	/* The admin shell: a fixed rail on a grey ground, and one white sheet that
	   scrolls. Everything a shop owner does happens on that sheet. */
	import { page } from '$app/state';
	import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/svelte';
	import {
		Alert02Icon,
		ArrowUpRight01Icon,
		CouponPercentIcon,
		CreditCardIcon,
		CustomerSupportIcon,
		DashboardSquare01Icon,
		DeliveryTruck01Icon,
		Invoice01Icon,
		Layers01Icon,
		Mail01Icon,
		MoneySend01Icon,
		PackageIcon,
		Search01Icon,
		Settings01Icon,
		Store01Icon,
		UserGroupIcon,
		Wallet01Icon
	} from '@hugeicons/core-free-icons';
	import '$lib/styles/admin.css';
	import CommandPalette from '$lib/admin/CommandPalette.svelte';

	let { data, children } = $props();

	// One stroke weight everywhere, so the icons read as one set.
	const stroke = 1.6;

	/* Grouped by the part of the shop each one belongs to. The words are the
	 * ordinary ones a shop owner would use for those parts — not the software's
	 * ("Main", "Others"), which name nothing, and not a running commentary
	 * either.
	 *
	 * Dashboard sits above the groups because it is where you land, not a place
	 * you go looking for.
	 *
	 * An item marked `soon` is not a link. It is here because a shop owner
	 * asking "can it do support tickets?" deserves an answer on the page rather
	 * than a gap, and because a menu that grows in place is easier to learn than
	 * one that rearranges itself the day a feature ships.
	 */
	interface NavItem {
		href: string;
		icon: IconSvgElement;
		label: string;
		/** Named in the menu before it exists, so the answer is on the page. */
		soon?: boolean;
	}

	/* A shop with one seller has nobody to review and no rate to agree, so the
	   entry is absent rather than empty — the same rule every other seller
	   concept follows. */
	const marketplace = $derived(data.shop?.shop_mode === 'marketplace');

	const groups = $derived<{ label: string; items: NavItem[] }[]>([
		{
			label: 'Sales',
			items: [
				{ href: '/admin/orders', icon: Invoice01Icon, label: 'Orders' },
				{ href: '/admin/customers', icon: UserGroupIcon, label: 'Customers' },
				...(marketplace ? [{ href: '/admin/sellers', icon: Store01Icon, label: 'Sellers' }] : [])
			]
		},
		{
			label: 'Catalogue',
			items: [
				{ href: '/admin/products', icon: PackageIcon, label: 'Products' },
				{ href: '/admin/categories', icon: Layers01Icon, label: 'Categories' },
				{ href: '/admin/low-stock', icon: Alert02Icon, label: 'Running out' },
				{ href: '/admin/coupons', icon: CouponPercentIcon, label: 'Discounts' }
			]
		},
		{
			label: 'Customers care',
			items: [
				{ href: '', icon: CustomerSupportIcon, label: 'Support', soon: true },
				{ href: '', icon: Mail01Icon, label: 'Contacts', soon: true }
			]
		},
		{
			label: 'Money',
			items: [
				{ href: '/admin/reconciliation', icon: Wallet01Icon, label: 'Money owed' },
				...(marketplace
					? [{ href: '/admin/payouts', icon: MoneySend01Icon, label: 'Paying sellers' }]
					: []),
				{ href: '/admin/plan', icon: CreditCardIcon, label: 'Your plan' }
			]
		},
		{
			label: 'Settings',
			items: [
				{ href: '/admin/shipping', icon: DeliveryTruck01Icon, label: 'Delivery charges' },
				{ href: '/admin/settings', icon: Settings01Icon, label: 'Settings' }
			]
		}
	]);

	const active = (href: string) =>
		href === '/admin' ? page.url.pathname === '/admin' : page.url.pathname.startsWith(href);

	// The first letter of the shop's own name, in its own script.
	const initial = $derived(data.shop?.name?.trim().charAt(0) ?? '');

	let finding = $state(false);

	/* The rail's foot is separated by the nav fading into it, and only while
	   something is actually hidden below. A rule drawn at all times draws a
	   boundary where there is nothing on the other side of it. */
	let railNav = $state<HTMLElement | null>(null);
	let cut = $state(false);

	function measure() {
		if (!railNav) return;
		cut = railNav.scrollHeight - railNav.scrollTop - railNav.clientHeight > 4;
	}

	$effect(() => {
		measure();
		if (!railNav) return;
		const observer = new ResizeObserver(measure);
		observer.observe(railNav);
		return () => observer.disconnect();
	});

	// Every place the palette can send somebody, named as the rail names them.
	const places = $derived([
		{ label: 'Overview', href: '/admin', icon: DashboardSquare01Icon, group: '' },
		...groups.flatMap((group) =>
			group.items
				.filter((item) => !item.soon)
				.map((item) => ({
					label: item.label,
					href: item.href,
					icon: item.icon,
					group: group.label
				}))
		)
	]);
</script>

<div class="dk-app" class:is-bare={!data.shop}>
	{#if data.shop}
		<aside class="dk-rail">
			<a class="dk-brand" href="/admin">
				<span class="dk-logo">{initial}</span>
				<span class="dk-bname">{data.shop.name}</span>
			</a>

			<!-- The one way in, and it says so. A bar across the top claimed to
			     search the shop while only searching orders. -->
			<button type="button" class="find" onclick={() => (finding = true)}>
				<HugeiconsIcon icon={Search01Icon} size={16} strokeWidth={stroke} />
				<span>Search</span>
				<kbd>⌘K</kbd>
			</button>

			<nav class="rail-nav" class:is-cut={cut} bind:this={railNav} onscroll={measure}>
				<a
					class="dk-nav"
					class:is-on={active('/admin')}
					href="/admin"
					aria-current={active('/admin') ? 'page' : undefined}
				>
					<HugeiconsIcon icon={DashboardSquare01Icon} size={17} strokeWidth={stroke} />
					<span class="dk-nav-txt">Overview</span>
				</a>

				{#each groups as group (group.label)}
					<span class="dk-group">{group.label}</span>
					{#each group.items as item (item.label)}
						{#if item.soon}
							<span class="dk-nav is-soon">
								<HugeiconsIcon icon={item.icon} size={17} strokeWidth={stroke} />
								<span class="dk-nav-txt">{item.label}</span>
								<span class="soon">Soon</span>
							</span>
						{:else}
							<a
								class="dk-nav"
								class:is-on={active(item.href)}
								href={item.href}
								aria-current={active(item.href) ? 'page' : undefined}
							>
								<HugeiconsIcon icon={item.icon} size={17} strokeWidth={stroke} />
								<span class="dk-nav-txt">{item.label}</span>
							</a>
						{/if}
					{/each}
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
				<a class="who" href="/admin/settings">
					<span class="dk-face">{initial}</span>
					<span class="who-txt">
						<span class="who-name">{data.shop.name}</span>
						<span class="who-role">{data.identity?.roles?.[0] ?? 'Signed in'}</span>
					</span>
				</a>
			</div>
		</aside>
	{/if}

	<main class="dk-body">
		{@render children()}
	</main>
</div>

{#if data.shop}
	<CommandPalette bind:open={finding} {places} />
{/if}

<style>
	/* The rail is three parts: a fixed head, a nav that scrolls, and a foot that
	   stays put. A long menu used to push the shop link off the bottom. */
	.rail-nav {
		display: flex;
		flex-direction: column;
		gap: 2px;
		flex: 1;
		min-height: 0;
		overflow-y: auto;
		overscroll-behavior: contain;
		margin-inline: -12px;
		padding-inline: 12px;
		transition: mask-image var(--d-quick);
	}

	.rail-nav.is-cut {
		mask-image: linear-gradient(to bottom, #000 calc(100% - 28px), transparent);
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

	.find {
		display: flex;
		align-items: center;
		gap: 9px;
		width: 100%;
		margin: 10px 0 14px;
		padding: 8px 10px;
		border: 1px solid var(--d-edge);
		border-radius: 9px;
		background: var(--d-card);
		color: var(--d-faint);
		font: inherit;
		font-size: 13px;
		text-align: left;
		cursor: pointer;
	}

	.find:hover {
		color: var(--d-ink);
		border-color: var(--d-edge-strong);
	}

	.find kbd {
		margin-left: auto;
		padding: 1px 5px;
		border: 1px solid var(--d-edge);
		border-radius: 5px;
		font-family: inherit;
		font-size: 11px;
	}

	.who {
		display: flex;
		align-items: center;
		gap: 9px;
		padding: 8px 10px;
		border-radius: 9px;
	}

	.who:hover {
		background: var(--d-hover);
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
		text-transform: capitalize;
	}

	.is-soon {
		cursor: default;
		opacity: 0.55;
	}

	.is-soon:hover {
		background: none;
	}

	.soon {
		margin-left: auto;
		flex: 0 0 auto;
		padding: 2px 5px;
		border-radius: 999px;
		border: 1px solid var(--d-edge);
		font-size: 10px;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--d-faint);
	}
</style>
