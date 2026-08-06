<script lang="ts">
	/* Choosing the design a shop wears.
	 *
	 * This owns the choice and the form; `ThemeCard` owns how one design looks. */
	import { enhance } from '$app/forms';
	import { CheckmarkCircle02Icon } from '@hugeicons/core-free-icons';
	import { Button, Frame, toasts } from '$lib/ui';
	import ThemeCard from './ThemeCard.svelte';
	import type { AppliedTheme, ThemePreset, ThemeSummary } from '$lib/api/types';

	interface Props {
		themes: ThemeSummary[];
		applied: AppliedTheme;
		shopName: string;
	}

	let { themes, applied, shopName }: Props = $props();

	/* Only a deliberate pick is held here; everything else falls through to what
	   the shop wears. Copying the applied theme into state instead would go
	   stale the moment a save reloads it. */
	let picked = $state<{ theme: string; preset: string } | null>(null);

	let themeCode = $derived(picked?.theme ?? applied.theme_code);
	let presetCode = $derived(picked?.preset ?? applied.preset_code);

	// A preset belongs to one theme, so picking a theme carries its own default
	// rather than the last one, which may not exist here.
	function pickTheme(theme: ThemeSummary) {
		picked = {
			theme: theme.code,
			preset:
				theme.code === applied.theme_code
					? applied.preset_code
					: (theme.presets.find((p) => p.is_default)?.code ?? theme.presets[0]?.code ?? '')
		};
	}

	// What a card shows: the chosen preset on the chosen theme, its own default
	// everywhere else.
	function shownPreset(theme: ThemeSummary): ThemePreset | undefined {
		const chosen =
			theme.code === themeCode ? theme.presets.find((p) => p.code === presetCode) : undefined;
		return chosen ?? theme.presets.find((p) => p.is_default) ?? theme.presets[0];
	}

	let chosen = $derived(themes.find((t) => t.code === themeCode));
	let unchanged = $derived(themeCode === applied.theme_code && presetCode === applied.preset_code);
</script>

<Frame
	eyebrow="Design"
	title="What your shop wears"
	action="{applied.theme_name} · {applied.preset_name}"
	variant="pad"
>
	<p class="dk-note">
		Only the storefront changes. Your products, orders and settings stay exactly as they are, so you
		can try another design and go back.
	</p>

	<!-- The designs stay on the page rather than behind a sheet: this is a
	     gallery you compare across, and five previews in a 760px panel would be
	     a worse view of them than the one it replaced. The result still speaks
	     as a toast, like every other form here. -->
	<form
		method="POST"
		action="?/theme"
		use:enhance={() =>
			async ({ result, update }) => {
				await update({ reset: false });
				if (result.type === 'success') {
					const done = (result.data as { done?: string } | undefined)?.done;
					toasts.success(done ?? 'Your shop wears the new design now.');
				} else if (result.type === 'failure') {
					const message = (result.data as { message?: string } | undefined)?.message;
					if (message) toasts.error(message);
				}
			}}
	>
		<fieldset class="designs">
			<legend class="sr-only">Choose a design</legend>

			{#each themes as theme (theme.code)}
				<ThemeCard
					{theme}
					{shopName}
					on={theme.code === themeCode}
					preset={shownPreset(theme)}
					onpick={() => pickTheme(theme)}
					onpreset={(code) => (picked = { theme: theme.code, preset: code })}
				/>
			{/each}
		</fieldset>

		<input type="hidden" name="preset_code" value={presetCode} />

		<div class="dk-acts save">
			<Button type="submit" icon={CheckmarkCircle02Icon} disabled={unchanged}>
				{unchanged ? 'This is your design' : `Use ${chosen?.name ?? 'this design'}`}
			</Button>
		</div>
	</form>
</Frame>

<style>
	.designs {
		display: grid;
		gap: 14px;
		grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
		border: none;
		padding: 0;
		margin: 0;
	}

	.save {
		margin-top: 16px;
	}
</style>
