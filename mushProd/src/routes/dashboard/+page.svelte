<script lang="ts">
	// firebase data
	import { onMount } from 'svelte';
	import { fetchFarmData } from '$lib/firebase/staticData';

	import {
		Avatar,
		Modal,
		ProgressRadial,
		type ModalComponent,
		type ModalSettings
	} from '@skeletonlabs/skeleton';
	// modal
	import { getModalStore } from '@skeletonlabs/skeleton';

	import AddBagsModal from '$lib/components/PlantedBags/AddBagsModal.svelte';
	import AddHarvestedModal from '$lib/components/Harvested/AddHarvestedModal.svelte';
	import { fade } from 'svelte/transition';
	import { currentPageTitle } from '$lib/stores/stores';

	// notif
	import { sendNotification } from '$lib/stores/addNotification';
	//getting data
	import { getDatabase, ref, get, query, limitToLast, onValue } from 'firebase/database';

	import { loading } from '$lib/stores/stores';

	// getting all grams and bags
	import {
		allPlantedBags,
		allHarvestedGrams,
		LastDateInBagsRecord
	} from '../../lib/firebase/allRecord';
	import type { Timestamp } from 'firebase/firestore';

	const rdb = getDatabase();
	const dateRef = ref(rdb, '/BETAPEAK/1970-1-1/sensorData');
	const bagsRecordRef = ref(rdb, 'user/123456/bags record');
	// Create a query to get the last child (latest data)
	const queryRef = query(dateRef, limitToLast(1));
	// Set up a real-time listener to listen for changes in the last child
	let tableData: any[] = [];
	let humd: number;
	let temp: number;
	let time: any;
	let bagCount: number;
	let gramsCount: number;
	let lastDatePlanted: Timestamp;
	let notificationSent = false;
	let isLoading = true;
	async function fetchData() {
		bagCount = await allPlantedBags();
		gramsCount = await allHarvestedGrams();
		lastDatePlanted = await LastDateInBagsRecord();
		loading.set(false);
	}
	fetchData();
	onValue(queryRef, (snapshot) => {
		if (snapshot.exists()) {
			const data = snapshot.val();
			const lastEntryKey = Object.keys(data)[0]; // Get the key of the last entry
			const lastEntry = data[lastEntryKey];
			humd = lastEntry.Humd;
			temp = lastEntry.Temp;
			time = lastEntry.Time;
			console.log(temp);
			if (24 >= temp && 85 >= humd && 29 <= temp && 95 <= humd) {
				// uncomment to send notif
				// sendNotification(temp, humd);
				console.log('notifcation sent');
				notificationSent = true;
			}
			loading.set(false);
			isLoading = false;
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
	const cardStyle = 'card card-hover overflow-hidden ';
	const cardInsideStyle = 'p-4 space-y-4';
	const h2Style = 'text-1xl md:text-2xl lg:text-4xl';
	const h3Style = 'text-l md:text-1xl lg:text-2xl';
	const valueStyle = 'flex justify-center items-center text-9xl md:text-7xl lg:text-8xl';
	const smallValueStyle = 'flex justify-center items-center text-5xl';
	const smallerValueStyle = 'flex justify-center items-center text-4xl';

	// Function to generate a random number
	function getRandomNumber() {
		// Generate a random number between 1 and 100 (you can adjust the range as needed)
		const randomNumber = Math.floor(Math.random() * 100) + 1;
		return randomNumber;
	}
	const val1 = getRandomNumber();
	const val2 = val1 + 5;

	// chart
	import Chart from '../../lib/components/Charts/Chart.svelte';
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
			<div class={cardInsideStyle}>
				<h2 class={h2Style}>Temperature</h2>
				<hr class="opacity-50" />
				<div class={valueStyle}><h1>{temp}°C</h1></div>
			</div>
		</div>
		<!-- Humidity -->
		<div class={cardStyle}>
			<div class={cardInsideStyle}>
				<h2 class={h2Style}>Humidity</h2>
				<hr class="opacity-50" />
				<div class={valueStyle}><h1>{humd}%</h1></div>
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
								<strong><div class={smallerValueStyle}><h1>{bagCount} bags</h1></div></strong>
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
								<strong><div class={smallerValueStyle}><h1>{gramsCount} kg.</h1></div></strong>
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
		<div class={`md:col-span-2`}>
			<div class={`p-4 ${cardStyle}`}>
				<Chart />
			</div>
		</div>
		<div class="">
			<div class={`mb-3 ${cardStyle}`}>
				<div class={cardInsideStyle}>
					<h2 class={h2Style}>Last Date Planted</h2>
					<hr class="opacity-50" />
					<div class={smallValueStyle}>
						<strong> <h1>{lastDatePlanted}</h1> </strong>
					</div>
				</div>
			</div>
			<div class={cardStyle}>
				<div class={cardInsideStyle}>
					<h2 class={h2Style}>Yield Prediction</h2>
					<hr class="opacity-50" />
					<div class={smallValueStyle}>
						<strong> <h1>{val1}g - {val2}g</h1> </strong>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
