<script lang="ts">
	// firebase data
	import {
		allPlantedBags,
		allHarvestedGrams,
		LastDateInBagsRecord
	} from '../../lib/firebase/allRecord';
	// chart
	import Chart from '../../lib/components/Charts/Chart.svelte';
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
	import AddBagsModal from '$lib/components/PlantedBags/AddBagsModal.svelte';
	import AddHarvestedModal from '$lib/components/Harvested/AddHarvestedModal.svelte';
	import { fade } from 'svelte/transition';
	import { currentPageTitle, setLoading, report } from '$lib/stores/stores';
	import { format } from 'date-fns';

	// notif
	import { sendNotification } from '$lib/stores/addNotification';

	//getting data
	import { getDatabase, ref, get, query, limitToLast, onValue } from 'firebase/database';

	import { loading } from '$lib/stores/stores';
	import { onMount } from 'svelte';

	let humd: number;
	let temp: number;
	let time: any;
	let bagCount: number;
	let gramsCount: number;
	let lastDatePlanted: any;
	let notificationSent = false;
	let HourAverage: any;
	// getting all data of added bags and grams
	async function fetchData() {
		bagCount = await allPlantedBags();
		gramsCount = await allHarvestedGrams();
		lastDatePlanted = await LastDateInBagsRecord();

		loading.set(false);
	}
	onMount(() => {
		fetchData();
	});

	setLoading(true);
	// creating a current date format
	const currentDate = new Date();
	const formattedDate = format(currentDate, 'yyyy-MM-dd');

	// getting data from firebase
	const rdb = getDatabase();
	const dateRef = ref(rdb, `/BETAPEAK/2023-11-11`);
	// const dateRef = ref(rdb, `/BETAPEAK/${formattedDate}`);

	const queryRef = query(dateRef, limitToLast(1));

	onValue(queryRef, (snapshot) => {
		if (snapshot.exists()) {
			const data = snapshot.val();

			const lastEntryKey = Object.keys(data)[0];
			const lastEntry = data[lastEntryKey];
			humd = lastEntry.Humd;
			temp = lastEntry.Temp;
			time = lastEntry.Time;

			if (24 >= temp && 85 >= humd && 29 <= temp && 95 <= humd) {
				// uncomment to send notif
				// sendNotification(temp, humd);

				notificationSent = true;
			}
			loading.set(false);
		} else {
			console.log('it does not exist');
		}
	});
	// modals
	const modalStore = getModalStore();
	function showAddBagModal(): void {
		const c: ModalComponent = { ref: AddBagsModal };
		const modal: ModalSettings = {
			type: 'component',
			component: c,
			title: '',
			body: '',

			response: (r) => console.log('response:', r)
		};
		modalStore.trigger(modal);
	}
	function showAddHarvestModal(): void {
		const c: ModalComponent = { ref: AddHarvestedModal };
		const modal: ModalSettings = {
			type: 'component',
			component: c,
			title: '',
			body: '',

			response: (r) => console.log('response:', r)
		};
		modalStore.trigger(modal);
	}
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
	const cardInsideStyle = 'p-4 space-y-4';
	const h2Style = 'text-1xl md:text-2xl lg:text-2xl';
	const h3Style = 'text-l md:text-1xl lg:text-1xl';
	const valueStyle = 'flex justify-center items-center text-7xl md:text-4xl lg:text-8xl';
	const smallValueStyle = 'flex justify-center items-center text-5xl';
	const smallerValueStyle = 'flex justify-center items-center text-2xl';

	// Function to generate a random number
	function getRandomNumber() {
		const randomNumber = Math.floor(Math.random() * 100) + 1;
		return randomNumber;
	}
	const val1 = getRandomNumber();
	const val2 = val1 + 5;
</script>

<Modal transitionIn={fade} transitionInParams={{ duration: 200 }} />

{#if $loading}
	<!-- Display the ProgressRadial when isLoading is true -->
	<div class="flex justify-center items-center h-screen">
		<ProgressRadial value={undefined} />
	</div>
{:else}
	<!-- Display the page content when isLoading is false -->
	<div class="w-full text-token grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
		<!-- Temperature -->
		<div class={cardStyle}>
			<span class="ml-2"> Last update on {time}</span>
			<div class={cardInsideStyle}>
				<h2 class={h2Style}>Temperature</h2>
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
			<div class={cardInsideStyle}>
				<h2 class={h2Style}>Humidity</h2>
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
				<a href="/records" on:click={() => updateTitle('Records')}>
					<div>
						<h3 class={h3Style}>Total Bags</h3>
						<hr class="opacity-50" />

						<div class="flex items-center justify-between">
							<div>
								{#if bagCount}
									<strong><div class={smallerValueStyle}><h1>{bagCount} bags</h1></div></strong>
								{:else}
									<div class="flex justify-center items-center">
										<ProgressRadial width="w-10" value={undefined} />
									</div>
								{/if}
							</div>
							<div class="flex justify-center align-center space-x-4 m-4">
								<button class="grow btn btn-sm variant-filled-primary" on:click={showAddBagModal}
									>Add Bags</button
								>
							</div>
						</div>
					</div>
					<div>
						<h3 class={h3Style}>Total Harvest (October)</h3>
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
							<div class="flex justify-center align-center space-x-4 m-4">
								<button
									class="grow btn btn-sm variant-filled-primary"
									on:click={showAddHarvestModal}>Add Harvest</button
								>
							</div>
						</div>
					</div>
				</a>
			</div>
		</div>
		<div class={`md:col-span-2 `}>
			<div class={`p-4  ${cardStyle}`}>
				<div class={`p-4 bg-surface-100  `}>
					<Chart />
				</div>
			</div>
		</div>
		<div class="">
			<div class={`mb-3 ${cardStyle}`}>
				<div class={cardInsideStyle}>
					<h2 class={h2Style}>Last Date Planted</h2>
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
					<h2 class={h2Style}>Yield Prediction</h2>
					<hr class="opacity-50" />
					<div class="">
						<div class={smallerValueStyle}>
							<strong> <h1>{val1}g - {val2}g</h1> </strong>
						</div>
						<div class="flex justify-center align-center space-x-4 m-4">
							<button class="grow btn btn-sm variant-filled-primary" on:click={showReportModal}
								>Generate Report</button
							>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
