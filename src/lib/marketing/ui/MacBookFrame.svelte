<script lang="ts">
	import type { Snippet } from 'svelte';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { AppleIcon, BatteryFullIcon, Wifi01Icon } from '@hugeicons/core-free-icons';

	interface Props {
		/** Name of the app that owns the menu bar. */
		app?: string;
		time?: string;
		class?: string;
		children: Snippet;
	}

	let { app = 'Safari', time = 'Tue 9:41', class: className = '', children }: Props = $props();

	const menus = ['File', 'Edit', 'View', 'History'];
</script>

<!--
	A MacBook: lid with a notch, a base wider than the lid, and macOS inside.
	Device chrome is the one place this surface allows a radius or a shadow.
-->
<div class={className}>
	<div
		class="rounded-t-[13px] bg-mk-dark p-[9px] pt-[10px] shadow-[0_34px_60px_-38px_rgba(16,20,16,0.6)]"
	>
		<div class="relative aspect-16/10 overflow-hidden rounded-[3px] bg-mk-shell">
			<span
				aria-hidden="true"
				class="absolute top-0 left-1/2 z-20 h-[9px] w-[76px] -translate-x-1/2 rounded-b-[5px] bg-mk-dark"
			></span>

			<div
				class="flex items-center gap-3 bg-mk-paper/70 px-3 py-[4px] font-mk-mono text-[8px] tracking-[0.06em] text-mk-ink/65"
			>
				<HugeiconsIcon icon={AppleIcon} size={9} strokeWidth={2} />
				<span class="font-semibold text-mk-ink/85">{app}</span>
				{#each menus as menu (menu)}
					<span class="hidden sm:inline">{menu}</span>
				{/each}
				<span class="ml-auto flex items-center gap-2">
					<HugeiconsIcon icon={Wifi01Icon} size={9} strokeWidth={2} />
					<HugeiconsIcon icon={BatteryFullIcon} size={11} strokeWidth={2} />
					<span>{time}</span>
				</span>
			</div>

			<div class="absolute inset-x-[9px] top-[26px] bottom-0">
				{@render children()}
			</div>
		</div>
	</div>

	<!-- Base: wider than the lid, with the finger groove at its centre. -->
	<div class="relative -mx-[5.5%] h-[12px] rounded-b-[10px] bg-mk-shell-deep">
		<span
			aria-hidden="true"
			class="absolute top-0 left-1/2 h-[5px] w-[68px] -translate-x-1/2 rounded-b-[4px] bg-mk-ink/12"
		></span>
	</div>
</div>
