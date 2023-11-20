<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton';
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
		allRemovedBags
	} from '../../firebase/allRecord';
	import { collection, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
	import { db } from '$lib/firebase/firebase';
	import { format } from 'date-fns';

	// getting data
	import { getAnalysis, getHarvestData, getTempHumidAve } from './getData';
	import { remove } from 'firebase/database';

	export let parent: any;
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

<!-- <div style="display: none;"> -->
<div>
	<div id="element">
		<h1 class="report-heading flex justify-center items-center text-4xl">
			MushProd: NodeMCU-Based and Yield Prediction System for Oyster Mushroom System Report
		</h1>
		<div class="info">
			{#each farmData as farm}
				<h2 class="section-heading">I. Farm Overview</h2>
				<p class="section-content">Date of Report: {dateFormat()}</p>
				<p class="section-content">Farmer Name: {farm.farmer_name}</p>
				<p class="section-content">Farm Location: {farm.farm_address}</p>
				<p class="section-content">Device Code: {farm.device_code}</p>
			{/each}
		</div>
		<div class="planted_bags">
			<h2 class="section-heading">II. Growing Bag Analysis</h2>
			<p class="section-content" />
			<h4 class="subsubsection-heading">Planted Bag Record</h4>
			<table class="table">
				<tr>
					<th class="text-xs">Batch Code </th>
					<th class="text-xs">Growth Duration</th>
					<th class="text-xs">Total Bags Planted</th>
					<th class="text-xs">Average Temperature</th>
					<th class="text-xs">Average Humidity</th>
					<th class="text-xs">Grams</th>
					<th class="text-xs">Gains</th>
				</tr>
				{#each analysisData as row}
					<tr>
						<td>{row.batchCode}</td>
						<td>{row.growthDuration}</td>
						<td>{row.totalBags}</td>
						<td>{row.averageTemperature}</td>
						<td>{row.averageHumidity}</td>
						<td>{row.totalGrams}</td>
						<td>Losing</td>
					</tr>
				{/each}
			</table>
		</div>
		<div class="harvested_grams">
			<h2 class="section-heading">III. Harvest Data</h2>

			<h3 class="subsection-heading">Harvest Records</h3>

			<table class="table">
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
		<div class="mushroom_data">
			<h2 class="section-heading">IV. Mushroom Data</h2>
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
		<div class="temp_humid">
			<h2 class="section-heading">V. Temperature and Humidity Monitoring</h2>
			<table class="table">
				<tr>
					<th>Date</th>
					<th>Average Temperature </th>
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
			<p class="section-content" />
		</div>
		<div class="yield">
			<h2 class="section-heading">VI. Yield Prediction</h2>
			<!-- <p class="section-content">
				This section provides predictions for mushroom yield based on the gathered data and
				conditions.
			</p>
			<h3 class="subsection-heading">1. Methodology</h3>
			<p class="section-content">
				The yield prediction is based on a comprehensive methodology that takes into account various
				factors, including environmental conditions such as temperature and humidity, and the number
				of bags.
			</p>

			<h3 class="subsection-heading">2. Yield Projections</h3>
			<p class="section-content">
				Based on the gathered data and analysis, we provide yield projections for upcoming
				cultivation cycles. These projections serve as a valuable guide for planning and optimizing
				mushroom production.
			</p> -->
		</div>

		<!-- Include relevant content for Yield Prediction -->
	</div>
</div>

<!-- @component This example creates a simple form modal. -->

{#if $modalStore[0]}
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

<style>
	* {
		background-color: aliceblue;
	}
	.report-heading {
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
		color: black;
		margin-left: 40px;
	}
	.table {
		color: black;
	}

	.table {
		width: 100%;
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
</style>
