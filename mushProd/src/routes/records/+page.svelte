<script lang="ts">
	import { TabGroup, Tab } from '@skeletonlabs/skeleton';

	import Planted from './planted/+page.svelte';
	import Harvested from './harvested/+page.svelte';
	import Mushroom from './mushroom/+page.svelte';
	import { tabNum, updateTab } from './pageTab';
</script>

<TabGroup>
	<Tab bind:group={$tabNum} name="tab1" value={0}>
		<i class="fa-solid fa-seedling fa-md pr-1" /><span>Planted</span>
	</Tab>
	<Tab bind:group={$tabNum} name="tab2" value={1}>
		<i class="fa-solid fa-jar-wheat fa-md pr-1" />
		<span>Harvested</span></Tab
	><Tab bind:group={$tabNum} name="tab3" value={2}>
		<i class="fa-solid fa-clipboard fa-md pr-1" /><span>Mushroom</span></Tab
	>
	<!-- Tab Panels --->
	<svelte:fragment slot="panel">
		{#if $tabNum === 0}
			<Planted />
		{:else if $tabNum === 1}
			<Harvested />
		{:else if $tabNum === 2}
			<Mushroom />
		{/if}
	</svelte:fragment>
</TabGroup>
