<script lang="ts">
	import MkButton from './ui/MkButton.svelte';

	const links = [
		{ href: '#product', label: 'Product' },
		{ href: '#themes', label: 'Themes' },
		{ href: '#pricing', label: 'Pricing' },
		{ href: '#stories', label: 'Stories' },
		{ href: '#faq', label: 'FAQ' }
	];

	let scrollY = $state(0);
	let open = $state(false);
	let scrolled = $derived(scrollY > 8);
</script>

<svelte:window bind:scrollY />

<header
	class="sticky top-0 z-50 bg-mk-paper/95 backdrop-blur-[2px] transition-shadow duration-300 {scrolled
		? 'shadow-[0_1px_0_0_var(--color-mk-rule-soft)]'
		: ''}"
>
	<!--
		Three tracks: mark left, nav dead-centre, actions right. The actions pin
		themselves to the third column explicitly — below md the centre nav is
		`display: none`, which takes it out of the grid entirely rather than leaving
		an empty cell, and auto-placement would drop the actions into the middle
		track beside the mark.
	-->
	<div class="mk-wrap grid h-[74px] grid-cols-[auto_1fr_auto] items-center gap-6">
		<a href="#top" class="flex items-center gap-[11px]">
			<span
				aria-hidden="true"
				class="grid size-[34px] flex-none place-items-center bg-mk-lime text-[19px] leading-none text-mk-ink"
				>&#1583;</span
			>
			<span>
				<span class="block mk-display text-[21px] leading-tight">Dukk&agrave;n</span>
				<span class="block font-mk-mono text-[9px] tracking-[0.1em] text-mk-faint uppercase"
					>Commerce</span
				>
			</span>
		</a>

		<nav aria-label="Main" class="hidden items-center justify-center gap-8 md:flex">
			{#each links as link (link.href)}
				<a href={link.href} class="mk-underline py-1 text-[14px]">{link.label}</a>
			{/each}
		</nav>

		<div class="col-start-3 flex items-center gap-5 justify-self-end">
			<a
				href="/signin"
				class="mk-underline hidden font-mk-mono text-[11px] tracking-[0.14em] uppercase sm:inline-flex"
				>Sign in</a
			>
			<span class="hidden md:inline-flex">
				<MkButton href="#cta" variant="lime" arrow>Get started</MkButton>
			</span>

			<button
				type="button"
				onclick={() => (open = !open)}
				aria-label="Menu"
				aria-expanded={open}
				aria-controls="mk-nav-panel"
				class="flex size-[42px] cursor-pointer flex-col justify-between border border-mk-rule p-3 md:hidden"
			>
				<span
					class="block h-[1.5px] bg-mk-ink transition-transform duration-300 {open
						? 'translate-y-[7.5px] rotate-45'
						: ''}"
				></span>
				<span
					class="block h-[1.5px] bg-mk-ink transition-opacity duration-300 {open
						? 'opacity-0'
						: ''}"
				></span>
				<span
					class="block h-[1.5px] bg-mk-ink transition-transform duration-300 {open
						? '-translate-y-[7.5px] -rotate-45'
						: ''}"
				></span>
			</button>
		</div>
	</div>

	<nav
		id="mk-nav-panel"
		aria-label="Mobile"
		class="overflow-hidden border-mk-rule bg-mk-paper transition-[max-height] duration-300 ease-mk md:hidden {open
			? 'max-h-[420px] border-b'
			: 'max-h-0'}"
	>
		<div class="mk-wrap pt-2 pb-6">
			{#each links as link (link.href)}
				<a
					href={link.href}
					onclick={() => (open = false)}
					class="block border-b border-mk-rule-soft py-3.5 text-[16px]">{link.label}</a
				>
			{/each}
			<a
				href="/signin"
				onclick={() => (open = false)}
				class="block border-b border-mk-rule-soft py-3.5 font-mk-mono text-[12px] tracking-[0.14em] uppercase"
				>Sign in</a
			>
			<div class="mt-5">
				<MkButton href="#cta" variant="lime" full arrow>Get started</MkButton>
			</div>
		</div>
	</nav>
</header>
