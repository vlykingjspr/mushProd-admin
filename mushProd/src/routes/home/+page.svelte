<script lang="ts">
	import { currentPageTitle } from '$lib/stores/stores';
	import { Modal, ProgressRadial } from '@skeletonlabs/skeleton';
	import { fade } from 'svelte/transition';
	import { loading } from '$lib/stores/stores';
	import { fetchFarmData } from '$lib/firebase/staticData';
	import { onMount } from 'svelte';
	import { dateFormat, updateTime } from '../../lib/components/Data/DateAndTime';
	import { updateTab } from '../records/pageTab';

	import { getModalStore } from '@skeletonlabs/skeleton';

	let farmData: any[] = [];
	onMount(async () => {
		farmData = await fetchFarmData();
		// getMessage();
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
</script>

{#if $loading}
	<!-- Display the ProgressRadial when isLoading is true -->
	<div class="flex justify-center items-center h-screen">
		<ProgressRadial value={undefined} />
	</div>
{:else}
	<Modal transitionIn={fade} transitionInParams={{ duration: 200 }} />

	<div class=" ml-4">
		<h1 class="h1 mb-10">Welcome to MushProd</h1>
	</div>
	<div class="flex items-center justify-center">
		<div class="w-full text-token grid sm:grid-cols-1 md:grid-cols-4 gap-4 p-4">
			<div class={`${cardStyle} sm:col-span-1 md:col-span-4 lg:col-span-4`}>
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
											<span class="material-symbols-outlined mr-2"> calendar_month </span>
											{dateFormat()}
										</div>
									</div>

									<div class="flex items-center justify-end">
										<!-- <i class="fa-solid fa-clock mr-2" /> -->
										<span class="material-symbols-outlined mr-2"> schedule </span>
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
						<p class="flex items-center">
							<!-- <i class="fa-solid fa-user text-base mr-2" /> -->
							<span class="material-symbols-outlined mr-2"> person </span>
							{farm.farmer_name}
						</p>
						<p class="flex items-center">
							<!-- <i class="fa-solid fa-location-dot text-base mr-2" /> -->
							<span class="material-symbols-outlined mr-2"> pin_drop </span>
							{farm.farm_address}
						</p>
					{/each}
				</div>
			</div>

			<div class={`${cardStyle} sm:col-span-1 md:col-span-2 lg:col-span-1`}>
				<div class={cardInsideStyle}>
					<a href="/dashboard" on:click={() => updateTitle('Dashboard')}>
						<h2 class={h2Style}>Dashboard</h2>
						<hr class="opacity-50 mb-2" />
						<div class={valueStyle}>
							<!-- <i class="fa-solid fa-square-poll-vertical fa-md" /> -->
							<span class="material-symbols-outlined text-7xl md:text-4xl lg:text-8xl">
								dashboard
							</span>
						</div>
					</a>
				</div>
			</div>

			<div class={`${cardStyle} sm:col-span-1 md:col-span-2 lg:col-span-1`}>
				<div class={cardInsideStyle}>
					<a href="/records/batch" on:click={() => updateTabs(1)}>
						<h2 class={h2Style}>Batch Records</h2>

						<hr class="opacity-50 mb-2" />

						<div class={valueStyle}>
							<!-- <i class="fa-solid fa-jar-wheat fa-md" /> -->
							<span class="material-symbols-outlined text-7xl md:text-4xl lg:text-8xl">
								folder_open
							</span>
						</div>
					</a>
				</div>
			</div>

			<div class={`${cardStyle} sm:col-span-1 md:col-span-2 lg:col-span-1`}>
				<div class={cardInsideStyle}>
					<a href="/records/temp&humid" on:click={() => updateTabs(4)}>
						<h2 class="text-sm md:text-lg lg:text-1xl mb-1">Temperature & Humidity</h2>

						<hr class="opacity-50 mb-2" />

						<div class={valueStyle}>
							<!-- <i class="fa-solid fa-temperature-high fa-md" /> -->
							<span class="material-symbols-outlined text-7xl md:text-4xl lg:text-8xl">
								thermostat
							</span>
						</div>
					</a>
				</div>
			</div>
			<div class={`${cardStyle} sm:col-span-1 md:col-span-2 lg:col-span-1`}>
				<div class={cardInsideStyle}>
					<a href="/notification" on:click={() => updateTitle('Notification')}>
						<h2 class={h2Style}>Notification</h2>

						<hr class="opacity-50 mb-2" />

						<div class={valueStyle}>
							<!-- <i class="fa-solid fa-bell fa-md" /> -->
							<span class="material-symbols-outlined text-7xl md:text-4xl lg:text-8xl">
								notifications_active
							</span>
						</div>
					</a>
				</div>
			</div>
			<div class={`${cardStyle} sm:col-span-1 md:col-span-2 lg:col-span-1`}>
				<div class={cardInsideStyle}>
					<a href="/report/growing-bag" on:click={() => updateTitle('Report')}>
						<h2 class={h2Style}>Report</h2>

						<hr class="opacity-50 mb-2" />

						<div class={valueStyle}>
							<!-- <i class="fa-solid fa-sheet-plastic fa-md" /> -->
							<span class="material-symbols-outlined text-7xl md:text-4xl lg:text-8xl">
								description
							</span>
						</div>
					</a>
				</div>
			</div>
		</div>
	</div>
{/if}
