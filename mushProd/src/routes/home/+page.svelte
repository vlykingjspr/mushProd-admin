<script lang="ts">
	import { currentPageTitle } from '$lib/stores/stores';
	import { Modal, ProgressRadial } from '@skeletonlabs/skeleton';
	import { fade } from 'svelte/transition';
	import { loading } from '$lib/stores/stores';
	import { fetchFarmData } from '$lib/firebase/staticData';
	import { onMount } from 'svelte';
	import { dateFormat, updateTime } from '../../lib/components/Data/DateAndTime';
	import { updateTab } from '../records/pageTab';
	import { getFirestore, collection, addDoc } from 'firebase/firestore';
	import { db } from '$lib/firebase/firebase';
	import { getToken, onMessage } from 'firebase/messaging';
	import { getMessaging } from 'firebase/messaging';

	import { getApp, getApps, initializeApp } from 'firebase/app';

	const getMessage = async () => {
		const firebaseConfig = {
			apiKey: import.meta.env.VITE_APIKEY,
			authDomain: import.meta.env.VITE_AUTH_DOMAIN,
			databaseURL: import.meta.env.VITE_DB_URL,
			projectId: import.meta.env.VITE_PROJECT_ID,
			storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
			messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
			appId: import.meta.env.VITE_APP_ID,
			measurementId: import.meta.env.VITE_MEASUREMENT_ID
		};

		// Initialize Firebase
		let firebaseApp;

		if (!getApps().length) {
			firebaseApp = initializeApp(firebaseConfig);
		} else {
			firebaseApp = getApp();
		}

		const messaging = getMessaging(firebaseApp);

		Notification.requestPermission().then((permission) => {
			if (permission === 'granted') {
				console.log('Notification permission granted.');
			} else {
				console.log('Unable to get permission to notify.');
			}
		});
		// Get the FCM token for the current user
		onMessage(messaging, (payload) => {
			console.log('Message received. ', payload);
		});
		getToken(messaging, {
			vapidKey:
				'BKCGjREYWFg3CLjeSHSwOSR2cy8JsGvtwmsmq3EPAsJU32IKumg1uLilX_01WtKKGEJhq3L-tHoMeCoItVJgHWs'
		})
			.then((currentToken) => {
				if (currentToken) {
					console.log(currentToken);
					// subscribeToTopic(currentToken, "sad")
				} else {
					// Show permission request UI
					console.log('No registration token available. Request permission to generate one.');
					// ...
				}
			})
			.catch((err) => {
				console.log('An error occurred while retrieving token. ', err);
				// ...
			});
	};

	let notification = { title: '', body: '' };

	const sendNotification = async () => {
		const registrationToken =
			'fSJ_Sb21DpwDhvRtM89__C:APA91bH25MZA4a1yVg8p5L0A0XO9gPbdXizSU0zvcxmn8T0F0pnhxn5GuS0WvM0pjBw4e90Zbsg7Do3oEoA5ZuBI4L10D_-fJ8lRsErnpNfI51OFIXAJ-uNu0usFCqWyshePstWZrW7B'; // Replace with the actual device token
		const response = await fetch('/firebaseAdmin/sendNotif', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				registrationToken,
				title: notification.title,
				body: notification.body
			})
		});

		const result = await response.json();
		console.log(result);
	};

	function updatePage(tabNumber: number) {}
	let farmData: any[] = [];
	onMount(async () => {
		farmData = await fetchFarmData();
		getMessage();
	});

	function updateTitle(title: string): void {
		currentPageTitle.set(title);
	}
	const cardStyle = 'card card-hover overflow-hidden ';
	const chartStyle = 'card card-hover bg-surface-100 overflow-hidden ';
	const cardInsideStyle = 'p-4 space-y-4';
	const h2Style = 'text-1xl md:text-2xl lg:text-2xl';
	const valueStyle = 'flex justify-center items-center text-7xl md:text-4xl lg:text-8xl';

	$loading = false;

	let currentTime: any;
	onMount(() => {
		updateTime();

		setInterval(() => {
			currentTime = updateTime(); // Update the time every second
		}, 1000);
	});

	function updateTabs(tabNumber: number) {
		updateTitle('Records');
		updateTab(tabNumber);
	}
	import { getDailyAverage } from '$lib/components/Data/calculateAverage';
	// import { sendNotification } from '$lib/components/Data/addNotification';
	// import { __methods } from '../firebaseAdmin/firebaseAdmin';
</script>

<Modal transitionIn={fade} transitionInParams={{ duration: 200 }} />

{#if $loading}
	<!-- Display the ProgressRadial when isLoading is true -->
	<div class="flex justify-center items-center h-screen">
		<ProgressRadial value={undefined} />
	</div>
{:else}
	<div class=" ml-4">
		<h1 class="h1 mb-10">Welcome to MushProd</h1>
		<!-- <button on:click={() => getDailyAverage()} class="grow btn btn-sm variant-filled-primary"
			>Add Temp
		</button> -->
		<!-- <button on:click={() => handleButtonClick()} class="grow btn btn-sm variant-filled-primary"
			>Add Temp
		</button> -->

		<!-- <input bind:value={notification.title} placeholder="Notification Title" />
		<textarea bind:value={notification.body} placeholder="Notification Body" />

		<button on:click={sendNotification}>Send Notification</button> -->
	</div>
	<div class="flex items-center justify-center">
		<div class="w-full text-token grid sm:grid-cols-1 md:grid-cols-3 gap-4 p-4">
			<div class={`${cardStyle} sm:col-span-1 md:col-span-1`}>
				<div class={cardInsideStyle}>
					{#each farmData as farm}
						<div class="flex items-center">
							<h2 class={h2Style}>
								{farm.farm_name}
							</h2>
							<div class="flex items-center justify-center mr-2 ml-auto">
								<div class="flex flex-col mt-2">
									<div class="">
										<div class="flex items-center justify-center">
											<i class="fa-solid fa-calendar-days mr-2" />
											{dateFormat()}
										</div>
									</div>

									<div class="flex items-center justify-end">
										<i class="fa-solid fa-clock mr-2" />
										{#if currentTime}
											{currentTime}
										{:else}
											<ProgressRadial width="w-5" value={undefined} />
										{/if}
									</div>
								</div>
							</div>
						</div>
						<hr class="opacity-50 mb-2" />
						<p class="">
							<i class="fa-solid fa-user text-base mr-2" />
							{farm.farmer_name}
						</p>
						<p class="">
							<i class="fa-solid fa-location-dot text-base mr-2" />
							{farm.farm_address}
						</p>
					{/each}
				</div>
			</div>
			<div class={cardStyle}>
				<div class={cardInsideStyle}>
					<a href="/dashboard" on:click={() => updateTitle('Dashboard')}>
						<h2 class={h2Style}>Dashboard</h2>
						<hr class="opacity-50 mb-2" />
						<div class={valueStyle}>
							<i class="fa-solid fa-square-poll-vertical fa-md" />
						</div>
					</a>
				</div>
			</div>
			<div class={cardStyle}>
				<div class={cardInsideStyle}>
					<a href="/notification" on:click={() => updateTitle('Notification')}>
						<h2 class={h2Style}>Notification</h2>

						<hr class="opacity-50 mb-2" />

						<div class={valueStyle}>
							<i class="fa-solid fa-bell fa-md" />
						</div>
					</a>
				</div>
			</div>
			<div class={cardStyle}>
				<div class={cardInsideStyle}>
					<a href="/records" on:click={() => updateTabs(0)}>
						<h2 class={h2Style}>Planted Records</h2>

						<hr class="opacity-50 mb-2" />

						<div class={valueStyle}>
							<i class="fa-solid fa-seedling fa-md" />
						</div>
					</a>
				</div>
			</div>
			<div class={cardStyle}>
				<div class={cardInsideStyle}>
					<a href="/records" on:click={() => updateTabs(1)}>
						<h2 class={h2Style}>Harvest Records</h2>

						<hr class="opacity-50 mb-2" />

						<div class={valueStyle}>
							<i class="fa-solid fa-jar-wheat fa-md" />
						</div>
					</a>
				</div>
			</div>
			<!-- <div class={cardStyle}>
				<div class={cardInsideStyle}>
					<a href="/records" on:click={() => updateTabs(2)}>
						<h2 class={h2Style}>Mushroom Records</h2>

						<hr class="opacity-50 mb-2" />

						<div class={valueStyle}>
							<i class="fa-solid fa-clipboard fa-md" />
						</div>
					</a>
				</div>
			</div>
			<div class={cardStyle}>
				<div class={cardInsideStyle}>
					<a href="/records" on:click={() => updateTabs(3)}>
						<h2 class={h2Style}>Removed Bags</h2>

						<hr class="opacity-50 mb-2" />

						<div class={valueStyle}>
							<i class="fa-solid fa-trash fa-md" />
						</div>
					</a>
				</div>
			</div> -->
			<div class={cardStyle}>
				<div class={cardInsideStyle}>
					<a href="/records" on:click={() => updateTabs(4)}>
						<h2 class={h2Style}>Temperature & Humidity</h2>

						<hr class="opacity-50 mb-2" />

						<div class={valueStyle}>
							<i class="fa-solid fa-temperature-high fa-md" />
						</div>
					</a>
				</div>
			</div>
		</div>
	</div>
{/if}
