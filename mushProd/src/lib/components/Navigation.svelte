<script lang="ts">
	import { getDrawerStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import { currentPageTitle } from '$lib/stores/stores';
	import { Avatar, ProgressRadial } from '@skeletonlabs/skeleton';
	import { authHandlers } from '$lib/stores/Authstore';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import { loading, setLoading } from '$lib/stores/stores';
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
					setLoading(true);
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
	const style = 'mr-2';
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
				initials="BF"
				border="border-4 border-surface-300-600-token hover:!border-primary-500"
			/>
		</div>
		<div class="mb-4 ml-3 pl-2">
			{#each farmData as farm}
				<p class={style}><strong>{farm.farm_name}</strong></p>
				<p class={style}>{farm.farm_address}</p>
			{/each}
		</div>

		<hr />

		<ul class="">
			<li class="mt-4 pl-2">
				<a class=" mb-4 font-bold text-lg" href="/home" on:click={() => updateTitle('')}>
					<i class="fa-solid fa-home fa-md" />
					<span><h1 class="text-sm">HOME</h1></span>
				</a>
			</li>
			<li class="mt-4 pl-2">
				<a class="font-bold text-lg" href="/dashboard" on:click={() => updateTitle('Dashboard')}>
					<i class="fa-solid fa-square-poll-vertical fa-md" />
					<span><h1 class="text-sm">DASHBOARD</h1></span></a
				>
			</li>
			<li class="mt-8 pl-2">
				<a class=" mt-4 mb-4 font-bold text-lg" href="/yield" on:click={() => updateTitle('Yield')}>
					<i class="fa-solid fa-weight-scale fa-md" />
					<span><h1 class="text-sm">YIELD</h1></span></a
				>
			</li>
			<li class="mt-8 pl-2">
				<a class="mt-4 font-bold text-lg" href="/records" on:click={() => updateTitle('Records')}>
					<i class="fa-solid fa-clipboard fa-md" />
					<span><h1 class="text-sm">RECORDS</h1></span></a
				>
			</li>
			<li class="mt-8 pl-2">
				<a
					class=" mt-4 mb-4 font-bold text-lg"
					href="/notification"
					on:click={() => updateTitle('Notification')}
				>
					<i class="fa-solid fa-bell fa-md" />
					<span><h1 class="text-sm">NOTIFICATIONS</h1></span></a
				>
			</li>

			<hr />
			<li class=" pl-2">
				<!-- svelte-ignore a11y-invalid-attribute -->
				<a class=" mt-4 font-bold text-lg" href="#" on:click={logOut}>
					<i class="fa-solid fa-right-from-bracket fa-md" />
					<span><h1 class="text-sm">LOG OUT</h1></span></a
				>
			</li>
		</ul>
	</nav>
{/if}
