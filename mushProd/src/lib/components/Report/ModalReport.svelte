<script lang="ts">
	import { ProgressRadial, getModalStore } from '@skeletonlabs/skeleton';
	import { report } from '$lib/stores/stores';
	import { onMount } from 'svelte';
	import { download } from './Download';
	import { dateFormat } from '../Data/DateAndTime';
	import { fetchFarmData } from '../../firebase/staticData';
	import {
		allPlantedBags,
		allHarvestedGrams,
		LastDateInBagsRecord,
		LastDateInHarvest,
		allRemovedBags,
		getYield,
		getAllAveTempHumd
	} from '../../firebase/allRecord';
	import { collection, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
	import { db } from '$lib/firebase/firebase';
	import { format } from 'date-fns';
	import HarvestedData from '$lib/components/Charts/harvestData.svelte';
	import EveryTempHumid from '$lib/components/Charts/everyTempHumid.svelte';
	// getting data
	import { getAnalysis, getHarvestData, getTempHumidAve } from './getData';

	export let parent: any;
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

		getYield(planted, allTempHumd.aveTemp, allTempHumd.aveHumidity)
			.then((predictedWeight) => {
				yield_pred = predictedWeight;
			})
			.catch((error) => {
				console.error('Error in fetching data:', error);
			});
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

		// Don't forget to unsubscribe when your component is no longer needed
	});
	// Local
	const modalStore = getModalStore();

	// Base Classes
	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';

	let date: string;

	report.subscribe((data) => {});

	let element: any;
	onMount(() => {
		element = document.getElementById('element');
	});
</script>

<div style="display: none;">
	<!-- <div> -->
	<div id="element">
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
			<h2 class="section-heading mb-5">II. Growing Bag Analysis</h2>

			<h4 class="subsubsection-heading">Batch Record</h4>
			<p class="section-content">
				This table provides an analysis of various mushroom production batches, including key
				metrics such as growth duration, total bags planted, grams produced, and the current status
				of each batch.
			</p>
			<table class="table">
				<tr>
					<th class="text-xs">Batch Code </th>
					<th class="text-xs">Growth Duration</th>
					<th class="text-xs">Total Bags Planted</th>
					<!-- <th class="text-xs">Average Temperature</th>
					<th class="text-xs">Average Humidity</th> -->
					<th class="text-xs">Grams</th>
					<th class="text-xs">Status</th>
					<th class="text-xs">Analysis</th>
				</tr>
				{#each analysisData as row}
					<tr>
						<td>{row.batchCode}</td>
						<td>{row.growthDuration}</td>
						<td>{row.totalBags}</td>
						<!-- <td>{row.averageTemperature}</td>
						<td>{row.averageHumidity}</td> -->
						<td>{row.totalGrams}</td>
						<td>{row.analysis.stat}</td>
						<td>{row.analysis.message}</td>
					</tr>
				{/each}
			</table>
		</div>
		<div class="harvested_grams mt-5">
			<h2 class="section-heading mb-5">III. Harvest Data</h2>
			<p class="section-content mb-5">
				This table provides a comprehensive overview of the harvest data for various mushroom
				production batches. It includes key metrics such as the Batch Code, the Number of Harvests,
				and the Total Grams Harvested for each respective batch.
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
				<h2 class="section-heading mb-5">IV. Mushroom Data</h2>
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
						<strong>Total Harvested:</strong> The cultivation has yielded a total of {harvest} harvests,
						indicating successful production.
					</p>
					<p>
						<strong>Total Bags Removed:</strong> During the cultivation cycle, {removed} bags have been
						removed.
					</p>
				</div>
			</div>
		</div>

		<div class="temp_humid mt-5">
			<h2 class="section-heading mb-2">V. Temperature and Humidity Condition</h2>
			<p class="section-content mb-5">
				This table presents a chronological record of temperature and humidity levels during
				specific dates in the mushroom cultivation environment. The average temperature, measured in
				degrees celsius, and average humidity, expressed as a percentage, are key metrics captured
				for monitoring and assessing the growing conditions
			</p>
			<div class="mb-2">
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
							<td>{row['ave temp']}</td>
							<td>{row['ave humidity']}</td>
						</tr>
					{/each}
				</table>
			</div>
		</div>
		<div class="yield mt-5">
			<h2 class="section-heading mb-5">VI. Yield Prediction</h2>
			<p class="section-content">
				This section provides predictions for mushroom yield based on the gathered data and
				conditions.
			</p>
			<p class="section-content">
				The yield prediction is based on a comprehensive methodology that takes into account various
				factors, including environmental conditions such as temperature and humidity, and the number
				of bags.
			</p>
			<div class="table-container">
				<table class="table">
					<tr>
						<th>Starting Date</th>
						<th>Last Date </th>
						<th>Number of Planted Bags</th>
						<th>Average Temperature</th>
						<th>Average Humidity</th>
						<th>Predicted Yield</th>
					</tr>
					{#each tempHumidAve as row}
						<tr class="">
							<td>{row.date}</td>
							<td>{row['ave temp']}</td>
							<td>{planted}</td>
							<td>{row['ave humidity']}</td>
							<td>{row['ave humidity']}</td>
							<td>{yield_pred}</td>
						</tr>
					{/each}
				</table>
			</div>
		</div>

		<!-- Include relevant content for Yield Prediction -->
	</div>
</div>

<!-- @component This example creates a simple form modal. -->

{#if $modalStore[0]}
	{#if isLoading}
		<div class="flex justify-center items-center h-screen">
			<ProgressRadial value={undefined} />
		</div>
	{:else}
		<div class="modal-example-form {cBase}">
			<header class={cHeader}>
				<div class="flex items-center">Generate Report</div>
			</header>
			<hr class="opacity-50" />

			<h1 class="text-base">Do you want to generate report ?</h1>

			<!-- prettier-ignore -->
			<footer class="modal-footer {parent.regionFooter}">
			
			<button class="btn {parent.buttonPositive}" on:click={()=>download(element)}>Yes</button>
            <button class="btn {parent.buttonNeutral}" on:click={parent.onClose}
				>{parent.buttonTextCancel}</button
			>
		</footer>
		</div>
	{/if}
{/if}

<style>
	.chart-container {
		width: 100%; /* Set a fixed width for the chart container */
		height: 200px; /* Set a fixed height for the chart container */
		overflow: auto; /* Allow scrolling if the chart exceeds the specified size */
		margin-bottom: 20px; /* Add some margin between the chart and other elements */
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.report-heading {
		font-size: 14px;
		color: black;
		font-size: large;
		display: flex;
		align-items: center;
		font-weight: bold;
	}

	.section-heading {
		font-weight: bold;
		color: black;
	}
	.subsection-heading {
		color: black;
		margin-left: 10px;
	}
	.subsubsection-heading {
		color: black;
		margin-left: 20px;
	}
	.section-content {
		font-size: 12px;

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
		background-color: white;
		border-radius: 0;
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
		width: 45%; /* Adjust the width as needed */
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
