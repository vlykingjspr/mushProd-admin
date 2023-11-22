<script lang="ts">
	// firebase data
	import {
		allPlantedBags,
		allHarvestedGrams,
		LastDateInBagsRecord,
		getYield,
		getAllAveTempHumd
	} from '../../lib/firebase/allRecord';
	// chart
	import Chart from '../../lib/components/Charts/dailyTempHumd.svelte';
	import HarvestData from '../../lib/components/Charts/harvestData.svelte';
	import EveryTempHumid from '$lib/components/Charts/everyTempHumid.svelte';
	// components
	import {
		Modal,
		ProgressRadial,
		type ModalComponent,
		type ModalSettings
	} from '@skeletonlabs/skeleton';

	// modal
	import { getModalStore } from '@skeletonlabs/skeleton';
	import ModalReport from '$lib/components/Report/ModalReport.svelte';

	import { fade } from 'svelte/transition';
	import { currentPageTitle, setLoading, report } from '$lib/stores/stores';
	import { format } from 'date-fns';

	//getting data
	import { getDatabase, ref, get, query, limitToLast, onValue } from 'firebase/database';

	import { loading } from '$lib/stores/stores';
	import { onDestroy, onMount } from 'svelte';

	let humd: number;
	let temp: number;
	let time: any;
	let bagCount: number;
	let gramsCount: number;
	let lastDatePlanted: any;
	let yield_pred: any;
	let harv: any;
	let aveTempHumd: any;
	let aveHumd1: any;
	// getting all data of added bags and grams
	async function fetchData() {
		bagCount = await allPlantedBags();
		gramsCount = await allHarvestedGrams();
		lastDatePlanted = await LastDateInBagsRecord();
		aveTempHumd = await getAllAveTempHumd();

		getYield(bagCount, aveTempHumd.aveTemp, aveTempHumd.aveHumidity)
			.then((predictedWeight) => {
				yield_pred = predictedWeight;
			})
			.catch((error) => {
				console.error('Error in fetching data:', error);
			});
		loading.set(false);
	}

	onMount(() => {
		fetchData();
	});

	// setLoading(true);
	// creating a current date format
	const currentDate = new Date();
	const formattedDate = format(currentDate, 'yyyy-MM-dd');
	// getting data from firebase
	const rdb = getDatabase();
	// const dateRef = ref(rdb, `/BETAPEAK/2023-11-18`);
	const dateRef = ref(rdb, `BETAPEAK/${formattedDate}`);

	const queryRef = query(dateRef, limitToLast(1));
	const unsubscribe = onValue(queryRef, (snapshot) => {
		try {
			if (snapshot.exists()) {
				const data = snapshot.val();

				const lastEntryKey = Object.keys(data)[0];
				const lastEntry = data[lastEntryKey];
				humd = lastEntry.Humd;
				temp = lastEntry.Temp;
				time = lastEntry.Time;

				setLoading(false);
			} else {
				console.log('it does not exist');
			}
		} catch (error) {
			console.log('Error fetching data: ', error);
		}
	});
	onDestroy(() => {
		// Unsubscribe from Firebase when the component is destroyed
		unsubscribe();
	});
	// modals
	const modalStore = getModalStore();

	function updateTitle(title: string): void {
		currentPageTitle.set(title);
	}
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

	// styles
	const cardStyle = 'card card-hover overflow-hidden ';
	const chartStyle = 'card card-hover bg-surface-100 overflow-hidden ';
	const cardInsideStyle = ' p-4 space-y-4 ';
	const cardInsideStyle2 = ' p-4 space-y-6 ';
	const h2Style = 'text-1xl md:text-2xl lg:text-2xl';
	const h3Style = 'text-l md:text-1xl lg:text-1xl';
	const valueStyle = 'flex justify-center items-center text-7xl md:text-4xl lg:text-6xl ';
	const smallValueStyle = 'flex justify-center items-center text-5xl';
	const smallerValueStyle = 'flex justify-center items-center text-2xl';
</script>

<Modal transitionIn={fade} transitionInParams={{ duration: 200 }} />

{#if $loading}
	<div class="flex justify-center items-center h-screen">
		<ProgressRadial value={undefined} />
	</div>
{:else}
	<div class="w-full text-token grid grid-cols-1 md:grid-cols-5 gap-4 p-4">
		<!-- Temperature -->
		<div class={cardStyle}>
			<div class={cardInsideStyle2}>
				<div class="flex items-start mt-2">
					<i class="fa-solid fa-temperature-three-quarters text-2xl mr-2" />
					<h2 class={h2Style}>Temperature</h2>
				</div>
				<hr class="opacity-50" />
				<div class={valueStyle}>
					{#if temp}
						<h1>{temp}°C</h1>
					{:else}
						<div class="flex justify-center items-center">
							<ProgressRadial width="w-20" value={undefined} />
						</div>
					{/if}
				</div>
			</div>
		</div>
		<!-- Humidity -->
		<div class={cardStyle}>
			<div class={cardInsideStyle2}>
				<div class="flex items-start mt-2">
					<i class="fa-solid fa-droplet text-2xl mr-2" />
					<h2 class={h2Style}>Humidity</h2>
				</div>
				<hr class="opacity-50" />

				<div class={valueStyle}>
					{#if humd}
						<h1>{humd}%</h1>
					{:else}
						<div class="flex justify-center items-center">
							<ProgressRadial width="w-20" value={undefined} />
						</div>
					{/if}
				</div>
			</div>
		</div>
		<!-- Total bags and harvest -->
		<div class={cardStyle}>
			<div class={cardInsideStyle}>
				<a href="/records/batch" on:click={() => updateTitle('Records')}>
					<div>
						<div class="flex items-start">
							<i class="fa-solid fa-bag-shopping fa-md text-base mr-2" />
							<h3 class={h3Style}>Total Bags</h3>
						</div>
						<hr class="opacity-50" />

						<div class="flex items-center justify-between mb-5">
							<div>
								{#if bagCount}
									<strong><div class={smallerValueStyle}><h1>{bagCount} bags</h1></div></strong>
								{:else}
									<div class="flex justify-center items-center">
										<ProgressRadial width="w-10" value={undefined} />
									</div>
								{/if}
							</div>
						</div>
					</div>
					<div>
						<div class="flex items-start">
							<i class="fa-solid fa-layer-group fa-md text-base mr-2" />
							<h3 class={h3Style}>Total Harvest</h3>
						</div>
						<hr class="opacity-50" />
						<div class="flex items-center justify-between">
							<div>
								{#if gramsCount}
									<strong><div class={smallerValueStyle}><h1>{gramsCount} kg.</h1></div></strong>
								{:else}
									<div class="flex justify-center items-center">
										<ProgressRadial width="w-10" value={undefined} />
									</div>
								{/if}
							</div>
							<div class="flex justify-center align-center space-x-4 m-4" />
						</div>
					</div>
				</a>
			</div>
		</div>

		<div class={cardStyle}>
			<div class={cardInsideStyle}>
				<div class="flex items-start">
					<i class="fa-solid fa-calendar-days fa-md text-base mr-2" />
					<h2 class={h3Style}>Last Date Planted</h2>
				</div>

				<hr class="opacity-50" />
				<div class={smallValueStyle}>
					<h1 class={smallerValueStyle}>
						<strong>
							{#if lastDatePlanted}
								{lastDatePlanted}
							{:else}
								<div class="flex justify-center items-center">
									<ProgressRadial width="w-10" value={undefined} />
								</div>
							{/if}
						</strong>
					</h1>
				</div>
			</div>
		</div>
		<div class={cardStyle}>
			<div class={cardInsideStyle}>
				<div class="flex items-start">
					<i class="fa-solid fa-seedling fa-md text-base mr-2" />
					<h2 class={h3Style}>Yield Prediction</h2>
				</div>
				<hr class="opacity-50" />
				<div class="">
					<div class={smallerValueStyle}>
						<strong>
							{#if yield_pred}
								<h1>{yield_pred.toFixed(2)} grams</h1>
							{:else}
								<div class="flex justify-center items-center">
									<ProgressRadial width="w-10" value={undefined} />
								</div>
							{/if}
						</strong>
					</div>
					<div class="flex justify-center align-center space-x-4 m-4">
						<button class="grow btn btn-sm variant-filled-primary" on:click={showReportModal}
							>Generate Report</button
						>
					</div>
				</div>
			</div>
		</div>

		<div class={`md:col-span-3 `}>
			<div class={`p-4  ${cardStyle}`}>
				<div class={`p-4 bg-surface-100  `}>
					<Chart />
				</div>
			</div>
		</div>

		<div class={`col-span-2 `}>
			<div class={`p-4  ${cardStyle}`}>
				<div class={`p-4 bg-surface-100  `}>
					<HarvestData />
				</div>
			</div>
		</div>
		<div class={`md:col-span-2 `}>
			<div class={`p-4  ${cardStyle}`}>
				<div class={`p-4 bg-surface-100  `}>
					<EveryTempHumid />
				</div>
			</div>
		</div>
	</div>
{/if}
