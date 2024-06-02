<script lang="ts">
	import { getDrawerStore, Toast, type ModalSettings } from '@skeletonlabs/skeleton';
	import { currentPageTitle } from '$lib/stores/stores';
	import { Avatar } from '@skeletonlabs/skeleton';
	import { authHandlers } from '$lib/stores/Authstore';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import { loading, setLoading } from '$lib/stores/stores';
	import { fetchFarmData } from '$lib/firebase/staticData';
	import { updateTab } from '../../routes/records/pageTab';
	import { notificationVisited } from '$lib/stores/modalNotifStore';

	let farmData: any[] = [];
	onMount(async () => {
		farmData = await fetchFarmData();
	});
	const modalStore = getModalStore();
	const drawerStore = getDrawerStore();

	function updateTitle(title: string): void {
		currentPageTitle.set(title);
	}

	let showLogoutModal = false;
	function closeLogoutModal(): void {
		showLogoutModal = false;
	}
	function logOut(): void {
		const modal: ModalSettings = {
			type: 'confirm',
			// Data
			title:
				'<i class="fa-solid fa-right-from-bracket"></i> Please Confirm<hr class="opacity-50" /> ',
			body: ' Are you sure you wish to proceed?',

			response: async (confirmed: boolean) => {
				if (confirmed) {
					await Promise.resolve();
					await authHandlers.logout();
				}
				closeLogoutModal();
			}
		};
		modalStore.trigger(modal);
	}
	function updateTabs(tabNumber: number) {
		updateTitle('Records');
		updateTab(tabNumber);
	}
</script>

<nav class="list-nav">
	<div class="mt-5 flex justify-center items-center">
		<a href="/home" on:click={() => updateTitle('')}>
			<Avatar
				initials="BF"
				border="border-4 border-surface-300-600-token hover:!border-primary-500"
			/></a
		>
	</div>
	<div class="mb-4 ml-3 pl-2">
		{#each farmData as farm}
			<p class="mr-2 flex items-center">
				<strong>
					<span class="material-symbols-outlined mr-2 mb-2"> potted_plant </span>
					{farm.farm_name}
				</strong>
			</p>
			<p class="mr-2 flex items-center text-xs">
				<span class="material-symbols-outlined mr-3"> pin_drop </span>
				{farm.farm_address}
			</p>
		{/each}
	</div>

	<hr />

	<ul>
		<li class="mt-4 pl-2">
			<a class=" mb-4 font-bold text-lg" href="/home" on:click={() => updateTitle('')}>
				<span class="material-symbols-outlined"> home </span>

				<span><h1 class="text-sm">HOME</h1></span>
			</a>
		</li>
		<li data-sveltekit-preload-data="hover" class="mt-4 pl-2">
			<a class="font-bold text-lg" href="/dashboard" on:click={() => updateTitle('Dashboard')}>
				<span class="material-symbols-outlined"> dashboard </span>
				<span><h1 class="text-sm">DASHBOARD</h1></span></a
			>
		</li>

		<li class="mt-8 pl-2">
			<a class="mt-4 font-bold text-lg" href="/records/batch" on:click={() => updateTabs(0)}>
				<span class="material-symbols-outlined"> folder_open </span>
				<span><h1 class="text-sm">RECORDS</h1></span></a
			>
		</li>

		<li class="mt-8 pl-2 relative inline-block">
			<span
				style={!$notificationVisited ? 'display:flex ;' : 'display: none;'}
				class="badge-icon variant-filled-error absolute -top-0 -right-0 z-10"
			/>

			<a
				class=" mt-4 mb-4 font-bold text-lg"
				href="/notification"
				on:click={() => updateTitle('Notification')}
			>
				<span class="material-symbols-outlined"> notifications_active </span>
				<span> <h1 class="text-sm">NOTIFICATIONS</h1></span>
			</a>
		</li>

		<li class="mt-8 pl-2">
			<a
				class=" mt-4 mb-4 font-bold text-lg"
				href="/report/growing-bag"
				on:click={() => updateTitle('Report')}
			>
				<span class="material-symbols-outlined"> description </span>
				<span><h1 class="text-sm">REPORT</h1></span></a
			>
		</li>

		<hr />
		<li class=" pl-2">
			<!-- svelte-ignore a11y-invalid-attribute -->
			<a class=" mt-4 font-bold text-lg" href="#" on:click={logOut}>
				<span class="material-symbols-outlined"> logout </span>
				<span><h1 class="text-sm">LOG OUT</h1></span></a
			>
		</li>
	</ul>
</nav>
