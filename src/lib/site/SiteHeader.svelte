<script lang="ts">
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { Menu01Icon, Cancel01Icon } from '@hugeicons/core-free-icons';
	import { Button, Wordmark } from '$lib/ui';
	import ThemeToggle from '$lib/theme/ThemeToggle.svelte';

	const links = [
		{ href: '/#what-you-get', label: 'What you get' },
		{ href: '/#how-it-works', label: 'How it works' },
		{ href: '/#pricing', label: 'Pricing' },
		{ href: '/#questions', label: 'Questions' }
	];

	let open = $state(false);
</script>

<header class="header">
	<div class="bar container-page">
		<Wordmark />

		<nav aria-label="Main" class="nav">
			{#each links as link (link.href)}
				<a class="link t-button" href={link.href}>{link.label}</a>
			{/each}
		</nav>

		<div class="tools">
			<ThemeToggle />
			<Button href="/#pricing" class="cta">Start free</Button>
			<button
				type="button"
				class="burger"
				onclick={() => (open = !open)}
				aria-expanded={open}
				aria-label="Toggle navigation"
			>
				<HugeiconsIcon icon={open ? Cancel01Icon : Menu01Icon} size={16} strokeWidth={1.6} />
			</button>
		</div>
	</div>

	{#if open}
		<nav aria-label="Mobile" class="drawer container-page">
			{#each links as link (link.href)}
				<a class="drawer-link t-button" href={link.href} onclick={() => (open = false)}>
					{link.label}
				</a>
			{/each}
		</nav>
	{/if}
</header>

<style>
	/* The only layer above the page. Vendor property first, or the minifier
	   keeps only the last of the pair and the blur is silently dropped. */
	.header {
		position: sticky;
		top: 0;
		z-index: 100;
		background: color-mix(in srgb, var(--paper) 82%, transparent);
		-webkit-backdrop-filter: blur(14px);
		backdrop-filter: blur(14px);
		border-bottom: 1px solid var(--rule);
	}

	.bar {
		display: flex;
		align-items: center;
		gap: 32px;
		height: 68px;
	}

	.nav {
		display: none;
		gap: 28px;
		margin-left: auto;
	}

	.link {
		color: var(--muted);
		text-decoration: none;
		transition: color var(--dur-hover) var(--ease-out);
	}

	.link:hover {
		color: var(--ink);
	}

	.tools {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-left: auto;
	}

	.burger {
		display: grid;
		place-items: center;
		width: 34px;
		height: 34px;
		border: 1px solid var(--rule-strong);
		background: none;
		color: var(--muted);
		cursor: pointer;
	}

	.drawer {
		display: flex;
		flex-direction: column;
		border-top: 1px solid var(--rule);
		padding-block: 8px 20px;
	}

	.drawer-link {
		padding-block: 14px;
		color: var(--muted);
		text-decoration: none;
	}

	@media (min-width: 900px) {
		.nav {
			display: flex;
		}

		.tools {
			margin-left: 0;
		}

		.burger,
		.drawer {
			display: none;
		}
	}

	@media (max-width: 599px) {
		.tools :global(.cta) {
			display: none;
		}
	}
</style>
