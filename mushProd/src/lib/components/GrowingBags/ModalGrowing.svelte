<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { growing } from '$lib/stores/stores';

	/** Exposes parent props to this component. */
	export let parent: any;

	// Local
	const modalStore = getModalStore();

	// Handle Form Submission
	function onFormSubmit(): void {
		// if ($modalStore[0].response) $modalStore[0].response('ok');
		modalStore.close();
	}

	// Base Classes
	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';

	let batchCode: string;
	let growthDuration: string;
	let totalBags: string;
	let averageTemperature: string;
	let averageHumidity: string;
	let analysisStat: string;
	let analysisMessage: string;
	let totalGrams: string;
	let analysistempSugg: string;
	let analysishumdSugg: string;

	let selectedRowData: any;
	growing.subscribe((data) => {
		selectedRowData = data;
		batchCode = selectedRowData.batchCode;
		growthDuration = selectedRowData.growthDuration;
		totalBags = selectedRowData.totalBags;
		averageTemperature = selectedRowData.averageTemperature;
		averageHumidity = selectedRowData.averageHumidity;
		analysisStat = selectedRowData.analysisStat;
		analysisMessage = selectedRowData.analysisMessage;
		totalGrams = selectedRowData.totalGrams;
		analysistempSugg = selectedRowData.analysistempSugg;
		analysishumdSugg = selectedRowData.analysishumdSugg;
	});
</script>

<!-- @component This example creates a simple form modal. -->

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>
			<div class="flex items-center justify-center">Growing Bag</div>
		</header>
		<article />
		<hr class="opacity-50" />

		<div class="flex justify-between items-center">
			<h1 class="text-lg">
				Batch Code:
				<strong>
					{batchCode}
				</strong>
			</h1>
			<h1 class="text-lg">
				Grow Duration:
				<strong>
					{growthDuration} days
				</strong>
			</h1>
		</div>
		<div class="flex justify-between items-center">
			<h1 class="text-base">
				Average Temperature : <strong>{averageTemperature}°C</strong>
			</h1>
			<h1 class="text-base">
				Average Humidity : <strong>{averageHumidity}%</strong>
			</h1>
		</div>
		<div class="flex justify-between items-center">
			<h1 class="text-base">
				Total Grams : <strong>{totalGrams} g</strong>
			</h1>
			<h1 class="text-base">
				Status: <strong class="h4">{analysisStat}</strong>
			</h1>
		</div>
		<blockquote class="blockquote">
			{analysisMessage}
		</blockquote>
		<p>
			<strong>Suggestion:</strong> Consider
			{analysistempSugg} and {analysishumdSugg} for better mushroom growth.
		</p>
		<!-- prettier-ignore -->
		<footer class="modal-footer {parent.regionFooter}">
			<!-- <button class="btn {parent.buttonNeutral}" on:click={parent.onClose}
				>{parent.buttonTextCancel}</button
			> -->
			<button class="btn {parent.buttonPositive}" on:click={onFormSubmit}>OK</button>
		</footer>
	</div>
{/if}
