<script lang="ts">
	interface Props {
		checked: boolean;
		label: string;
		description?: string;
	}

	let { checked = $bindable(), label, description }: Props = $props();
</script>

<label class="dk-switch">
	<input type="checkbox" bind:checked />
	<span class="dk-switch-track"></span>
	<span class="dk-switch-text">
		<span class="dk-switch-label">{label}</span>
		{#if description}<span class="dk-hint">{description}</span>{/if}
	</span>
</label>
