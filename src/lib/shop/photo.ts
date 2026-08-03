import type { ProductImage, ThemeLayout } from '$lib/api/types';

/* The API resizes to a longest edge, not a width: `internal/media/image.go`
   holds these three numbers. A portrait photograph's thumb is 200px tall and
   narrower than that, so the width descriptor is worked out rather than
   assumed — a wrong `w` makes the browser pick the wrong file. */
const EDGES = { thumb: 200, medium: 800, large: 1600 } as const;

type Size = keyof typeof EDGES;

export function widthAt(image: ProductImage, size: Size): number {
	const longest = Math.max(image.width, image.height) || EDGES[size];
	const scale = Math.min(EDGES[size] / longest, 1);
	return Math.max(1, Math.round(image.width * scale));
}

export function srcsetFor(image: ProductImage): string {
	return (Object.keys(EDGES) as Size[])
		.map((size) => `${image.urls[size]} ${widthAt(image, size)}w`)
		.join(', ');
}

/* `sizes` is what actually decides the bytes: without it the browser assumes
   the image fills the viewport and fetches the large one into a 60px slot.
   Bangladesh is a mobile-data market and that is somebody's money. */
export const SIZES = {
	'grid-dense': '(min-width: 1080px) 18vw, (min-width: 780px) 23vw, 45vw',
	'grid-roomy': '(min-width: 900px) 30vw, 46vw',
	editorial: '(min-width: 900px) 45vw, 92vw',
	list: '96px',
	basket: '64px',
	detail: '(min-width: 880px) 46vw, 94vw'
} as const;

export function gridSizes(layout: ThemeLayout): string {
	return SIZES[layout] ?? SIZES['grid-dense'];
}

export function firstImage(images: ProductImage[] | null | undefined): ProductImage | null {
	return images?.[0] ?? null;
}
