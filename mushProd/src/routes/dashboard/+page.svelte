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

	//getting data from realtime database and saving it to firestore
	import {
		getAllDataAndSaveToFirestore,
		getDailyAverage
	} from '../../lib/components/Data/calculateAverage';

	// modal
	import { getModalStore } from '@skeletonlabs/skeleton';

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
	let aveTempHumd: any;

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
	// const dateRef = ref(rdb, `/BETAPEAK/2024-04-23`);
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

	// styles
	const cardStyle = 'card card-hover overflow-hidden ';
	const chartStyle = 'card card-hover bg-surface-100 overflow-hidden ';
	const cardInsideStyle = ' p-4 space-y-4 ';
	const cardInsideStyle2 = ' p-4 space-y-6 ';
	const h2Style = 'text-md md:text-lg lg:text-1xl';
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
	<div class="w-full text-token grid grid-cols-1 md:grid-cols-2 gap-4 pr-4 pl-4 pb-2">
		<!-- Temperature -->
		<div class={`md:col-span-1 sm:col-span-1 lg:col-span-1 ${cardStyle}`}>
			<div class={cardInsideStyle2}>
				<div class="flex items-start mt-2">
					<div class="flex items-center">
						<span class="material-symbols-outlined text-4xl"> device_thermostat </span>
						<h2 class={h2Style}>Temperature</h2>
					</div>
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
		<div class={`md:col-span-1 sm:col-span-1 lg:col-span-1 ${cardStyle}`}>
			<div class={cardInsideStyle2}>
				<div class="flex items-start mt-2">
					<div class="flex items-center">
						<span class="material-symbols-outlined text-4xl"> humidity_mid </span>
						<h2 class={h2Style}>Humidity</h2>
					</div>
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
	</div>
	<div class="w-full text-token grid grid-cols-1 md:grid-cols-4 gap-4 pr-4 pl-4 pb-2">
		<div class={`md:col-span-2 sm:col-span-1`}>
			<div class={`p-4  ${cardStyle}`}>
				<div class="flex items-start mt-2">
					<div class="flex items-center">
						<span class="material-symbols-outlined text-4xl"> hourglass_top </span>
						<h2 class={h2Style}>Hourly Average Temperature & Humidity</h2>
					</div>
				</div>
				<hr class="opacity-50 mb-4 mt-4" />
				<div class={`p-4 bg-surface-100  `}>
					<Chart />
				</div>
			</div>
		</div>
		<div class={`md:col-span-2 sm:col-span-1 `}>
			<div class={`p-4  ${cardStyle}`}>
				<div class="flex items-start mt-2">
					<div class="flex items-center">
						<span class="material-symbols-outlined mr-2 text-4xl"> calendar_month </span>
						<h2 class={h2Style}>Daily Average Temperature & Humidity</h2>
					</div>
				</div>

				<hr class="opacity-50 mb-4 mt-4" />
				<div class={`p-4 bg-surface-100  `}>
					<EveryTempHumid />
				</div>
			</div>
		</div>
		<div class={`md:col-span-2 sm:col-span-1`}>
			<div class={`p-4  ${cardStyle}`}>
				<div class="flex items-start mt-2">
					<div class="flex items-center">
						<span class="material-symbols-outlined text-2xl mr-2"> scale </span>
						<h2 class={h2Style}>Total Grams</h2>
					</div>
				</div>
				<hr class="opacity-50 mb-4 mt-4" />
				<div class={`p-4 bg-surface-100  `}>
					<HarvestData />
				</div>
			</div>
		</div>

		<div class={`md:col-span-2 sm:col-span-1`}>
			<div class="w-full text-token grid grid-cols-1 md:grid-cols-2 gap-4 pr-4 pl-4 pb-2">
				<div class={cardStyle}>
					<div class={cardInsideStyle}>
						<div class="flex items-start">
							<div class="flex items-center">
								<span class="material-symbols-outlined mr-2"> psychiatry </span>

								<h2 class={h3Style}>Yield Prediction</h2>
							</div>
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
						</div>
					</div>
				</div>
				<!-- Total bags -->
				<div class={cardStyle}>
					<div class={cardInsideStyle}>
						<div class="flex items-start">
							<div class="flex items-center">
								<span class="material-symbols-outlined mr-2"> shopping_bag</span>

								<h2 class={h3Style}>Total Bags</h2>
							</div>
						</div>
						<hr class="opacity-50" />

						<div class={smallValueStyle}>
							<h1 class={smallerValueStyle}>
								<strong>
									{#if bagCount}
										<strong> <div class={smallerValueStyle}><h1>{bagCount} bags</h1></div></strong>
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
							<div class="flex items-center">
								<span class="material-symbols-outlined mr-2"> layers</span>

								<h2 class={h3Style}>Total Harvest</h2>
							</div>
						</div>

						<hr class="opacity-50" />
						<div class={smallValueStyle}>
							<h1 class={smallerValueStyle}>
								<strong>
									{#if gramsCount}
										<strong> <div class={smallerValueStyle}><h1>{gramsCount} kg.</h1></div></strong>
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
							<div class="flex items-center">
								<span class="material-symbols-outlined mr-2"> calendar_month</span>

								<h2 class={h3Style}>Last Date Planted</h2>
							</div>
						</div>

						<hr class="opacity-50" />
						<div class={smallValueStyle}>
							<h1 class="flex justify-center items-center text-lg">
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
			</div>
		</div>
	</div>
{/if}
