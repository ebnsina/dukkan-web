<script lang="ts">
	import type { Snippet } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { prefersReducedMotion } from 'svelte/motion';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { Cancel01Icon } from '@hugeicons/core-free-icons';
	import { trapFocus } from './focus-trap';

	interface Props {
		open?: boolean;
		title: string;
		description?: string;
		dismissible?: boolean;
		children: Snippet;
		footer?: Snippet;
	}

	let {
		open = $bindable(false),
		title,
		description,
		dismissible = true,
		children,
		footer
	}: Props = $props();

	const uid = $props.id();

	function close() {
		if (dismissible) open = false;
	}

	function onkeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') close();
	}

	$effect(() => {
		if (!open) return;
		const previous = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		return () => {
			document.body.style.overflow = previous;
		};
	});
</script>

<svelte:window {onkeydown} />

{#if open}
	<div class="layer">
		<button
			type="button"
			class="scrim"
			tabindex="-1"
			aria-hidden="true"
			onclick={close}
			transition:fade={{ duration: prefersReducedMotion.current ? 0 : 150 }}
		></button>
		<div
			class="panel"
			role="dialog"
			aria-modal="true"
			aria-labelledby="{uid}-title"
			aria-describedby={description ? `${uid}-desc` : undefined}
			transition:fly={{
				y: prefersReducedMotion.current ? 0 : 8,
				duration: prefersReducedMotion.current ? 0 : 200
			}}
			{@attach trapFocus()}
		>
			<div class="head">
				<div>
					<h2 id="{uid}-title" class="t-sub">{title}</h2>
					{#if description}<p id="{uid}-desc" class="desc">{description}</p>{/if}
				</div>
				{#if dismissible}
					<button type="button" class="close" onclick={close} aria-label="Close">
						<HugeiconsIcon icon={Cancel01Icon} size={16} strokeWidth={1.8} />
					</button>
				{/if}
			</div>

			<div class="body">{@render children()}</div>

			{#if footer}<div class="foot">{@render footer()}</div>{/if}
		</div>
	</div>
{/if}

<style>
	.layer {
		position: fixed;
		inset: 0;
		z-index: 400;
		display: grid;
		place-items: center;
		padding: 20px;
		overflow-y: auto;
	}

	.scrim {
		position: fixed;
		inset: 0;
		border: none;
		background: color-mix(in srgb, var(--ink) 46%, transparent);
		cursor: default;
	}

	.panel {
		position: relative;
		z-index: 1;
		width: 100%;
		max-width: 520px;
		background: var(--paper);
		border: 1px solid var(--rule-strong);
	}

	.head {
		display: flex;
		align-items: flex-start;
		gap: 20px;
		padding: 26px 26px 0;
	}

	.desc {
		margin-top: 8px;
		font-size: 14px;
		line-height: 1.6;
		color: var(--muted);
	}

	.close {
		margin-left: auto;
		padding: 5px;
		min-width: 24px;
		min-height: 24px;
		background: none;
		border: none;
		color: var(--faint);
		cursor: pointer;
	}

	.close:hover {
		color: var(--ink);
	}

	.body {
		padding: 20px 26px 26px;
		font-size: var(--size-body);
		line-height: 1.65;
		color: var(--muted);
	}

	.foot {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		padding: 18px 26px;
		border-top: 1px solid var(--rule);
	}
</style>
