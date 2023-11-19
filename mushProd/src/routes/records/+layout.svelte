<script lang="ts">
	import { page } from '$app/stores';
	import { Tab, TabAnchor, TabGroup } from '@skeletonlabs/skeleton';
</script>

<TabGroup active="variant-filled-primary">
	<TabAnchor href="/records/batch" selected={$page.url.pathname === '/records/batch'}>
		<i class="fa-solid fa-seedling fa-md pr-1" /><span>Batch</span>
	</TabAnchor>
	<TabAnchor href="/records/planted" selected={$page.url.pathname === '/records/planted'}>
		<i class="fa-solid fa-seedling fa-md pr-1" /><span>Planted</span>
	</TabAnchor>
	<TabAnchor href="/records/harvested" selected={$page.url.pathname === '/records/harvested'}>
		<i class="fa-solid fa-jar-wheat fa-md pr-1" />
		<span>Harvested</span>
	</TabAnchor>
	<TabAnchor href="/records/temp&humid" selected={$page.url.pathname === '/records/temp&humid'}>
		<i class="fa-solid fa-temperature-high fa-md pr-1" /><span>Temperature & Humidity</span>
	</TabAnchor>
</TabGroup>
<slot />
<!-- <Tab bind:group={$tabNum} name="tab1" value={0}>
		<a href="/records/batch" class:active={$tabNum === 0}>
			<i class="fa-solid fa-seedling fa-md pr-1" /><span>Batch</span>
		</a>
	</Tab>
	<Tab bind:group={$tabNum} name="tab1" value={1}>
		<a href="/records/planted" class:active={$tabNum === 1}>
			<i class="fa-solid fa-seedling fa-md pr-1" /><span>Planted</span>
		</a>
	</Tab>

	<Tab bind:group={$tabNum} name="tab2" value={2}>
		<a href="/records/harvested" class:active={$tabNum === 2}>
			<i class="fa-solid fa-jar-wheat fa-md pr-1" />
			<span>Harvested</span></a
		></Tab
	>

	<Tab bind:group={$tabNum} name="tab3" value={3}>
		<a href="/records/temp&humid" class:active={$tabNum === 3}>
			<i class="fa-solid fa-temperature-high fa-md pr-1" /><span>Temperature & Humidity</span></a
		></Tab
	> -->
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
	</svelte:fragment> -->
