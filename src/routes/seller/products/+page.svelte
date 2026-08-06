<script lang="ts">
	import ProductList from '$lib/catalogue/ProductList.svelte';

	let { data, form } = $props();
</script>

<ProductList {data} {form} base="/seller" />
