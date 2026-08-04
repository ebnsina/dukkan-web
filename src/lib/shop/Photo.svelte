<script lang="ts">
	import type { ProductImage } from '$lib/api/types';
	import { srcsetFor, widthAt } from './photo';

	interface Props {
		image: ProductImage | null;
		/** What share of the viewport this slot takes — see `photo.ts`. */
		sizes: string;
		/** The photo above the fold on a product page should not wait. */
		priority?: boolean;
		/** Falls back to the product's own name when the shop set no alt text. */
		fallbackAlt?: string;
		class?: string;
	}

	let { image, sizes, priority = false, fallbackAlt = '', class: className = '' }: Props = $props();
</script>

{#if image}
	<img
		class="photo {className}"
		src={image.urls.medium}
		srcset={srcsetFor(image)}
		{sizes}
		width={widthAt(image, 'large')}
		height={Math.round((widthAt(image, 'large') * image.height) / (image.width || 1))}
		alt={image.alt_text ?? fallbackAlt}
		loading={priority ? 'eager' : 'lazy'}
		fetchpriority={priority ? 'high' : 'auto'}
		decoding="async"
	/>
{:else}
	<!-- A shop with no photograph yet gets a plain panel, not a broken frame. -->
	<span class="blank {className}" aria-hidden="true"></span>
{/if}

<style>
	.photo {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		background: var(--surface);
	}

	.blank {
		display: block;
		width: 100%;
		height: 100%;
		background: var(--surface);
		border: 1px solid var(--rule);
		border-radius: inherit;
	}
</style>
