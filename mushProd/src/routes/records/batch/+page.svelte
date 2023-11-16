<script lang="ts">
	import { Modal, ProgressRadial, getModalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings, ModalComponent } from '@skeletonlabs/skeleton';
	import { fade } from 'svelte/transition';
	import { Paginator } from '@skeletonlabs/skeleton';
	// modals
	import AddModal from '$lib/components/PlantedBags/AddBagsModal.svelte';
	import UpdateModal from '$lib/components/PlantedBags/UpdateBagsModal.svelte';
	import DeleteModal from '$lib/components/PlantedBags/RemoveBagsModal.svelte';
	import ModalRecordPlanted from '$lib/components/PlantedBags/ModalRecordPlanted.svelte';
	import { planted } from '$lib/stores/stores';

	// toast
	import { Toast, getToastStore } from '@skeletonlabs/skeleton';
	import type { ToastSettings, ToastStore } from '@skeletonlabs/skeleton';

	// getting data
	import { collection, getDocs, query, doc, onSnapshot, orderBy } from 'firebase/firestore';
	import { db } from '$lib/firebase/firebase';
	import { format } from 'date-fns';
	import { onDestroy, onMount } from 'svelte';
	import { allPlantedBags } from '../../../lib/firebase/allRecord';
	let source: any = [];

	let isLoading = true;
	// Function to calculate the total number of bags
	let searchQuery = '';

	let bagCount: number;
	async function fetchData() {
		bagCount = await allPlantedBags();
	}

	const toastStore = getToastStore();
	const t: ToastSettings = {
		message: 'This message will auto-hide after 10 seconds.',
		timeout: 10000
	};
	function updated() {
		toastStore.trigger(t);
	}
	// Create a Firestore listener and initialize tableData
	onMount(async () => {
		const userDocRef = doc(db, 'user', '123456');
		const bagsRecordCollectionRef = collection(userDocRef, 'bags record');
		const q = query(bagsRecordCollectionRef, orderBy('date', 'asc'));

		const unsubscribe = onSnapshot(q, (querySnapshot) => {
			source = [];

			querySnapshot.forEach((doc) => {
				const data = doc.data();
				// Ensure that the `date` field is a valid Firestore Timestamp
				if (data.date && data.date.toDate) {
					// Convert Firestore Timestamp to JavaScript Date
					data.date = format(data.date.toDate(), 'MMMM dd, yyyy');
				}
				// Add the ID to the data object
				data.id = doc.id;
				// tableData.push(data);
				source.push(data);
			});

			fetchData();
			isLoading = false;
		});

		// Don't forget to unsubscribe when your component is no longer needed
	});

	$: {
		paginationSettings.size = source.length;
	}
	let paginationSettings = {
		page: 0,
		limit: 5, // Number of items to display per page
		size: source.length, // Total number of items
		amounts: [1, 2, 5, 10] // Available amounts for the paginator
	};

	$: paginatedSource = source.slice(
		paginationSettings.page * paginationSettings.limit,
		paginationSettings.page * paginationSettings.limit + paginationSettings.limit
	);

	//Modals for clicking data
	const modalStore = getModalStore();
	function modalData(row: any): void {
		const c: ModalComponent = { ref: ModalRecordPlanted };
		planted.set({
			id: row.id,
			date: row.date,
			quantity: row.quantity,
			remarks: row.remarks
		});
		const modal: ModalSettings = {
			type: 'component',
			component: c,
			title: '',
			body: ''
		};
		modalStore.trigger(modal);
	}
	function showAddModal(): void {
		const c: ModalComponent = { ref: AddModal };
		const modal: ModalSettings = {
			type: 'component',
			component: c,
			title: '',
			body: ''
		};
		modalStore.trigger(modal);
	}
	function showUpdateModal(row: any): void {
		const c: ModalComponent = { ref: UpdateModal };
		planted.set({
			id: row.id,
			date: row.date,
			quantity: row.quantity,
			remarks: row.remarks
		});
		const modal: ModalSettings = {
			type: 'component',
			component: c,
			title: '',
			body: ''
		};
		modalStore.trigger(modal);
	}
	function showDeleteModal(row: any): void {
		const c: ModalComponent = { ref: DeleteModal };
		planted.set({
			id: row.id,
			date: row.date,
			quantity: row.quantity,
			remarks: row.remarks
		});
		const modal: ModalSettings = {
			type: 'component',
			component: c,
			title: '',
			body: ''
		};
		modalStore.trigger(modal);
	}
	function truncateText(text: string, maxLength: number = 22): string {
		if (text.length > maxLength) {
			return `${text.slice(0, maxLength)}...`;
		}
		return text;
	}

	function rowMatchesSearch(row: any): boolean {
		const searchTerms = searchQuery.toLowerCase().split(' ');

		// Check if any of the search terms match any field in the row
		return searchTerms.every((term) =>
			Object.values(row).some(
				(value) => typeof value === 'string' && value.toLowerCase().includes(term)
			)
		);
	}
	function search(): void {
		paginatedSource = source
			.filter((row: any) => rowMatchesSearch(row))
			.slice(
				paginationSettings.page * paginationSettings.limit,
				paginationSettings.page * paginationSettings.limit + paginationSettings.limit
			);
	}
	const cardStyle = 'card card-hover overflow-hidden ';
	const chartStyle = 'card card-hover bg-surface-100 overflow-hidden ';
	const cardInsideStyle = ' p-4 space-y-4 ';
	const cardInsideStyle2 = ' p-4 space-y-6 ';
	const h2Style = 'text-1xl md:text-2xl lg:text-2xl';
	const h3Style = 'text-l md:text-1xl lg:text-1xl';
	const valueStyle = 'text-xs md:text-sm lg:text-md ';
	const smallValueStyle = 'flex justify-center items-center text-5xl';
	const smallerValueStyle = 'flex justify-center items-center text-2xl';
</script>

<Modal transitionIn={fade} transitionInParams={{ duration: 200 }} />

{#if isLoading}
	<!-- Display the ProgressRadial when isLoading is true -->
	<div class="flex justify-center items-center h-fit">
		<ProgressRadial value={undefined} />
	</div>
{:else}
	<Toast />
	<div class="w-full text-token grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
		<div class={cardStyle}>
			<div class={cardInsideStyle2}>
				<div class="flex items-start mt-2">
					<i class="fa-solid fa-temperature-three-quarters text-2xl mr-2" />
					<h2 class={h2Style}>Batch Code</h2>
				</div>
				<hr class="opacity-50" />
				<div class={valueStyle}>
					<!-- {#if {true}} -->
					<div class="flex items-center">
						<i class="fa-solid fa-calendar-days mr-2" />
						<h1>Date</h1>
					</div>
					<div class="flex items-center">
						<i class="fa-solid fa-bag-shopping mr-2" />
						<h1>Total Bags</h1>
					</div>
					<div class="flex items-center">
						<i class="fa-solid fa-calendar-days mr-2" />
						<h1>Total Harvest</h1>
					</div>
					<div class="flex items-center">
						<i class="fa-solid fa-calendar-days mr-2" />
						<h1>Total Bags</h1>
					</div>
					<!-- {:else}
						<div class="flex justify-center items-center">
							<ProgressRadial width="w-20" value={undefined} />
						</div>
					{/if} -->
				</div>
			</div>
		</div>
	</div>
	<div class=" m-5">
		<div class=" flex items-center justify-center">
			<input
				type="text"
				bind:value={searchQuery}
				placeholder="Search..."
				class="input mb-2 mr-2 sm:w-36 ml-auto h-8"
			/>
			<button type="button" class="btn btn-sm variant-filled-tertiary h-8 mb-2" on:click={search}>
				<i class="fa-solid fa-search" />
				<span>Search</span>
			</button>
		</div>
		<table class="table table-hover">
			<thead>
				<tr>
					<th><i class="fa-solid fa-calendar-days mr-2" />Date</th>
					<th><i class="fa-solid fa-bag-shopping mr-2" />Number of Bags</th>
					<th> <i class="fa-solid fa-pen-to-square mr-2" />Remarks</th>
					<th class="flex items-center justify-center"
						><button
							type="button"
							class="btn btn-sm variant-filled-primary mr-2"
							on:click={showAddModal}
						>
							<i class="fa-solid fa-plus" />
							<span>Add</span>
						</button></th
					>
				</tr>
			</thead>
			<tbody>
				{#each paginatedSource as row (row.id)}
					<tr class="" on:click={() => modalData(row)}>
						<td>{row.date}</td>
						<td>{row.quantity}</td>
						<td>{truncateText(row.remarks)}</td>
						<td class="flex items-center justify-center">
							<button
								type="button"
								class="btn btn-sm variant-filled-tertiary mr-2"
								on:click|stopPropagation={() => {
									showUpdateModal(row);
								}}
							>
								<i class="fa-solid fa-pen-to-square" />
								<span>Update</span>
							</button><button
								type="button"
								class="btn btn-sm variant-filled-error"
								on:click|stopPropagation={() => {
									showDeleteModal(row);
								}}
							>
								<i class="fa-solid fa-trash" />
								<span>Remove</span>
							</button>
						</td>
					</tr>
				{/each}
			</tbody>
			<tfoot>
				<tr>
					<th colspan="3">
						<h1 class="mb-2">
							Total Bags Planted: <span class="text-2xl">
								{#if bagCount}
									{bagCount} bags
								{:else}
									<div class="flex justify-center items-center">
										<ProgressRadial width="w-10" value={undefined} />
									</div>
								{/if}
							</span>
						</h1>
						<Paginator
							bind:settings={paginationSettings}
							showFirstLastButtons={false}
							showPreviousNextButtons={true}
						/>
					</th>
				</tr>
			</tfoot>
		</table>
	</div>
{/if}
