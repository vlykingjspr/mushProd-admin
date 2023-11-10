<script lang="ts">
	import { onMount } from 'svelte';
	import { fetchFarmData } from '$lib/firebase/staticData';
	let farmData: any[] = [];
	// onMount(async () => {
	// 	farmData = await fetchFarmData();
	// });
	const style = 'mr-2';
</script>

<div class="flex">
	<!-- {#each farmData as farm}
		<p class={style}>Device Code: <strong> {farm.device_code} </strong></p>
		<p class={style}>Farm Address: <strong>{farm.farm_address}</strong></p>
		<p class={style}>Farm Name: <strong>{farm.farm_name}</strong></p>
		<p class={style}>Farmer Name: <strong>{farm.farmer_name}</strong></p>
	{/each} -->
</div>
