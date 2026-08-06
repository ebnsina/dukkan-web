<script lang="ts">
	/* One way in, opened with ⌘K.
	 *
	 * The bar this replaces searched orders and nothing else, while sitting
	 * across the top of every page as though it searched the shop. Here typing
	 * finds a place to go or an order to open, and the rest of the screen goes
	 * back to being the page you are on.
	 *
	 * Orders are looked up on the server as you type, because an order number is
	 * the thing a shop owner has in their hand when a customer rings.
	 */
	import { goto } from '$app/navigation';
	import { HugeiconsIcon } from '@hugeicons/svelte';
	import { Search01Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons';
	import type { IconSvgElement } from '@hugeicons/svelte';
	import { Dialog } from '$lib/ui';
	import { formatMinor } from '$lib/utils/money';

	interface Place {
		label: string;
		href: string;
		icon: IconSvgElement;
		group: string;
	}

	interface Props {
		open?: boolean;
		places: Place[];
	}

	let { open = $bindable(false), places }: Props = $props();

	let term = $state('');
	let orders = $state<{ id: string; number: string; recipient: string; total_minor: number }[]>([]);
	let active = $state(0);

	const matched = $derived(
		term.trim() === ''
			? places
			: places.filter((p) => p.label.toLowerCase().includes(term.trim().toLowerCase()))
	);

	/* Anything that is not obviously a place is worth asking the server about —
	   a number, a name, a phone. Debounced, because this fires on every key. */
	$effect(() => {
		const q = term.trim();
		if (q.length < 2) {
			orders = [];
			return;
		}

		let cancelled = false;
		const timer = setTimeout(async () => {
			try {
				const reply = await fetch(`/admin/search?q=${encodeURIComponent(q)}`);
				if (!reply.ok || cancelled) return;
				orders = (await reply.json()).orders ?? [];
			} catch {
				if (!cancelled) orders = [];
			}
		}, 180);

		return () => {
			cancelled = true;
			clearTimeout(timer);
		};
	});

	const rows = $derived([
		...matched.map((p) => ({ kind: 'place' as const, place: p })),
		...orders.map((o) => ({ kind: 'order' as const, order: o }))
	]);

	// A list that shrinks under the cursor must not leave it past the end.
	$effect(() => {
		if (active >= rows.length) active = Math.max(0, rows.length - 1);
	});

	function go(index: number) {
		const row = rows[index];
		if (!row) return;
		open = false;
		term = '';
		goto(row.kind === 'place' ? row.place.href : `/admin/orders/${row.order.id}`);
	}

	function onkeydown(event: KeyboardEvent) {
		if (event.key === 'ArrowDown') {
			active = Math.min(active + 1, rows.length - 1);
			event.preventDefault();
		} else if (event.key === 'ArrowUp') {
			active = Math.max(active - 1, 0);
			event.preventDefault();
		} else if (event.key === 'Enter') {
			go(active);
			event.preventDefault();
		}
	}
</script>

<svelte:window
	onkeydown={(event) => {
		if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
			open = !open;
			event.preventDefault();
		}
	}}
/>

<Dialog
	bind:open
	title="Go to"
	description="Type a page, an order number or a customer's name."
	size="md"
>
	<div class="box">
		<span class="glyph" aria-hidden="true">
			<HugeiconsIcon icon={Search01Icon} size={17} strokeWidth={1.7} />
		</span>
		<!-- svelte-ignore a11y_autofocus -->
		<input
			class="dk-input"
			bind:value={term}
			{onkeydown}
			autofocus
			autocomplete="off"
			spellcheck="false"
			placeholder="Orders, products, settings…"
			aria-label="Search"
		/>
	</div>

	{#if rows.length === 0}
		<p class="dk-note none">Nothing matches “{term}”.</p>
	{:else}
		<ul class="rows">
			{#each rows as row, index (row.kind === 'place' ? row.place.href : row.order.id)}
				<li>
					<button
						type="button"
						class="row"
						class:is-active={index === active}
						onclick={() => go(index)}
						onmouseenter={() => (active = index)}
					>
						{#if row.kind === 'place'}
							<HugeiconsIcon icon={row.place.icon} size={16} strokeWidth={1.7} />
							<span class="what">{row.place.label}</span>
							<span class="where">{row.place.group}</span>
						{:else}
							<HugeiconsIcon icon={ArrowRight01Icon} size={16} strokeWidth={1.7} />
							<span class="what">
								{row.order.number}
								<span class="who">{row.order.recipient}</span>
							</span>
							<span class="where">{formatMinor(row.order.total_minor)}</span>
						{/if}
					</button>
				</li>
			{/each}
		</ul>
	{/if}
</Dialog>

<style>
	.box {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.glyph {
		display: inline-flex;
		color: var(--d-faint);
	}

	.none {
		margin-top: 14px;
	}

	.rows {
		list-style: none;
		margin: 14px 0 0;
		padding: 0;
		max-height: 320px;
		overflow-y: auto;
	}

	.row {
		display: flex;
		align-items: center;
		gap: 10px;
		width: 100%;
		padding: 9px 10px;
		border: 0;
		border-radius: 8px;
		background: none;
		color: var(--d-ink);
		font: inherit;
		text-align: left;
		cursor: pointer;
	}

	.is-active {
		background: var(--d-hover);
	}

	.what {
		display: flex;
		flex-direction: column;
		gap: 1px;
	}

	.who,
	.where {
		font-size: 12px;
		color: var(--d-faint);
	}

	/* Pushed to the end so the group and the amount line up down the list. */
	.where {
		margin-left: auto;
	}
</style>
