<script lang="ts">
	import { page } from '$app/stores';
	import { Tab, TabAnchor, TabGroup } from '@skeletonlabs/skeleton';
	import { yearsStore, yearHarvest } from '$lib/stores/stores';
	import { getAllAveTempHumd } from '$lib/firebase/allRecord';
	import { getHarvestData, getTempHumidAveAsc } from '$lib/components/Report/getData';

	async function getYear() {
		let dayTempHumd: any = await getTempHumidAveAsc();

		// Get the range of years in the data
		const years = dayTempHumd.map((entry: { date: string | number | Date }) =>
			new Date(entry.date).getFullYear()
		);
		const uniqueYears: unknown[] = [...new Set(years)]; // Remove duplicates

		// Update the yearsStore with the unique years
		yearsStore.set(uniqueYears);

		const harvData: any = await getHarvestData();
		const groupedData = harvData.reduce((acc: any, curr: any) => {
			const year = curr.batchCode.slice(-2);
			if (!acc[year]) {
				acc[year] = { totalHarvests: 0, totalGrams: 0 };
			}
			acc[year].totalHarvests += curr.totalHarvests;
			acc[year].totalGrams += curr.totalGrams;
			return acc;
		}, {});

		const harvCode = Object.keys(groupedData);
		yearHarvest.set(harvCode);
	}
	getYear();
</script>

<TabGroup active="variant-filled-primary">
	<TabAnchor href="/report/growing-bag" selected={$page.url.pathname === '/report/growing-bag'}>
		<div class="flex item-center">
			<span class="material-symbols-outlined pr-1"> weight </span>

			<span>Growing Bags</span>
		</div>
	</TabAnchor>

	<TabAnchor href="/report/harvest-data" selected={$page.url.pathname === '/report/harvest-data'}>
		<div class="flex item-center">
			<span class="material-symbols-outlined pr-1"> potted_plant </span>
			<span>Harvest</span>
		</div>
	</TabAnchor>
	<TabAnchor
		href="/report/temp-humid-data"
		selected={$page.url.pathname === '/report/temp-humid-data'}
	>
		<div class="flex item-center">
			<span class="material-symbols-outlined pr-1"> thermostat </span>
			<span>Temperature & Humidity</span>
		</div>
	</TabAnchor>
	<TabAnchor
		href="/report/mushroom-yield-data"
		selected={$page.url.pathname === '/report/mushroom-yield-data'}
	>
		<div class="flex item-center">
			<span class="material-symbols-outlined pr-1"> psychiatry </span>
			<span>Mushroom & Yield Prediction</span>
		</div>
	</TabAnchor>
	<TabAnchor href="/report/print" selected={$page.url.pathname === '/report/print'}>
		<div class="flex item-center">
			<span class="material-symbols-outlined pr-1"> print </span>
			<span>Print Report</span>
		</div>
	</TabAnchor>
</TabGroup>
<slot />
