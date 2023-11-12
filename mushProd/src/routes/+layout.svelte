<script lang="ts">
	import { onMount } from 'svelte';
	import { auth, db } from '../lib/firebase/firebase';
	import { getDoc, doc, setDoc, type DocumentData } from 'firebase/firestore';
	import { authStore } from '../lib/stores/Authstore';
	import { loading, setLoading } from '$lib/stores/stores';
	import '../app.postcss';
	import { ProgressRadial, setInitialClassState } from '@skeletonlabs/skeleton';
	import { initializeStores } from '@skeletonlabs/skeleton';
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
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
	let loadingDelay: NodeJS.Timeout;

	initializeStores();
	const drawerStore = getDrawerStore();
	function drawerOpen(): void {
		drawerStore.open();
	}

	const nonAuthRoutes = ['/'];
	let users: boolean = false;
	onMount(() => {
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
				const docSnap = await getDoc(docRef);
			}
		});
		return unsubscribe;
	});
</script>

{#if users}
	<Drawer>
		<Navigation />
	</Drawer>

	<AppShell slotSidebarLeft="w-0 md:w-52 bg-primary-200/10" slotHeader="bg-primary-500">
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
					<i class="fa-brands fa-envira fa-lg" />
					<h1>MushProd</h1>
				</div>

				<svelte:fragment slot="trail"><LightSwitch /></svelte:fragment>
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
