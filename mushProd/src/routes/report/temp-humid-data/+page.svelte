<script lang="ts">
	import { Paginator, ProgressRadial } from '@skeletonlabs/skeleton';

	import { onMount } from 'svelte';
	import EveryTempHumid from '$lib/components/Charts/everyTempHumid.svelte';
	import { getAllAveTempHumd } from '$lib/firebase/allRecord';
	import { getTempHumidAve } from '$lib/components/Report/getData';
	import { collection, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
	import { db } from '$lib/firebase/firebase';
	import { format } from 'date-fns';

	let isLoading = true;

	let tempHumidAve: any = [];

	let allTempHumd: any;
	let aveTempHumd: any = [];

	let aveTempAll: any;
	let aveHumdAll: any;
	let firstDateAve: any;
	let lastDateAve: any;

	onMount(async () => {
		allTempHumd = await getAllAveTempHumd();
		const userDocRef = doc(db, 'user', '123456');

		const bagsRecordCollectionRef = collection(userDocRef, 'temp and humid');
		const q = query(bagsRecordCollectionRef, orderBy('date', 'asc'));

		aveTempHumd = [];

		const unsubscribe = onSnapshot(q, (querySnapshot) => {
			querySnapshot.forEach((doc) => {
				const data = doc.data();
				if (data.date && data.date.toDate) {
					data.date = format(data.date.toDate(), 'MMMM dd, yyyy');
				}

				data.id = doc.id;
				aveTempHumd.push(data);
			});
			// resolve(aveTempHumd);
		});

		tempHumidAve = await getTempHumidAve();
		aveTempAll = allTempHumd.aveTemp.toFixed(2);
		aveHumdAll = allTempHumd.aveHumidity.toFixed(2);
		firstDateAve = tempHumidAve[0].date;
		lastDateAve = tempHumidAve[tempHumidAve.length - 1].date;

		isLoading = false;
	});

	$: {
		paginationSettings.size = tempHumidAve.length;
	}

	let paginationSettings = {
		page: 0,
		limit: 5, // Number of items to display per page
		size: tempHumidAve.length, // Total number of items
		amounts: [1, 2, 5, 10] // Available amounts for the paginator
	};

	$: paginatedSource = tempHumidAve.slice(
		paginationSettings.page * paginationSettings.limit,
		paginationSettings.page * paginationSettings.limit + paginationSettings.limit
	);
</script>

{#if isLoading}
	<div class="flex justify-center items-center h-fit mt-5">
		<ProgressRadial value={undefined} />
	</div>
{:else}
	<div class="temp_humid p-4">
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

				{#each paginatedSource as row}
					<tbody>
						<tr>
							<td>{row.date}</td>
							<td>{row['ave temp']}°C</td>
							<td>{row['ave humidity']}%</td>
						</tr>
					</tbody>
				{/each}
				<tfoot>
					<tr>
						<th colspan="3">
							<Paginator
								bind:settings={paginationSettings}
								showFirstLastButtons={false}
								showPreviousNextButtons={true}
							/>
						</th>
					</tr>
				</tfoot>
			</table>
		</div>
	</div>
{/if}
