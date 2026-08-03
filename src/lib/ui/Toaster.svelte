<script lang="ts">
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { Cancel01Icon } from '@hugeicons/core-free-icons';
	import { toasts } from './toast.svelte';
</script>

<div class="deck" aria-live="polite" aria-atomic="false">
	{#each toasts.items as toast (toast.id)}
		<div class="toast">
			<div class="body">
				<p class="title">{toast.title}</p>
				{#if toast.description}<p class="desc">{toast.description}</p>{/if}
			</div>
			<button type="button" onclick={() => toasts.dismiss(toast.id)} aria-label="Dismiss">
				<HugeiconsIcon icon={Cancel01Icon} size={13} strokeWidth={1.8} />
			</button>
		</div>
	{/each}
</div>

<style>
	.deck {
		position: fixed;
		right: 0;
		bottom: 0;
		z-index: 600;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 8px;
		padding: 20px;
		pointer-events: none;
	}

	.toast {
		display: flex;
		align-items: flex-start;
		gap: 16px;
		width: min(360px, calc(100vw - 40px));
		padding: 14px 14px 14px 18px;
		background: var(--inverse-paper);
		color: var(--inverse-ink);
		pointer-events: auto;
		animation: rise 260ms var(--ease-out);
	}

	.title {
		font-size: 14px;
		font-weight: 600;
		line-height: 1.4;
	}

	.desc {
		margin-top: 3px;
		font-size: 13px;
		line-height: 1.5;
		opacity: 0.7;
	}

	button {
		margin-left: auto;
		padding: 5px;
		min-width: 24px;
		min-height: 24px;
		background: none;
		border: none;
		color: inherit;
		opacity: 0.6;
		cursor: pointer;
	}

	button:hover {
		opacity: 1;
	}

	@keyframes rise {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
	}
</style>
