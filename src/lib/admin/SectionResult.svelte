<script lang="ts">
	/* What a settings section says after it posts.
	 *
	 * Each section on a page posts to its own action, so each has to work out
	 * whether the last result was its own. That test was written once per
	 * section and is the same test every time. */
	import { Banner } from '$lib/ui';

	interface Props {
		/** The page's `form` prop, whatever section it came from. */
		result: { section?: string; message?: string; done?: string } | null;
		/** The action this section posts to. */
		section: string;
		failed?: string;
		saved?: string;
	}

	let { result, section, failed = 'Not saved', saved = 'Saved' }: Props = $props();

	let mine = $derived(result?.section === section ? result : null);
</script>

{#if mine?.message}
	<div class="msg"><Banner title={failed} tone="danger">{mine.message}</Banner></div>
{:else if mine?.done}
	<div class="msg"><Banner title={saved} tone="success">{mine.done}</Banner></div>
{/if}

<style>
	.msg {
		margin-bottom: 16px;
	}
</style>
