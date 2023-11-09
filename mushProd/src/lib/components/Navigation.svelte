<script lang="ts">
	import { getDrawerStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import { currentPageTitle } from '$lib/stores/stores';
	import { Avatar, ProgressRadial } from '@skeletonlabs/skeleton';
	import { authHandlers } from '$lib/stores/Authstore';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import { loading } from '$lib/stores/stores';
	import { fetchFarmData } from '$lib/firebase/staticData';
	let farmData: any[] = [];
	onMount(async () => {
		farmData = await fetchFarmData();
	});
	const modalStore = getModalStore();
	const drawerStore = getDrawerStore();
	function drawerClose(): void {
		drawerStore.close();
	}
	onMount(() => {
		isLoggingOut = false; // Initially, the loader is hidden
	});
	function updateTitle(title: string): void {
		currentPageTitle.set(title);
		// drawerClose();
	}
	let showLogoutModal = false;
	let isLoggingOut = false;

	function closeLogoutModal(): void {
		showLogoutModal = false;
	}
	function logOut(): void {
		const modal: ModalSettings = {
			type: 'confirm',
			// Data
			title: 'Please Confirm',
			body: 'Are you sure you wish to proceed?',
			// TRUE if confirm pressed, FALSE if cancel pressed
			response: async (confirmed: boolean) => {
				if (confirmed) {
					loading.set(false);
					isLoggingOut = true; // Set the loading state to true
					await Promise.resolve();
					await authHandlers.logout(); // Call the logout function
					isLoggingOut = false; // Set the loading state back to false
				}
				closeLogoutModal();
			}
		};
		modalStore.trigger(modal);
	}
</script>

{#if isLoggingOut}
	<!-- Show a loading screen while logging out -->
	<div class="flex justify-center items-center h-screen">
		<ProgressRadial value={undefined} />
	</div>
{:else}
	<nav class="list-nav">
		<div class="mt-5 flex justify-center items-center">
			<Avatar
				initials="VK"
				border="border-4 border-surface-300-600-token hover:!border-primary-500"
				cursor="cursor-pointer"
			/>
		</div>
		<div class="mb-4 ml-3">
			<h1>betaPeak@gmail.com</h1>
		</div>

		<hr />
		<ul class="">
			<li class="mt-4">
				<a class="font-bold text-lg" href="/dashboard" on:click={() => updateTitle('Dashboard')}>
					<i class="fa-solid fa-square-poll-vertical fa-xl" />
					<span>DASHBOARD</span></a
				>
			</li>
			<li class="mt-8">
				<a class="mt-4 font-bold text-lg" href="/records" on:click={() => updateTitle('Records')}>
					<i class="fa-solid fa-clipboard fa-xl" />
					<span>RECORDS</span></a
				>
			</li>
			<li class="mt-8">
				<a
					class=" mt-4 mb-4 font-bold text-lg"
					href="/notification"
					on:click={() => updateTitle('Notification')}
				>
					<i class="fa-solid fa-bell fa-xl" />
					<span>NOTIFICATION</span></a
				>
			</li>
			<li class="mt-8">
				<a class=" mt-4 mb-4 font-bold text-lg" href="/yield" on:click={() => updateTitle('Yield')}>
					<i class="fa-solid fa-weight-scale fa-xl" />
					<span>YIELD</span></a
				>
			</li>
			<hr />
			<li>
				<!-- svelte-ignore a11y-invalid-attribute -->
				<a class=" mt-4 font-bold text-lg" href="#" on:click={logOut}>
					<i class="fa-solid fa-right-from-bracket fa-xl" />
					<span>LOG OUT</span></a
				>
			</li>
		</ul>
	</nav>
{/if}
