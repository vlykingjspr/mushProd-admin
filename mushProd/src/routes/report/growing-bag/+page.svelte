<script lang="ts">
	import { getAnalysis } from '$lib/components/Report/getData';
	import { ProgressRadial } from '@skeletonlabs/skeleton';

	import { onMount } from 'svelte';

	let analysisData: any = [];
	let isLoading = true;
	onMount(async () => {
		analysisData = await getAnalysis();

		isLoading = false;
	});
</script>

{#if isLoading}
	<div class="flex justify-center items-center h-fit mt-5">
		<ProgressRadial value={undefined} />
	</div>
{:else}
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
{/if}
