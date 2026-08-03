<script lang="ts">
	import { Section } from '$lib/ui';

	const names = ['bKash', 'Nagad', 'SSLCommerz', 'Steadfast', 'Pathao', 'RedX'];
</script>

<Section eyebrow="Works with" rule>
	<ul class="list">
		{#each names as name (name)}
			<li class="t-sub">{name}</li>
		{/each}
	</ul>
	<p class="note t-label">Shop logos will go here once the first marketplaces are live.</p>
</Section>

<style>
	.list {
		display: flex;
		flex-wrap: wrap;
		gap: 12px 40px;
	}

	li {
		color: var(--muted);
	}

	.note {
		margin-top: 40px;
		color: var(--faint);
	}
</style>
