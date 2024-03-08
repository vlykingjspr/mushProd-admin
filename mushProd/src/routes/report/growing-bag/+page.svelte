<script lang="ts">
	import { getAnalysis } from '$lib/components/Report/getData';

	import { ProgressRadial } from '@skeletonlabs/skeleton';
	import { collection, getDocs, query, doc, onSnapshot, orderBy, where } from 'firebase/firestore';
	import { db } from '$lib/firebase/firebase';
	import { writeAnalysis, getTempHumidAve } from '$lib/components/Report/getData';

	import { onMount } from 'svelte';

	let batchData: any = [];
	let analysisData: any = [];
	let isLoading = true;
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
			const q = query(batchCollectionRef, orderBy('batch_planted', 'asc'));

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
				// console.log(averageTemperature)

				const analysis = await writeAnalysis(
					batchCode,
					growthDuration,
					batchData.batch_total_bags,
					totalGrams,
					averageTemperature,
					averageHumidity
				);
				// console.log(analysis)
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
			// console.log(allBatchData)
			analysisData = allBatchData;
			console.log(analysisData);
			isLoading = false;
			return allBatchData;
		}
	});
</script>

{#if isLoading}
	<div class="flex justify-center items-center h-fit mt-5">
		<ProgressRadial value={undefined} />
	</div>
{:else}
	<div class="p-4">
		<h2 class="section-heading mb-2 h4">Growing Bag Analysis</h2>
		<p class="section-content mb-4">
			This table provides an analysis of various mushroom production batches, including data such as
			growth duration, total bags planted, grams produced, and the current status of each batch.
		</p>
		{#each analysisData as row}
			<div class="table-container">
				<div class="h4">{row.batchCode}</div>
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
					</tbody>
				</table>
			</div>
			<br />
		{/each}
	</div>
{/if}
