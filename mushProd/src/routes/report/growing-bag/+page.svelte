<script lang="ts">
	import { getAnalysis } from '$lib/components/Report/getData';

	import { ProgressRadial, Modal, Toast, getModalStore, Paginator } from '@skeletonlabs/skeleton';
	import { collection, getDocs, query, doc, onSnapshot, orderBy, where } from 'firebase/firestore';
	import { db } from '$lib/firebase/firebase';
	import { writeAnalysis, getTempHumidAve } from '$lib/components/Report/getData';
	import type { ModalSettings, ModalComponent } from '@skeletonlabs/skeleton';

	//Modals
	import ModalGrowing from '$lib/components/GrowingBags/ModalGrowing.svelte';
	import { growing } from '$lib/stores/stores';

	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	let batchData: any = [];
	let analysisData: any = [];
	let isLoading = true;
	let searchQuery = '';

	onMount(async () => {
		// analysisData = await getAnalysis();

		const userDocRef = doc(db, 'user', '123456');
		const batchCollectionRef = collection(userDocRef, 'batch');
		const q = query(batchCollectionRef);
		const batchDocsSnapshot = await getDocs(q);
		batchData = [];
		for (const batchDoc of batchDocsSnapshot.docs) {
			const userDocRef = doc(db, 'user', '123456');
			const batchCollectionRef = collection(userDocRef, 'batch');
			const q = query(batchCollectionRef, orderBy('batch_planted', 'desc'));

			const batchDocsSnapshot = await getDocs(q);

			const allBatchData = [];

			for (const batchDoc of batchDocsSnapshot.docs) {
				const batchData = batchDoc.data();
				const batchCode = batchData.batch_code;

				// Calculate growth duration
				const today = new Date();
				const batchPlanted = batchData.batch_planted.toDate();
				const growthDuration = Math.floor(
					(today.getTime() - batchPlanted.getTime()) / (1000 * 60 * 60 * 24)
				);

				// Fetch batch_harvest documents
				const batchHarvestCollectionRef = collection(batchDoc.ref, 'batch_harvest');
				const batchHarvestQuery = query(batchHarvestCollectionRef);
				const batchHarvestDocsSnapshot = await getDocs(batchHarvestQuery);

				// Calculate total grams
				const totalGrams = batchHarvestDocsSnapshot.docs.reduce((acc, harvestDoc) => {
					return acc + (harvestDoc.data().grams || 0);
				}, 0);

				// Fetch 'temp and humid' documents for the batch from planting date to current date

				// const tempHumid = await getTempHumidAve();
				const tempAndHumidCollectionRef = collection(doc(db, 'user', '123456'), 'temp and humid');
				const tempAndHumidQuery = query(
					tempAndHumidCollectionRef,
					where('date', '>=', batchPlanted),
					where('date', '<=', today),
					orderBy('date', 'asc')
				);

				const tempAndHumidDocsSnapshot = await getDocs(tempAndHumidQuery);

				// Calculate average temperature and average humidity
				let temperatureSum = 0;
				let humiditySum = 0;
				let numReadings = 0;

				tempAndHumidDocsSnapshot.forEach((tempAndHumidDoc) => {
					const tempAndHumidData = tempAndHumidDoc.data();
					temperatureSum += tempAndHumidData['ave temp'] || 0;
					humiditySum += tempAndHumidData['ave humidity'] || 0;
					numReadings++;
				});

				const averageTemperature = numReadings > 0 ? temperatureSum / numReadings : 0;
				const averageHumidity = numReadings > 0 ? humiditySum / numReadings : 0;

				const analysis = await writeAnalysis(
					batchCode,
					growthDuration,
					batchData.batch_total_bags,
					totalGrams,
					averageTemperature,
					averageHumidity
				);

				allBatchData.push({
					batchCode,
					growthDuration,
					totalBags: batchData.batch_total_bags,
					averageTemperature,
					averageHumidity,
					totalGrams,
					analysis
				});
			}

			analysisData = allBatchData;
			isLoading = false;
			return allBatchData;
		}
	});

	const modalStore = getModalStore();
	//Modals for clicking data
	function modalData(row: any): void {
		const c: ModalComponent = { ref: ModalGrowing };
		growing.set({
			batchCode: row.batchCode,
			growthDuration: row.growthDuration,
			totalBags: row.totalBags,
			averageTemperature: row.averageTemperature.toFixed(2),
			averageHumidity: row.averageHumidity.toFixed(2),
			analysisStat: row.analysis.stat,
			analysisMessage: row.analysis.message,
			totalGrams: row.totalGrams,
			analysistempSugg: row.analysis.temperatureSuggestion,
			analysishumdSugg: row.analysis.humiditySuggestion
		});
		const modal: ModalSettings = {
			type: 'component',
			component: c,
			title: '',
			body: ''
		};
		modalStore.trigger(modal);
	}

	$: {
		paginationSettings.size = analysisData.length;
	}

	let paginationSettings = {
		page: 0,
		limit: 5, // Number of items to display per page
		size: analysisData.length, // Total number of items
		amounts: [1, 2, 5, 10] // Available amounts for the paginator
	};

	$: paginatedSource = analysisData.slice(
		paginationSettings.page * paginationSettings.limit,
		paginationSettings.page * paginationSettings.limit + paginationSettings.limit
	);

	function rowMatchesSearch(row: any): boolean {
		const searchTerms = searchQuery.toLowerCase().split(' ');

		// Check if any of the search terms match any field in the row
		return searchTerms.every((term) =>
			Object.values(row).some(
				(value) => typeof value === 'string' && value.toLowerCase().includes(term)
			)
		);
	}
	function search(): void {
		paginatedSource = analysisData
			.filter((row: any) => rowMatchesSearch(row))
			.slice(
				paginationSettings.page * paginationSettings.limit,
				paginationSettings.page * paginationSettings.limit + paginationSettings.limit
			);
	}
</script>

<Modal transitionIn={fade} transitionInParams={{ duration: 200 }} />
{#if isLoading}
	<div class="flex justify-center items-center h-fit mt-5">
		<ProgressRadial value={undefined} />
	</div>
{:else}
	<Toast />

	<div class="p-4">
		<h2 class="section-heading mb-2 h4">Growing Bag Analysis</h2>

		<blockquote class="blockquote">
			This table provides an analysis of various mushroom production batches, including data such as
			growth duration, total bags planted, grams produced, and the current status of each batch.
		</blockquote>
		<div class="mr-5 mt-5 flex items-center justify-center">
			<input
				type="text"
				bind:value={searchQuery}
				placeholder="Search..."
				class="input mb-2 mr-2 sm:w-36 ml-auto h-8"
			/>
			<button
				type="button"
				class="btn btn-sm variant-filled-tertiary h-8 ml-2 mb-2"
				on:click={search}
			>
				<span class="material-symbols-outlined"> search </span>
				<span>Search</span>
			</button>
		</div>
		<div class="table-container">
			<table class="table table-hover">
				<thead>
					<tr class="vertical-header">
						<th class="text-xs">Batch Code </th>
						<th class="text-xs">Growth Duration</th>
						<th class="text-xs">Total Bags Planted</th>
						<th class="text-xs">Average Temperature</th>
						<th class="text-xs">Average Humidity</th>
						<th class="text-xs">Grams</th>
						<th class="text-xs">Status</th>
					</tr>
				</thead>
				<tbody>
					{#each paginatedSource as row (row.batchCode)}
						<tr on:click={() => modalData(row)}>
							<td>{row.batchCode}</td>
							<td>{row.growthDuration}</td>
							<td>{row.totalBags}</td>
							<td>{row.averageTemperature.toFixed(2)}</td>
							<td>{row.averageHumidity.toFixed(2)}</td>
							<td>{row.totalGrams}</td>
							<td>{row.analysis.stat}</td>
						</tr>
						<!-- <tr class="spans">
							<td colspan="7"
								>{row.analysis.message}
								<p>
									<strong>Suggestion:</strong> Consider
									{row.analysis.temperatureSuggestion} and {row.analysis.humiditySuggestion} for better
									mushroom growth.
								</p></td
							>
						</tr> -->
					{/each}</tbody
				>

				<tfoot>
					<tr>
						<th colspan="7">
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
		<br />
	</div>
{/if}
