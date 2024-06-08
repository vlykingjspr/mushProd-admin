<script lang="ts">
	import { Paginator, ProgressRadial } from '@skeletonlabs/skeleton';

	import { onMount } from 'svelte';
	import EveryTempHumid2 from '$lib/components/Charts/everyTempHumid2.svelte';
	import MonthlyTempHumid from '$lib/components/Charts/monthlyTempHumid.svelte';
	import { getAllAveTempHumd } from '$lib/firebase/allRecord';
	import { getTempHumidAveAsc, getTempHumidAveDesc } from '$lib/components/Report/getData';
	import { collection, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
	import { db } from '$lib/firebase/firebase';
	import { format } from 'date-fns';
	import YearlyTempHumid from '$lib/components/Charts/YearlyTempHumid.svelte';
	import { selectedMonth, selectedYear, yearsStore } from '$lib/stores/stores';
	import getData2 from '$lib/components/Charts/everyTempHumid2.svelte';
	let isLoading = true;

	let tempHumidAve: any = [];

	let allTempHumd: any;
	let aveTempHumd: any = [];

	let aveTempAll: any;
	let aveHumdAll: any;
	let firstDateAve: any;
	let lastDateAve: any;
	let searchQuery = '';

	onMount(async () => {
		allTempHumd = await getAllAveTempHumd();
		const userDocRef = doc(db, 'user', '123456');

		const bagsRecordCollectionRef = collection(userDocRef, 'temp and humid');
		const q = query(bagsRecordCollectionRef, orderBy('date', 'asc'));

		aveTempHumd = [];

		const unsubscribe = onSnapshot(q, (querySnapshot) => {
			querySnapshot.forEach((doc) => {
				const data = doc.data();
				if (data.date && data.date.toDate) {
					data.date = format(data.date.toDate(), 'MMMM dd, yyyy');
				}

				data.id = doc.id;
				aveTempHumd.push(data);
			});
			// resolve(aveTempHumd);
		});

		tempHumidAve = await getTempHumidAveDesc();
		aveTempAll = allTempHumd.aveTemp.toFixed(2);
		aveHumdAll = allTempHumd.aveHumidity.toFixed(2);
		firstDateAve = tempHumidAve[0].date;
		lastDateAve = tempHumidAve[tempHumidAve.length - 1].date;

		isLoading = false;
	});

	$: {
		paginationSettings.size = tempHumidAve.length;
	}

	let paginationSettings = {
		page: 0,
		limit: 5, // Number of items to display per page
		size: tempHumidAve.length, // Total number of items
		amounts: [1, 2, 5, 10] // Available amounts for the paginator
	};

	$: paginatedSource = tempHumidAve.slice(
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
		paginatedSource = tempHumidAve
			.filter((row: any) => rowMatchesSearch(row))
			.slice(
				paginationSettings.page * paginationSettings.limit,
				paginationSettings.page * paginationSettings.limit + paginationSettings.limit
			);
	}
	let selectedPeriod = 'daily';
	let month = new Date().getMonth();
	let year = new Date().getFullYear();
	const monthNames = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];
	let monthString = monthNames[month];
	selectedMonth.set(monthString);
	selectedYear.set(year);
	console.log(year);
</script>

{#if isLoading}
	<div class="flex justify-center items-center h-fit mt-5">
		<ProgressRadial value={undefined} />
	</div>
{:else}
	<div class="temp_humid p-4">
		<h2 class="section-heading mb-2 h4">Temperature and Humidity Condition</h2>

		<blockquote class="blockquote">
			This table presents a chronological record of temperature and humidity levels during specific
			dates in the mushroom cultivation environment. The average temperature, measured in degrees
			celsius, and average humidity, expressed as a percentage, are key metrics captured for
			monitoring and assessing the growing conditions
		</blockquote>

		<div class="html2pdf__page-break" />
		<div class="flex-container">
			<div class="chart-container1">
				<!-- <button
					type="button"
					class="btn btn-sm variant-filled-tertiary h-8 mt-2 ml-2 mb-2"
					on:click={filter}
				>
					Filter
				</button>-->
				<select class="form-select bg-inherit mt-2" bind:value={selectedPeriod}>
					<option value="daily">Daily</option>
					<option value="monthly">Monthly</option>
					<option value="yearly">Yearly</option>
				</select>
				{#if selectedPeriod === 'daily'}
					<select class="form-select bg-inherit mt-2" bind:value={$selectedMonth}>
						<option value="January">January</option>
						<option value="February">February</option>
						<option value="March">March</option>
						<option value="April">April</option>
						<option value="May">May</option>
						<option value="June">June</option>
						<option value="July">July</option>
						<option value="August">August</option>
						<option value="September">September</option>
						<option value="October">October</option>
						<option value="November">November</option>
						<option value="December">December</option>
					</select>
					<!-- <button
						type="button"
						class="btn btn-sm variant-filled-tertiary h-8 mt-2 ml-2 mb-2"
						on:click={applyMonthFilter}
					>
						Apply
					</button> -->
				{:else if selectedPeriod === 'monthly'}
					<select class="form-select bg-inherit mt-2" bind:value={year}
						>{#each $yearsStore as year}
							<option value={year}>{year}</option>
						{/each}</select
					>
				{/if}
				<div class="w-full text-token grid grid-cols-1 md:grid-cols-4 gap-4 pr-4 pl-4 pb-2">
					<div class={`md:col-span-12 sm:col-span-1`}>
						<div class="m-2">
							<div class="mb-2 flex items-center justify-center">
								{#if selectedPeriod === 'daily'}
									<EveryTempHumid2 selectedMonth={$selectedMonth} />
								{:else if selectedPeriod === 'monthly'}
									<MonthlyTempHumid />
								{:else if selectedPeriod === 'yearly'}
									<YearlyTempHumid />
								{/if}
							</div>
						</div>
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

		<div class="table-container">
			<table class="table table-hover">
				<thead>
					<tr>
						<th>Date</th>
						<th>Average Temperature</th>
						<th>Average Humidity</th>
					</tr>
				</thead>

				{#each paginatedSource as row}
					<tbody>
						<tr>
							<td>{row.date}</td>
							<td>{row['ave temp']}°C</td>
							<td>{row['ave humidity']}%</td>
						</tr>
					</tbody>
				{/each}
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
{/if}
