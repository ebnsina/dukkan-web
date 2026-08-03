<script lang="ts">
	let offline = $state(false);

	$effect(() => {
		offline = !navigator.onLine;
		const update = () => (offline = !navigator.onLine);
		window.addEventListener('online', update);
		window.addEventListener('offline', update);
		return () => {
			window.removeEventListener('online', update);
			window.removeEventListener('offline', update);
		};
	});
</script>

{#if offline}
	<div role="status" class="bar">
		<p class="t-button">You are offline. Reconnect to keep working.</p>
	</div>
{/if}

<style>
	.bar {
		background: var(--inverse-paper);
		color: var(--inverse-ink);
		text-align: center;
		padding-block: 10px;
	}
</style>
