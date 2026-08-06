<script lang="ts">
	/* The operator console wears the admin's chrome deliberately: it is the same
	   kind of thing — a working tool on a plain ground — and inventing a second
	   internal design language would be two to maintain and neither finished.
	   The rail is bordered rather than branded, because this console belongs to
	   no shop and must never be mistaken for one. */
	import { page } from '$app/state';
	import { enhance } from '$app/forms';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import {
		Invoice01Icon,
		Logout02Icon,
		Moon02Icon,
		Store01Icon,
		Sun03Icon
	} from '@hugeicons/core-free-icons';
	import { theme } from '$lib/theme/theme.svelte';
	import '$lib/styles/admin.css';

	let { data, children } = $props();

	const stroke = 1.6;

	const nav = [
		{ href: '/platform', icon: Store01Icon, label: 'Shops' },
		{ href: '/platform/invoices', icon: Invoice01Icon, label: 'Bills' }
	];

	const active = (href: string) =>
		href === '/platform' ? page.url.pathname === '/platform' : page.url.pathname.startsWith(href);
</script>

<div class="dk-app" class:is-bare={!data.authenticated}>
	{#if data.authenticated}
		<aside class="dk-rail">
			<a class="dk-brand" href="/platform">
				<span class="dk-logo op">◆</span>
				<span class="dk-bname">Operator</span>
			</a>

			<span class="dk-group">Everything</span>
			{#each nav as item (item.href)}
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

			<form method="POST" action="/platform/signin?/out" use:enhance class="dk-foot">
				<button type="submit" class="dk-nav out">
					<HugeiconsIcon icon={Logout02Icon} size={17} strokeWidth={stroke} />
					<span class="dk-nav-txt">Forget the token</span>
				</button>
			</form>
		</aside>
	{/if}

	<main class="dk-body">
		{#if data.authenticated}
			<header class="dk-top">
				<span class="warn">
					You are looking at every shop on this box. Nothing here is a customer's.
				</span>
				<span class="dk-top-right">
					<button
						type="button"
						class="dk-round"
						onclick={() => theme.toggle()}
						aria-label="Toggle to {theme.resolved === 'dark' ? 'light' : 'dark'} theme"
					>
						<HugeiconsIcon
							icon={theme.resolved === 'dark' ? Sun03Icon : Moon02Icon}
							size={17}
							strokeWidth={stroke}
						/>
					</button>
				</span>
			</header>
		{/if}
		{@render children()}
	</main>
</div>

<style>
	/* Not the brand mark. A shop's rail carries the shop's own initial; this one
	   must not look like it belongs to anybody. */
	.op {
		background: var(--d-card);
		color: var(--d-muted);
		border: 1px solid var(--d-edge-strong);
	}

	.warn {
		font-size: 12.5px;
		color: var(--d-faint);
	}

	.out {
		width: 100%;
		background: none;
		border: 0;
		font: inherit;
		text-align: left;
		cursor: pointer;
	}
</style>
