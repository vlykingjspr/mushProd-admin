<script lang="ts">
	import { TabGroup, Tab } from '@skeletonlabs/skeleton';
	import Batch from './batch/+page.svelte';
	import Planted from './planted/+page.svelte';
	import Harvested from './harvested/+page.svelte';

	import TempAndHumid from './temp&humid/+page.svelte';
	import { tabNum, updateTab } from './pageTab';
</script>

<!-- <TabGroup>
	<Tab bind:group={$tabNum} name="tab1" value={0}>
		<i class="fa-solid fa-seedling fa-md pr-1" /><span>Batch</span>
	</Tab>
	<Tab bind:group={$tabNum} name="tab1" value={5}>
		<i class="fa-solid fa-seedling fa-md pr-1" /><span>Planted</span>
	</Tab>

	<Tab bind:group={$tabNum} name="tab2" value={1}>
		<i class="fa-solid fa-jar-wheat fa-md pr-1" />
		<span>Harvested</span></Tab
	>

	<Tab bind:group={$tabNum} name="tab3" value={4}>
		<i class="fa-solid fa-temperature-high fa-md pr-1" /><span>Temperature & Humidity</span></Tab
	>
	<!-- Tab Panels --->
<!-- <svelte:fragment slot="panel">
		{#if $tabNum === 0}
			<Batch />
		{:else if $tabNum === 1}
			<Harvested />
		{:else if $tabNum === 4}
			<TempAndHumid />
		{:else if $tabNum === 5}
			<Planted />
		{/if}
	</svelte:fragment>
</TabGroup> -->
