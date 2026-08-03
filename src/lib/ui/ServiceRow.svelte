<script lang="ts">
	import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/svelte';
	import { ArrowRight02Icon } from '@hugeicons/core-free-icons';

	interface Props {
		icon: IconSvgElement;
		name: string;
		summary: string;
		meta?: string;
		href?: string;
	}

	let { icon, name, summary, meta, href = '#' }: Props = $props();
</script>

<a class="row" {href} data-cursor={meta ?? name}>
	<span class="glyph" aria-hidden="true">
		<HugeiconsIcon {icon} size={22} strokeWidth={1.5} />
	</span>
	<span class="body">
		<span class="name t-sub">{name}</span>
		<span class="summary">{summary}</span>
	</span>
	{#if meta}<span class="meta t-mono">{meta}</span>{/if}
	<span class="arrow" aria-hidden="true">
		<HugeiconsIcon icon={ArrowRight02Icon} size={18} strokeWidth={1.5} />
	</span>
</a>

<style>
	.row {
		display: grid;
		grid-template-columns: 26px minmax(0, 1fr) auto 18px;
		align-items: center;
		gap: 20px;
		padding-block: 26px;
		border-bottom: 1px solid var(--rule);
		color: var(--ink);
		text-decoration: none;
		transition: transform var(--dur-hover) var(--ease-out);
	}

	.row:hover {
		transform: translateX(10px);
	}

	.glyph {
		color: var(--muted);
	}

	.body {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.summary {
		font-size: var(--size-body);
		line-height: 1.5;
		color: var(--muted);
		max-width: 52ch;
	}

	.meta {
		font-size: 11px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--faint);
	}

	.arrow {
		color: var(--faint);
		transition: color var(--dur-hover) var(--ease-out);
	}

	.row:hover .arrow {
		color: var(--ink);
	}

	@media (max-width: 640px) {
		.row {
			grid-template-columns: 26px minmax(0, 1fr) 18px;
		}

		.meta {
			grid-column: 2;
			grid-row: 2;
		}
	}
</style>
