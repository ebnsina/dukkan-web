<script lang="ts">
	import MkLink from './ui/MkLink.svelte';
</script>

<div class="relative z-60 bg-mk-dark text-[13px] text-mk-cream">
	<!--
		The chip belongs to the sentence, so it travels with it; loose in the row it
		took a line of its own on a phone.
	-->
	<div class="mk-wrap flex flex-wrap items-center gap-x-5 gap-y-2.5 py-2.5">
		<p class="mr-auto flex min-w-0 items-baseline gap-3 text-mk-cream/80">
			<span
				class="flex-none rounded-md bg-mk-brand px-2 py-[3px] font-mk-mono text-[10px] tracking-[0.16em] text-mk-on-brand uppercase"
				>New</span
			>
			<span
				><strong class="font-semibold text-mk-cream">Dukk&agrave;n Capital</strong> &mdash; instant cash
				advances against your next 90 days of sales.</span
			>
		</p>
		<MkLink href="#pricing" tone="brand-bright">Check eligibility</MkLink>
	</div>
</div>
