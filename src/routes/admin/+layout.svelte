<script lang="ts">
	import { page } from '$app/state';
	import ThemeToggle from '$lib/theme/ThemeToggle.svelte';

	let { data, children } = $props();

	const nav = [
		{ href: '/admin', label: 'Dashboard' },
		{ href: '/admin/orders', label: 'Orders' },
		{ href: '/admin/products', label: 'Products' },
		{ href: '/admin/reconciliation', label: 'Money owed' },
		{ href: '/admin/settings', label: 'Settings' }
	];

	const active = (href: string) =>
		href === '/admin' ? page.url.pathname === '/admin' : page.url.pathname.startsWith(href);
</script>

{#if data.shop}
	<header class="bar">
		<div class="inner">
			<a class="brand" href="/admin">{data.shop.name}</a>
			<nav aria-label="Admin">
				{#each nav as item (item.href)}
					<a
						class="link t-button"
						class:is-active={active(item.href)}
						href={item.href}
						aria-current={active(item.href) ? 'page' : undefined}
					>
						{item.label}
					</a>
				{/each}
			</nav>
			<div class="tools">
				<ThemeToggle />
				<a class="view t-button" href="/shop">View shop</a>
			</div>
		</div>
	</header>
{/if}

<main class="main">{@render children()}</main>

<style>
	.bar {
		position: sticky;
		top: 0;
		z-index: 100;
		background: color-mix(in srgb, var(--paper) 82%, transparent);
		-webkit-backdrop-filter: blur(14px);
		backdrop-filter: blur(14px);
		border-bottom: 1px solid var(--rule);
	}

	.inner {
		display: flex;
		align-items: center;
		gap: 32px;
		height: 62px;
		padding-inline: var(--gutter);
		max-width: 1440px;
		margin-inline: auto;
	}

	.brand {
		font-weight: 700;
		font-size: 15px;
		letter-spacing: -0.02em;
		font-variation-settings: 'wdth' 92;
		color: var(--ink);
		text-decoration: none;
		white-space: nowrap;
	}

	nav {
		display: flex;
		gap: 24px;
		overflow-x: auto;
	}

	.link {
		color: var(--faint);
		text-decoration: none;
		white-space: nowrap;
		padding-block: 6px;
		transition: color var(--dur-hover) var(--ease-out);
	}

	.link:hover {
		color: var(--muted);
	}

	.is-active {
		color: var(--ink);
		border-bottom: 1px solid var(--ink);
	}

	.tools {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-left: auto;
	}

	.view {
		color: var(--faint);
		text-decoration: none;
		white-space: nowrap;
	}

	.view:hover {
		color: var(--ink);
	}

	.main {
		padding-inline: var(--gutter);
		max-width: 1440px;
		margin-inline: auto;
		padding-block: clamp(28px, 4vw, 44px) 80px;
	}
</style>
