<script lang="ts">
	import { ProgressRadial } from '@skeletonlabs/skeleton';

	import { onMount } from 'svelte';
	import EveryTempHumid from '$lib/components/Charts/everyTempHumid.svelte';
	import { getAllAveTempHumd } from '$lib/firebase/allRecord';
	import { getTempHumidAve } from '$lib/components/Report/getData';

	let isLoading = true;

	let tempHumidAve: any = [];

	let allTempHumd: any;

	let aveTempAll: any;
	let aveHumdAll: any;
	let firstDateAve: any;
	let lastDateAve: any;

	onMount(async () => {
		allTempHumd = await getAllAveTempHumd();
		tempHumidAve = await getTempHumidAve();
		aveTempAll = allTempHumd.aveTemp.toFixed(2);
		aveHumdAll = allTempHumd.aveHumidity.toFixed(2);
		firstDateAve = tempHumidAve[0].date;
		lastDateAve = tempHumidAve[tempHumidAve.length - 1].date;

		isLoading = false;
	});
</script>

{#if isLoading}
	<div class="flex justify-center items-center h-fit mt-5">
		<ProgressRadial value={undefined} />
	</div>
{:else}
	<div class="temp_humid mt-5">
		<h2 class="section-heading mb-2 h4">Temperature and Humidity Condition</h2>
		<p class="section-content mb-2">
			This table presents a chronological record of temperature and humidity levels during specific
			dates in the mushroom cultivation environment. The average temperature, measured in degrees
			celsius, and average humidity, expressed as a percentage, are key metrics captured for
			monitoring and assessing the growing conditions
		</p>

		<div class="html2pdf__page-break" />
		<div class="flex-container">
			<div class="chart-container1">
				<div class="w-full text-token grid grid-cols-1 md:grid-cols-4 gap-4 pr-4 pl-4 pb-2">
					<div class={`md:col-span-2 sm:col-span-1`}>
						<div class="m-2">
							<div class="mb-2 flex items-center justify-center">
								<EveryTempHumid />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="table-container">
			<table class="table table-hover">
				<thead>
					<tr>
						<th>Date</th>
						<th>Average Temperature</th>
						<th>Average Humidity</th>
					</tr>
				</thead>

				{#each tempHumidAve as row}
					<tbody>
						<tr>
							<td>{row.date}</td>
							<td>{row['ave temp']}°C</td>
							<td>{row['ave humidity']}%</td>
						</tr>
					</tbody>
				{/each}
			</table>
		</div>
	</div>
{/if}
