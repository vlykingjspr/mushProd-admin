<script lang="ts">
	import {
		Modal,
		ProgressRadial,
		Toast,
		getModalStore,
		type ModalComponent,
		type ModalSettings
	} from '@skeletonlabs/skeleton';

	import { onMount } from 'svelte';

	import { fetchFarmData } from '$lib/firebase/staticData';
	import {
		allPlantedBags,
		allHarvestedGrams,
		LastDateInBagsRecord,
		LastDateInHarvest,
		allRemovedBags,
		getAllAveTempHumd,
		getYield
	} from '$lib/firebase/allRecord';
	import { collection, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
	import { db } from '$lib/firebase/firebase';
	import { format } from 'date-fns';

	import {
		getAnalysis,
		getHarvestData,
		getTempHumidAve,
		getAveEachBatch
	} from '$lib/components/Report/getData';

	let isLoading = true;
	let farmData: any[] = [];
	let planted: any;
	let harvest: any;
	let removed: any;
	let lastDate: any;
	let lastDateHarv: any;
	let source: any = [];
	let tempHumidAve: any = [];
	let harvestData: any = [];
	let analysisData: any = [];
	let allTempHumd: any;
	let yield_pred: any;
	let yield_pred2: any;
	let aveTempAll: any;
	let aveHumdAll: any;
	let firstDateAve: any;
	let lastDateAve: any;
	let element: any;
	onMount(async () => {
		farmData = await fetchFarmData();
		removed = await allRemovedBags();
		planted = await allPlantedBags();
		harvest = await allHarvestedGrams();
		lastDate = await LastDateInBagsRecord();
		lastDateHarv = await LastDateInHarvest();
		tempHumidAve = await getTempHumidAve();
		harvestData = await getHarvestData();
		analysisData = await getAnalysis();
		allTempHumd = await getAllAveTempHumd();
		aveTempAll = allTempHumd.aveTemp.toFixed(2);
		aveHumdAll = allTempHumd.aveHumidity.toFixed(2);
		firstDateAve = tempHumidAve[0].date;
		lastDateAve = tempHumidAve[tempHumidAve.length - 1].date;
		getYield(planted, allTempHumd.aveTemp, allTempHumd.aveHumidity)
			.then((predictedWeight) => {
				yield_pred = predictedWeight;
				yield_pred2 = yield_pred.toFixed(2);
			})
			.catch((error) => {
				console.error('Error in fetching data:', error);
			});

		const result = await getAveEachBatch();
		// console.log(result);

		const userDocRef = doc(db, 'user', '123456');
		const bagsRecordCollectionRef = collection(userDocRef, 'temp and humid');
		const q = query(bagsRecordCollectionRef, orderBy('date', 'desc'));

		const unsubscribe = onSnapshot(q, (querySnapshot) => {
			source = [];

			querySnapshot.forEach((doc) => {
				const data = doc.data();
				// Ensure that the `date` field is a valid Firestore Timestamp
				if (data.date && data.date.toDate) {
					// Convert Firestore Timestamp to JavaScript Date
					data.date = format(data.date.toDate(), 'MMMM dd, yyyy');
				}

				// Add the ID to the data object
				data.id = doc.id;
				// tableData.push(data);
				source.push(data);
			});
		});
		isLoading = false;
	});
</script>

{#if isLoading}
	<div class="flex justify-center items-center h-fit mt-5">
		<ProgressRadial value={undefined} />
	</div>
{:else}
	<div class="mushroom-data-container mt-5">
		<div class="mushroom-data-table">
			<h2 class="section-heading mb-2 h4">Mushroom Data</h2>

			<p class="section-content mb-2">This table provides information of the mushrooms.</p>
			<div class="table-container">
				<table class="table table-hover">
					<thead>
						<tr>
							<th>Type</th>
							<th>Total Bags</th>
							<th>Total Harvested</th>
							<th>Total Bags Removed</th>
						</tr>
					</thead>
					<tbody>
						<!-- {#each tempHumidAve as row} -->
						<tr class="">
							<td>Oyster Mushroom</td>
							<td>{planted}</td>
							<td>{harvest}</td>
							<td>{removed}</td>
						</tr>
						<!-- {/each} -->
					</tbody>
				</table>
			</div>
		</div>

		<!-- <div class="additional-info mt-6">
			<div class="summary-description">
				<p><strong>Type:</strong> Oyster Mushroom</p>
				<p>
					<strong>Total Bags:</strong>
					{planted} bags have been planted.
				</p>
				<p>
					<strong>Total Harvested:</strong> A total of {harvest} grams harvested.
				</p>
				<p>
					<strong>Total Bags Removed:</strong>
					{removed} bags have been removed.
				</p>
			</div>
		</div> -->
	</div>

	<div class="yield mt-5 mb-10">
		<h2 class="section-heading mb-2 h4">Yield Prediction</h2>
		<p class="section-content mb-2">
			This table provides predictions for mushroom yield based on the gathered data and conditions.
		</p>

		<div class="table-container1 mb-2">
			<div class="table-container">
				<table class="table table-hover">
					<thead>
						<tr>
							<th>Starting Date</th>
							<th>Last Date </th>
							<th>Number of Planted Bags</th>
							<th>Average Temperature</th>
							<th>Average Humidity</th>
							<th>Predicted Yield</th>
						</tr>
					</thead>
					<tbody>
						<tr class="">
							<td>{firstDateAve}</td>
							<td>{lastDateAve}</td>
							<td>{planted}</td>
							<td>{aveTempAll}°C</td>
							<td>{aveHumdAll} %</td>
							<td>{yield_pred2}</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
		<p class="section-content mb-5">
			During the observed period from {firstDateAve} to {lastDateAve}, we planted {planted} Oyster Mushroom
			bags in our cultivation environment. The average temperature throughout this period was {aveTempAll}°C,
			and the average humidity was {aveHumdAll}%. Considering these environmental conditions, our
			predictive model anticipates a mushroom yield of approximately {yield_pred2} grams.
		</p>
	</div>
{/if}
