<script lang="ts">
	import { getDatabase, ref, get, query, limitToLast, onValue } from 'firebase/database';
	import { onDestroy, onMount } from 'svelte';
	import { auth, db } from '../lib/firebase/firebase';
	import { getDoc, doc, setDoc, type DocumentData } from 'firebase/firestore';
	import { authStore } from '../lib/stores/Authstore';
	import { loading, setLoading } from '$lib/stores/stores';
	import '../app.postcss';
	import { ProgressRadial, setInitialClassState } from '@skeletonlabs/skeleton';

	import {
		AppShell,
		AppBar,
		Drawer,
		getDrawerStore,
		storePopup,
		LightSwitch,
		Toast,
		getToastStore
	} from '@skeletonlabs/skeleton';
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	//page title and nav bar
	import Navigation from '$lib/components/Navigation.svelte';
	import PageTitle from '$lib/components/PageTitle.svelte';
	import Footer from '$lib/components/Footer.svelte';

	import Authenticate from '$lib/components/Authenticate.svelte';
	import { format } from 'date-fns';
	import { dateFormat, updateTime } from '$lib/components/Data/DateAndTime';
	import { saveMessagingDeviceToken } from '$lib/firebase/messaging';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	// // modals
	import { fade } from 'svelte/transition';
	import { Modal } from '@skeletonlabs/skeleton';
	import { getModalStore } from '@skeletonlabs/skeleton';

	import { initializeStores } from '@skeletonlabs/skeleton';
	import { initializeNotificationsStore } from '$lib/stores/modalNotifStore';

	// const modalStore = getModalStore();
	initializeStores();

	const drawerStore = getDrawerStore();
	function drawerOpen(): void {
		drawerStore.open();
	}

	const nonAuthRoutes = ['/'];
	let users: boolean = false;
	let humd: number;
	let temp: number;
	let time: any;

	let lastNotificationTime: any = null;
	const currentDate = new Date();

	const formattedDate = format(currentDate, 'yyyy-MM-dd');
	const rdb = getDatabase();
	// const dateRef = ref(rdb, `/BETAPEAK/2024-04-23`);
	const dateRef = ref(rdb, `BETAPEAK/${formattedDate}`);
	let currentTime: any;
	let executedToday = false;
	let timeoutId: NodeJS.Timeout | null = null;

	function executeAtSpecificTime(hour: number, minute: number, second: number) {
		// Calculate the time until the specified
		const now = new Date();
		const targetTime = new Date(now);
		targetTime.setHours(hour, minute, second, 0);
		let timeUntilTargetTime = targetTime.getTime() - now.getTime();

		if (timeUntilTargetTime <= 0) {
			targetTime.setDate(targetTime.getDate() + 1);
			timeUntilTargetTime = targetTime.getTime() - now.getTime();
			executedToday = false;
		}

		timeoutId = setTimeout(() => {
			if (!executedToday) {
				// getDailyAverage();
				executedToday = true;
				// You can add additional code here if needed
			}

			// Call the function recursively to schedule the next day's execution at the same time
			executeAtSpecificTime(hour, minute, second);
		}, timeUntilTargetTime);

		return timeoutId;
	}

	// Example usage:
	function myDailyTask() {
		console.log('Executing at a specific time each day...');
		// Put your daily task code here
	}

	// Schedule the function to execute at 3:30 PM (15:30) each day
	const modalStore = getModalStore();
	let notificationsStore: any;

	onMount(() => {
		initializeNotificationsStore(modalStore);

		timeoutId = executeAtSpecificTime(23, 59, 1);
		setLoading(false);
		const unsubscribe = auth.onAuthStateChanged(async (user) => {
			const currentPath = window.location.pathname;

			if (!user && !nonAuthRoutes.includes(currentPath)) {
				window.location.href = '/';

				users = false; // Set users to false when not logged in
				return;
			}

			if (user && currentPath === '/') {
				window.location.href = '/home';

				return;
			}
			if (!user) {
				users = false;
				return;
			}
			if (user) {
				users = true;
				let dataToSetToStore: DocumentData;
				const docRef = doc(db, 'users', user.uid);
				saveMessagingDeviceToken(user.uid);
				const docSnap = await getDoc(docRef);
			}
		});

		const queryRef = query(dateRef, limitToLast(1));

		return unsubscribe;
	});
</script>

{#if users}
	<Drawer>
		<Navigation />
	</Drawer>
	<Modal transitionIn={fade} transitionInParams={{ duration: 200 }} />
	<AppShell slotSidebarLeft="w-0 md:w-52 bg-secondary-500  " slotLead="bg-tertiary-500">
		<svelte:fragment slot="sidebarLeft">
			<Navigation />
		</svelte:fragment>
		<div class="container mx-auto">
			{#if $loading}
				<div class="flex justify-center items-center h-screen">
					<ProgressRadial value={undefined} />
				</div>
			{:else}
				<slot />
			{/if}
		</div>
		<svelte:fragment slot="pageHeader">
			<AppBar
				gridColumns="grid-cols-3"
				slotDefault="place-self-center "
				slotTrail="place-content-end"
			>
				<svelte:fragment slot="lead">
					<button class="md:hidden btn btn-sm mr-4" on:click={drawerOpen}>
						<span>
							<svg viewBox="0 0 100 80" class="fill-token w-4 h-4">
								<rect width="100" height="20" />
								<rect y="30" width="100" height="20" />
								<rect y="60" width="100" height="20" />
							</svg>
						</span>
					</button>
				</svelte:fragment>
				<div class=" flex justify-between items-center">
					<span class="material-symbols-outlined"> psychiatry </span>
					<h1>MushProd</h1>
				</div>

				<svelte:fragment slot="trail">
					<LightSwitch />
				</svelte:fragment>
			</AppBar>
			<PageTitle /></svelte:fragment
		>
		<!-- Router Slot -->

		<!-- (pageFooter) -->
		<svelte:fragment slot="footer"><Footer /></svelte:fragment>
	</AppShell>
{:else}
	<Authenticate />
{/if}

<style>
</style>
