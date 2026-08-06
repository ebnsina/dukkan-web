<script lang="ts">
	import ProductDetail from '$lib/catalogue/ProductDetail.svelte';

	let { data, form } = $props();
</script>

<ProductDetail {data} {form} base="/seller" />
