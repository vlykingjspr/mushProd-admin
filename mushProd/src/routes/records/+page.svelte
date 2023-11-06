<script lang="ts">
	import { TabGroup, Tab } from '@skeletonlabs/skeleton';

	import Planted from './planted/+page.svelte';
	import Harvested from './harvested/+page.svelte';

	let tabSet: number = 0;
</script>

<TabGroup>
	<Tab bind:group={tabSet} name="tab1" value={0}>
		<span>Planted</span>
	</Tab>
	<Tab bind:group={tabSet} name="tab2" value={1}>Harvested</Tab>
	<!-- Tab Panels --->
	<svelte:fragment slot="panel">
		{#if tabSet === 0}
			<Planted />
		{:else if tabSet === 1}
			<Harvested />
		{/if}
	</svelte:fragment>
</TabGroup>
