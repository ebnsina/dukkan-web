<script lang="ts">
	/* A face, or the initials standing in for one. The name is the source of
	   both, so a caller can never label one thing and picture another. */
	import { cn } from '$lib/utils/cn';

	interface Props {
		name: string;
		src?: string;
		/** `xs` is for a name in running text or a dense row, where `sm` sits
		 * taller than the line it belongs to. */
		size?: 'xs' | 'sm' | 'md' | 'lg';
		/** A dot on the corner — presence, not state. */
		online?: boolean;
		class?: string;
	}

	let { name, src, size = 'md', online = false, class: className }: Props = $props();

	// Two initials from the first two words, and one word gives one letter.
	// Bangla and Arabic have no case, so uppercasing is a no-op there.
	let initials = $derived(
		name
			.trim()
			.split(/\s+/)
			.slice(0, 2)
			.map((word) => [...word][0] ?? '')
			.join('')
			.toUpperCase()
	);
</script>

<!-- The name is announced once: as the image's alt, or as the text behind the
     initials. A `title` on top of either says it twice. -->
<span class={cn('avatar', `is-${size}`, className)}>
	{#if src}
		<img {src} alt={name} />
	{:else}
		<span class="initials" aria-hidden="true">{initials}</span>
		<span class="sr-only">{name}</span>
	{/if}
	{#if online}<span class="dot" aria-hidden="true"></span>{/if}
</span>

<style>
	.avatar {
		position: relative;
		display: inline-grid;
		flex: none;
		place-items: center;
		/* The same corner a control takes. Nothing here is a circle. */
		border-radius: var(--r-control);
		background: var(--surface);
		color: var(--muted);
		font-family: var(--font-mono);
		font-weight: 500;
		letter-spacing: 0.02em;
		user-select: none;
	}

	.is-xs {
		width: 21px;
		height: 21px;
		border-radius: var(--r-chip);
		font-size: 9px;
	}

	.is-sm {
		width: 28px;
		height: 28px;
		font-size: 10.5px;
	}
	.is-md {
		width: 38px;
		height: 38px;
		font-size: 12.5px;
	}
	.is-lg {
		width: 52px;
		height: 52px;
		font-size: 16px;
	}

	/* The image is clipped, not the avatar — a parent that clips would take the
	   corner off the presence mark too. */
	img {
		width: 100%;
		height: 100%;
		border-radius: inherit;
		object-fit: cover;
	}

	/* The mark sits on the edge, so it needs the page behind it to cut a gap. */
	.dot {
		position: absolute;
		right: -2px;
		bottom: -2px;
		width: 30%;
		height: 30%;
		border-radius: var(--r-chip);
		background: var(--success);
		box-shadow: 0 0 0 2px var(--paper);
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}
</style>
