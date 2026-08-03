<script lang="ts">
	export interface Crumb {
		label: string;
		href?: string;
	}

	interface Props {
		items: Crumb[];
	}

	let { items }: Props = $props();
</script>

<nav aria-label="Breadcrumb">
	<ol class="t-button">
		{#each items as item, index (item.label)}
			<li>
				{#if index > 0}<span class="sep" aria-hidden="true">/</span>{/if}
				{#if item.href && index < items.length - 1}
					<a href={item.href}>{item.label}</a>
				{:else}
					<span aria-current="page" class="current">{item.label}</span>
				{/if}
			</li>
		{/each}
	</ol>
</nav>

<style>
	ol {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
	}

	li {
		display: flex;
		align-items: center;
	}

	.sep {
		color: var(--faint);
		padding-inline: 10px;
	}

	a {
		color: var(--faint);
		text-decoration: none;
		transition: color var(--dur-hover) var(--ease-out);
	}

	a:hover {
		color: var(--ink);
	}

	.current {
		color: var(--ink);
	}
</style>
