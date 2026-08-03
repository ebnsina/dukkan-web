<script lang="ts">
	/* A dashboard needs glyphs a marketing page never did — one 24-grid stroke set. */
	const PATHS: Record<string, string> = {
		home: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
		orders: 'M6 3h12v18l-3-2-3 2-3-2-3 2zM9.5 8.5h5M9.5 12.5h5',
		products: 'M3 7.5l9-4.5 9 4.5-9 4.5zM3 7.5v9l9 4.5 9-4.5v-9M12 12v9',
		money: 'M2.5 6.5h19v11h-19zM12 9.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5M5.5 9.5h.01M18.5 14.5h.01',
		customers:
			'M9 11a3.5 3.5 0 100-7 3.5 3.5 0 000 7M2.5 20v-1.5A4.5 4.5 0 017 14h4a4.5 4.5 0 014.5 4.5V20M16 4.5a3.5 3.5 0 010 6.8M21.5 20v-1.5a4.5 4.5 0 00-3.2-4.3',
		settings:
			'M12 15a3 3 0 100-6 3 3 0 000 6M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M5 5l1.8 1.8M17.2 17.2L19 19M19 5l-1.8 1.8M6.8 17.2L5 19',
		search: 'M11 18a7 7 0 100-14 7 7 0 000 14M20.5 20.5L16 16',
		alert: 'M12 3.5L21.5 20h-19zM12 10v4.5M12 17.5h.01',
		box: 'M3 7.5l9-4.5 9 4.5-9 4.5zM3 7.5v9l9 4.5 9-4.5v-9',
		truck:
			'M2.5 6h11v10h-11zM13.5 9.5h4l3 3.5v3h-7zM7 19.5a1.75 1.75 0 100-3.5 1.75 1.75 0 000 3.5M17 19.5a1.75 1.75 0 100-3.5 1.75 1.75 0 000 3.5',
		chevron: 'M9 5l7 7-7 7',
		down: 'M5 9l7 7 7-7',
		plus: 'M12 5v14M5 12h14',
		bell: 'M18 8a6 6 0 10-12 0c0 5-2.5 6.5-2.5 6.5h17S18 13 18 8M13.7 19a2 2 0 01-3.4 0',
		filter: 'M3 5h18l-7 8v6l-4 2v-8z',
		refresh: 'M20.5 12a8.5 8.5 0 11-2.7-6.2M20.5 4v5h-5'
	};

	interface Props {
		name: keyof typeof PATHS | string;
		size?: number;
	}

	let { name, size = 16 }: Props = $props();
</script>

<svg
	width={size}
	height={size}
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width="1.6"
	stroke-linecap="round"
	stroke-linejoin="round"
	aria-hidden="true"
>
	<path d={PATHS[name] ?? PATHS.home} />
</svg>
