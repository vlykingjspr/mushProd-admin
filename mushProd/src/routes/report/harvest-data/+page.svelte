<script lang="ts">
	import { Paginator, ProgressRadial } from '@skeletonlabs/skeleton';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { getHarvestData } from '$lib/components/Report/getData';
	import HarvestedData from '$lib/components/Charts/harvestData.svelte';
	import { collection, doc, getDocs, orderBy, query } from 'firebase/firestore';
	import { db } from '$lib/firebase/firebase';
	let source: any = [];

	let harvestData: any = [];
	let isLoading = true;
	let searchQuery = '';

	onMount(async () => {
		harvestData = await getHarvestData();

		isLoading = false;
	});

	$: {
		paginationSettings.size = harvestData.length;
	}

	let paginationSettings = {
		page: 0,
		limit: 5, // Number of items to display per page
		size: harvestData.length, // Total number of items
		amounts: [1, 2, 5, 10] // Available amounts for the paginator
	};

	$: paginatedSource = harvestData.slice(
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
		paginatedSource = harvestData
			.filter((row: any) => rowMatchesSearch(row))
			.slice(
				paginationSettings.page * paginationSettings.limit,
				paginationSettings.page * paginationSettings.limit + paginationSettings.limit
			);
	}
</script>

{#if isLoading}
	<div class="flex justify-center items-center h-fit mt-5">
		<ProgressRadial value={undefined} />
	</div>
{:else}
	<div class="p-4">
		<h2 class="section-heading mb-2 h4">Harvest Data</h2>

		<blockquote class="blockquote">
			This table provides a overview of the harvest data for batches. It includes the data such as
			the Batch Code, the Number of Harvests, and the Total Grams Harvested for each respective
			batch.
		</blockquote>
		<div class="flex-container">
			<div class="chart-container1">
				<div class="w-full text-token grid grid-cols-1 md:grid-cols-4 gap-4 pr-4 pl-4 pb-2">
					<div class={`md:col-span-2 sm:col-span-1`}>
						<div class="m-2">
							<HarvestedData />
						</div>
					</div>
				</div>
			</div>
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

			<div class="table-container mb-3">
				<table class="table table-hover">
					<thead>
						<tr>
							<th>Batch Code</th>
							<th>Number of Harvest</th>
							<th>Total Grams Harvested</th>
						</tr>
					</thead>
					<!-- {#each paginatedSource as row (harvestData.id)} -->
					<tbody>
						{#each paginatedSource as row}
							<tr>
								<td>{row.batchCode}</td>
								<td>{row.totalHarvests}</td>
								<td>{row.totalGrams} g</td>
							</tr>
						{/each}
					</tbody>
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
	</div>
{/if}
