<script lang="ts">
	/* One design, as the shop would wear it.
	 *
	 * The card renders; it decides nothing. Which theme is chosen and what
	 * happens on a click belong to whoever is doing the choosing. */
	import ThemePreview from '$lib/shop/ThemePreview.svelte';
	import type { ThemePreset, ThemeSummary } from '$lib/api/types';

	interface Props {
		theme: ThemeSummary;
		/** Set when this is the chosen design. */
		on: boolean;
		/** The preset to show, which is the chosen one only when `on`. */
		preset: ThemePreset | undefined;
		shopName: string;
		onpick: () => void;
		onpreset: (code: string) => void;
	}

	let { theme, on, preset, shopName, onpick, onpreset }: Props = $props();
</script>

<div class="design" class:is-on={on}>
	<label class="pick">
		<input
			class="sr-only"
			type="radio"
			name="theme_code"
			value={theme.code}
			checked={on}
			onchange={onpick}
		/>
		<span class="art">
			{#if preset}
				<ThemePreview tokens={preset.tokens} layout={theme.layout} name={shopName} />
			{/if}
		</span>
		<span class="meta">
			<span class="dk-kicker">{theme.name}</span>
			<span class="dk-hint">{theme.description}</span>
		</span>
	</label>

	<div class="presets">
		{#each theme.presets as choice (choice.code)}
			{@const chosen = on && choice.code === preset?.code}
			<button
				type="button"
				class="swatch"
				class:is-on={chosen}
				aria-pressed={chosen}
				onclick={() => onpreset(choice.code)}
			>
				<span class="dot" style="background: {choice.tokens.accent}"></span>
				{choice.name}
			</button>
		{/each}
	</div>
</div>

<style>
	.design {
		display: flex;
		flex-direction: column;
		border: 1px solid var(--rule-strong);
		border-radius: var(--r-nested);
		overflow: hidden;
	}

	/* The chosen one carries the accent on its edge rather than a tick in a
	   corner: the whole card is the control. */
	.design.is-on {
		border-color: var(--accent);
		box-shadow: inset 0 0 0 1px var(--accent);
	}

	.pick {
		display: flex;
		flex-direction: column;
		cursor: pointer;
	}

	/* The preview is the shop, not our panel, so it keeps its own paper. A list
	   theme runs six rows deep against a dense grid's two, so it is cropped to
	   one height — the top of each is enough to tell them apart, and cards that
	   disagree on height read as a broken grid rather than as five designs. */
	.art {
		display: block;
		height: 168px;
		overflow: hidden;
		border-bottom: 1px solid var(--rule);
	}

	.meta {
		display: flex;
		flex-direction: column;
		gap: 3px;
		padding: 12px 14px;
	}

	.presets {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		padding: 0 14px 14px;
		margin-top: auto;
	}

	.swatch {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 5px 9px;
		border: 1px solid var(--rule-strong);
		border-radius: var(--r-chip);
		background: transparent;
		color: var(--muted);
		font-family: var(--font-mono);
		font-size: 10px;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		cursor: pointer;
		transition:
			color var(--dur-hover) var(--ease-out),
			border-color var(--dur-hover) var(--ease-out);
	}

	.swatch:hover {
		color: var(--ink);
		border-color: var(--ink);
	}

	.swatch.is-on {
		color: var(--ink);
		border-color: var(--accent);
	}

	.dot {
		width: 11px;
		height: 11px;
		border-radius: var(--r-round);
		/* A pale accent would vanish on paper without an edge to hold it. */
		box-shadow: inset 0 0 0 1px rgb(0 0 0 / 0.16);
	}
</style>
