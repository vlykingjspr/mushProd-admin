<script lang="ts">
	import { currentPageTitle } from '$lib/stores/stores';
	import { Modal, ProgressRadial } from '@skeletonlabs/skeleton';
	import { fade } from 'svelte/transition';
	import { loading } from '$lib/stores/stores';

	import { format } from 'date-fns';
	import { fetchFarmData } from '$lib/firebase/staticData';
	import { onMount } from 'svelte';
	let farmData: any[] = [];
	onMount(async () => {
		farmData = await fetchFarmData();
	});

	function updateTitle(title: string): void {
		currentPageTitle.set(title);
	}
	const cardStyle = 'card card-hover overflow-hidden ';
	const chartStyle = 'card card-hover bg-surface-100 overflow-hidden ';
	const cardInsideStyle = 'p-4 space-y-4';
	const h2Style = 'text-1xl md:text-2xl lg:text-2xl';
	const valueStyle = 'flex justify-center items-center text-7xl md:text-4xl lg:text-8xl';

	const currdate = new Date();
	const currdateformatted = format(currdate, 'MMMM dd, yyyy');

	$loading = false;

	let currentTime: any;

	onMount(() => {
		updateTime();
		// Update the time every second
		setInterval(updateTime, 1000);
	});

	function updateTime() {
		const now = new Date();
		let hours = now.getHours();
		const minutes = now.getMinutes().toString().padStart(2, '0');
		const seconds = now.getSeconds().toString().padStart(2, '0');

		// Convert hours to 12-hour format and determine AM/PM
		const ampm = hours >= 12 ? 'PM' : 'AM';
		hours = hours % 12 || 12;

		currentTime = `${hours}:${minutes}:${seconds} ${ampm}`;
	}
</script>

<Modal transitionIn={fade} transitionInParams={{ duration: 200 }} />

{#if $loading}
	<!-- Display the ProgressRadial when isLoading is true -->
	<div class="flex justify-center items-center h-screen">
		<ProgressRadial value={undefined} />
	</div>
{:else}
	<div class=" ml-4">
		<div class="flex items-center justify-end mr-2">
			<div class="h4 mr-8">
				<i class="fa-solid fa-clock" />
				{currentTime}
			</div>
			<div class="h4">
				<i class="fa-solid fa-calendar-days" />
				{currdateformatted}
			</div>
		</div>
		<h1 class="h1 mb-10">Welcome to MushProd</h1>

		<div class="mb-4 ml-3 pl-2">
			{#each farmData as farm}
				<p class="">
					<i class="fa-solid fa-user text-base mr-2" />
					<strong>{farm.farmer_name}</strong>
				</p>
				<p class="">
					<i class="fa-solid fa-location-dot text-base mr-2" />
					{farm.farm_address}
				</p>
				<p class="">
					<i class="fa-solid fa-tractor text-base mr-2" />
					{farm.farm_name}
				</p>
			{/each}
		</div>
	</div>

	<div class="w-full text-token grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
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
				<a href="/records" on:click={() => updateTitle('Records')}>
					<h2 class={h2Style}>Records</h2>

					<hr class="opacity-50 mb-2" />

					<div class={valueStyle}>
						<i class="fa-solid fa-clipboard fa-md" />
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
	</div>
{/if}
