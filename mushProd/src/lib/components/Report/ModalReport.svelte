<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { report } from '$lib/stores/stores';
	import { onMount } from 'svelte';
	import { download } from './Download';
	import { dateFormat } from '../Data/DateAndTime';

	/** Exposes parent props to this component. */
	export let parent: any;

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
	<div id="element">
		<h1 class="report-heading flex justify-center items-center text-4xl">
			MushProd: NodeMCU-Based and Yield Prediction System for Oyster Mushroom System Report
		</h1>
		<div class="info">
			<h2 class="section-heading">I. Farm Overview</h2>
			<p class="section-content">Date of Report: {dateFormat()}</p>
			<p class="section-content">Farmer Name: [Your Farm Name]</p>
			<p class="section-content">Farm Location: [Location/Field]</p>
			<p class="section-content">Device Code: [Unique System ID]</p>
		</div>
		<div class="planted_bags">
			<h2 class="section-heading">II. Planted Bags</h2>
			<p class="section-content">
				This section provides an analysis of the growing bags used in the mushroom cultivation
				process.
			</p>
			<h4 class="subsubsection-heading">Planted Bag Record</h4>
			<table class="table">
				<tr>
					<th>Total Bags Planted</th>
					<th>Last Planted Date</th>
					<th>Remarks</th>
				</tr>
				<tr>
					<td>[Total Bags Planted]</td>
					<td>[Last Planting Date]</td>
					<td>[Remarks]</td>
				</tr>
			</table>
		</div>
		<div class="harvested_grams">
			<h2 class="section-heading">III. Harvest Data</h2>
			<p class="section-content">
				Here, you will find detailed information about the harvested mushrooms, including bag IDs,
				crop types, and harvest dates.
			</p>
			<h3 class="subsection-heading">Harvest Records</h3>

			<h4 class="subsubsection-heading">1. Harvested Bags</h4>
			<table class="table">
				<tr>
					<th>Total Grams Harvested</th>
					<th>Last Harvest Date</th>
					<th>Remarks</th>
				</tr>
				<tr>
					<td>[Total Bags Harvested]</td>
					<td>[Last Harvest Date]</td>
					<td>[Remarks]</td>
				</tr>
			</table>
		</div>
		<div class="mushroom_data">
			<h2 class="section-heading">IV. Mushroom Data</h2>
			<p class="section-content">
				Explore insights into the mushroom cultivation process, including types of mushrooms grown
				and their characteristics.
			</p>
		</div>
		<div class="temp_humid">
			<h2 class="section-heading">V. Temperature and Humidity Monitoring</h2>
			<p class="section-content">
				Get an overview of the temperature and humidity conditions monitored during the mushroom
				cultivation period.
			</p>
		</div>
		<div class="yield">
			<h2 class="section-heading">VI. Yield Prediction</h2>
			<p class="section-content">
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
			</p>
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
		width: 100%;
		border-collapse: collapse;
		border: 1px solid #333;
		padding: 8px;
		text-align: left;
		background-color: white;
		border-radius: 0;
	}
</style>
