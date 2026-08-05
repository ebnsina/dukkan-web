<script lang="ts">
	import ThemePreview from '$lib/shop/ThemePreview.svelte';
	import BackLink from './BackLink.svelte';
	import NextButton from './NextButton.svelte';
	import type { ThemePreset, ThemeSummary } from '$lib/api/types';

	interface Props {
		themes: ThemeSummary[];
		shopName: string;
		theme: ThemeSummary | undefined;
		preset: ThemePreset | undefined;
		onpick: (theme: ThemeSummary) => void;
		onpreset: (code: string) => void;
		onback: () => void;
		onnext: () => void;
	}

	let { themes, shopName, theme, preset, onpick, onpreset, onback, onnext }: Props = $props();
</script>

<section class="mt-9">
	<h2 class="mk-display text-[22px]">Pick how it looks.</h2>
	<p class="mt-2 max-w-[52ch] text-[15px] text-mk-muted">
		Every design changes the arrangement as well as the colour. You can change this later.
	</p>

	<div class="mt-6 grid gap-5 sm:grid-cols-2">
		{#each themes as option (option.code)}
			{@const chosen = theme?.code === option.code}
			{@const shown =
				(chosen ? preset : undefined) ??
				option.presets.find((p) => p.is_default) ??
				option.presets[0]}
			<div>
				<button
					type="button"
					onclick={() => onpick(option)}
					class="w-full cursor-pointer border text-left transition-colors duration-200 {chosen
						? 'border-mk-ink'
						: 'border-mk-ink/15 hover:border-mk-ink'}"
				>
					{#if shown}
						<ThemePreview tokens={shown.tokens} layout={option.layout} name={shopName} />
					{/if}
					<div class="border-t border-mk-ink/10 p-3">
						<span class="mk-display text-[15px] text-mk-ink">{option.name}</span>
						<p class="mt-1 text-[13px] leading-snug text-mk-muted">{option.description}</p>
					</div>
				</button>

				{#if chosen}
					<div class="mt-2 flex flex-wrap gap-2">
						{#each option.presets as choice (choice.code)}
							<button
								type="button"
								onclick={() => onpreset(choice.code)}
								class="flex cursor-pointer items-center gap-2 border px-3 py-1.5 font-mk-mono text-[10px] tracking-[0.12em] uppercase {preset?.code ===
								choice.code
									? 'border-mk-ink text-mk-ink'
									: 'border-mk-ink/15 text-mk-muted hover:border-mk-ink'}"
							>
								<span aria-hidden="true" class="h-3 w-3" style="background: {choice.tokens.accent}"
								></span>
								{choice.name}
							</button>
						{/each}
					</div>
				{/if}
			</div>
		{/each}
	</div>

	<div class="mt-8 flex flex-wrap items-center gap-4">
		<BackLink onclick={onback} />
		<NextButton onclick={onnext}>Next</NextButton>
	</div>
</section>
