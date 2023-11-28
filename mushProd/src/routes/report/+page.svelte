<script lang="ts">
	import {
		Modal,
		ProgressRadial,
		Toast,
		getModalStore,
		type ModalComponent,
		type ModalSettings
	} from '@skeletonlabs/skeleton';

	import { report } from '$lib/stores/stores';
	import { onMount } from 'svelte';
	import { download } from '$lib/components/Report/Download';
	import { dateFormat } from '$lib/components/Data/DateAndTime';
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
	import HarvestedData from '$lib/components/Charts/harvestData.svelte';
	import EveryTempHumid from '$lib/components/Charts/everyTempHumid.svelte';
	// getting data
	import {
		getAnalysis,
		getHarvestData,
		getTempHumidAve,
		getAveEachBatch
	} from '$lib/components/Report/getData';
	import ModalReport from '$lib/components/Report/ModalReport.svelte';
	import { fade } from 'svelte/transition';

	// export let parent: any;
	let isLoading = false;
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
		// element = document.getElementById('element');
		// Don't forget to unsubscribe when your component is no longer needed
	});
	element = document.getElementById('element');
	// Local
	const modalStore = getModalStore();

	// Base Classes
	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';

	let date: string;

	report.subscribe((data) => {});

	// onMount(() => {
	// 	if (!isLoading) {
	// 		element = document.getElementById('element');
	// 		console.log('executed');
	// 	}
	// });
	function showReportModal(): void {
		const c: ModalComponent = { ref: ModalReport };
		// report.set({});
		const modal: ModalSettings = {
			type: 'component',
			component: c,
			title: '',
			body: '',

			response: (r) => console.log('response:', r)
		};
		modalStore.trigger(modal);
	}
</script>

<Modal transitionIn={fade} transitionInParams={{ duration: 200 }} />
{#if isLoading}
	<div class="flex justify-center items-center h-fit mt-5">
		<ProgressRadial value={undefined} />
	</div>
{:else}
	<div class="flex justify-between items-center m-4">
		<div class="ml-auto">
			<button class="btn btn-sm variant-filled-primary" on:click={() => download(element)}>
				<i class="fa-solid fa-print mr-2" />Generate Report
			</button>
		</div>
	</div>
	<div class="flex justify-center items-center mr-20 ml-20 mt-5" style="background-color: white;">
		<div id="element" class="mr-10 ml-10">
			<h1 class="report-heading flex justify-center items-center text-4xl">
				MushProd: NodeMCU-Based and Yield Prediction System for Oyster Mushroom
			</h1>
			<h2 class="section-heading mb-5">I. System Report</h2>
			<div class="info">
				{#each farmData as farm}
					<div class="info-column">
						<div class="info-item">
							<span class="info-label">Date of Report:</span>
							<span class="info-value">{dateFormat()}</span>
						</div>
						<div class="info-item">
							<span class="info-label">Farmer Name:</span>
							<span class="info-value">{farm.farmer_name}</span>
						</div>
					</div>
					<div class="info-column">
						<div class="info-item">
							<span class="info-label">Farm Location:</span>
							<span class="info-value">{farm.farm_address}</span>
						</div>
						<div class="info-item">
							<span class="info-label">Device Code:</span>
							<span class="info-value">{farm.device_code}</span>
						</div>
					</div>
				{/each}
			</div>
			<div class="planted_bags mt-5">
				<h2 class="section-heading mb-2">II. Growing Bag Analysis</h2>
				<p class="section-content mb-2">
					This table provides an analysis of various mushroom production batches, including data
					such as growth duration, total bags planted, grams produced, and the current status of
					each batch.
				</p>

				{#each analysisData as row}
					<table class="table mb-10">
						<tr class="vertical-header">
							<th class="text-xs">Batch Code </th>
							<th class="text-xs">Growth Duration</th>
							<th class="text-xs">Total Bags Planted</th>
							<th class="text-xs">Average Temperature</th>
							<th class="text-xs">Average Humidity</th>
							<th class="text-xs">Grams</th>
							<th class="text-xs">Status</th>
						</tr>

						<tr>
							<td>{row.batchCode}</td>
							<td>{row.growthDuration}</td>
							<td>{row.totalBags}</td>
							<td>{row.averageTemperature.toFixed(2)}</td>
							<td>{row.averageHumidity.toFixed(2)}</td>
							<td>{row.totalGrams}</td>
							<td>{row.analysis.stat}</td>
						</tr>
						<tr class="spans">
							<td colspan="7"
								>{row.analysis.message}
								<p>
									<strong>Suggestion:</strong> Consider
									{row.analysis.temperatureSuggestion} and {row.analysis.humiditySuggestion} for better
									mushroom growth.
								</p></td
							>
						</tr>
					</table>
					<br />
				{/each}
			</div>
			<div class="harvested_grams mt-5">
				<h2 class="section-heading mb-2">III. Harvest Data</h2>
				<p class="section-content mb-2">
					This table provides a overview of the harvest data for batches. It includes the data such
					as the Batch Code, the Number of Harvests, and the Total Grams Harvested for each
					respective batch.
				</p>
				<div class="flex-container">
					<div class="chart-container1">
						<HarvestedData />
					</div>
					<table class="table1">
						<tr>
							<th>Batch Code</th>
							<th>Number of Harvest</th>
							<th>Total Grams Harvested</th>
						</tr>
						{#each harvestData as row}
							<tr>
								<td>{row.batchCode}</td>
								<td>{row.totalHarvests}</td>
								<td>{row.totalGrams}</td>
							</tr>
						{/each}
					</table>
				</div>
			</div>
			<div class="mushroom-data-container mt-5">
				<div class="mushroom-data-table">
					<h2 class="section-heading mb-2">IV. Mushroom Data</h2>
					<table class="table">
						<tr>
							<th>Type</th>
							<th>Total Bags</th>
							<th>Total Harvested</th>
							<th>Total Bags Removed</th>
						</tr>
						<!-- {#each tempHumidAve as row} -->
						<tr class="">
							<td>Oyster Mushroom</td>
							<td>{planted}</td>
							<td>{harvest}</td>
							<td>{removed}</td>
						</tr>
						<!-- {/each} -->
					</table>
				</div>

				<div class="additional-info mt-6">
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
				</div>
			</div>

			<div class="temp_humid mt-5">
				<h2 class="section-heading mb-2">V. Temperature and Humidity Condition</h2>
				<p class="section-content mb-2">
					This table presents a chronological record of temperature and humidity levels during
					specific dates in the mushroom cultivation environment. The average temperature, measured
					in degrees celsius, and average humidity, expressed as a percentage, are key metrics
					captured for monitoring and assessing the growing conditions
				</p>
				<div class="mb-2 flex items-center justify-center">
					<EveryTempHumid />
				</div>
				<div class="table-container">
					<table class="table">
						<tr>
							<th>Date</th>
							<th>Average Temperature</th>
							<th>Average Humidity</th>
						</tr>
						{#each tempHumidAve as row}
							<tr class="">
								<td>{row.date}</td>
								<td>{row['ave temp']}°C</td>
								<td>{row['ave humidity']}%</td>
							</tr>
						{/each}
					</table>
				</div>
			</div>
			<div class="yield mt-5 mb-10">
				<h2 class="section-heading mb-2">VI. Yield Prediction</h2>
				<p class="section-content mb-2">
					This table provides predictions for mushroom yield based on the gathered data and
					conditions.
				</p>

				<div class="table-container1 mb-2">
					<table class="table1">
						<tr>
							<th>Starting Date</th>
							<th>Last Date </th>
							<th>Number of Planted Bags</th>
							<th>Average Temperature</th>
							<th>Average Humidity</th>
							<th>Predicted Yield</th>
						</tr>

						<tr class="">
							<td>{firstDateAve}</td>
							<td>{lastDateAve}</td>
							<td>{planted}</td>
							<td>{aveTempAll}°C</td>
							<td>{aveHumdAll} %</td>
							<td>{yield_pred2}</td>
						</tr>
					</table>
				</div>
				<p class="section-content mb-5">
					During the observed period from {firstDateAve} to {lastDateAve}, we planted {planted} Oyster
					Mushroom bags in our cultivation environment. The average temperature throughout this period
					was {aveTempAll}°C, and the average humidity was {aveHumdAll}%. Considering these
					environmental conditions, our predictive model anticipates a mushroom yield of
					approximately {yield_pred2} grams.
				</p>
			</div>
		</div>
	</div>
{/if}

<style>
	.spans {
		line-height: 1.2;
	}

	.report-heading {
		font-size: 16px;
		color: black;
		display: flex;
		align-items: center;
		font-weight: bold;
	}

	.section-heading {
		font-size: 14px;
		font-weight: bold;
		color: black;
	}
	.section-content {
		font-size: 12px;
		line-height: 1.3;
		color: black;
		margin-left: 40px;
	}

	.table {
		font-size: 12px;
		color: black;
		width: auto; /* Remove the fixed width and let the table adjust based on content */
		margin: 0 auto; /* Center-align the table within its parent container */
		border-collapse: collapse;
	}

	.table,
	.table th,
	.table td {
		border-collapse: collapse;
		border: 1.2px solid #000000;
		padding: 8px;
		text-align: left;
		background-color: rgb(255, 255, 255);
		border-radius: 0 !important;
	}
	.info {
		color: black;
		display: flex;
		justify-content: space-between;
	}

	.info-column {
		flex: 1;
		margin-right: 20px; /* Adjust the margin as needed */
	}

	.info-item {
		margin-bottom: 10px; /* Adjust the margin as needed */
	}

	.info-label {
		font-size: 12px;
		font-weight: bold;
		display: block;
		margin-bottom: 5px; /* Adjust the margin as needed */
	}

	.info-value {
		display: block;
	}
	.mushroom-data-container {
		display: flex;
		justify-content: space-between;
	}

	.mushroom-data-table {
		flex: 1;
		margin-right: 20px; /* Adjust the margin as needed */
	}

	.additional-info {
		color: black;
		flex: 1;
	}
	.harvested_grams {
		display: flex;
		flex-direction: column;
	}
	.summary-description {
		font-size: 14px;
		text-align: justify;
		padding: 10px;
		border-radius: 8px;
		margin-bottom: 20px;
	}
	.flex-container {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.chart-container1 {
		width: 75%; /* Adjust the width as needed */
		margin-right: 10px;
	}

	.table1 {
		font-size: 12px;
		width: 45%;
		color: black;
		width: auto; /* Remove the fixed width and let the table adjust based on content */
		margin: 0 auto; /* Center-align the table within its parent container */
		border-collapse: collapse;
	}

	.table1,
	.table1 th,
	.table1 td {
		border-collapse: collapse;
		border: 1.2px solid #000000;
		padding: 8px;
		text-align: left;
		background-color: white;
		border-radius: 0;
	}
</style>
