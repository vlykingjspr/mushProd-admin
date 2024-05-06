<script lang="ts">
	import type { PageData } from './$types';
	import { Modal, ProgressRadial, getModalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings, ModalComponent } from '@skeletonlabs/skeleton';
	import { fade } from 'svelte/transition';
	import { Paginator } from '@skeletonlabs/skeleton';
	// modals

	import AddModal from '$lib/components/Harvested/AddHarvestedModal.svelte';
	import UpdateModal from '$lib/components/Harvested/UpdateHarvestedModal.svelte';
	import DeleteModal from '$lib/components/Harvested/RemoveHarvestedModal.svelte';
	import ShowModal from '$lib/components/Harvested/ModalHarvested.svelte';
	import DeletePlantedModal from '$lib/components/PlantedBags/RemoveBagsModal.svelte';
	import UpdatePlantedModal from '$lib/components/PlantedBags/UpdateBagsModal.svelte';
	import { harvested, planted } from '$lib/stores/stores';

	// toast
	import { Toast, getToastStore } from '@skeletonlabs/skeleton';
	import type { ToastSettings, ToastStore } from '@skeletonlabs/skeleton';

	// getting data
	import { collection, getDocs, query, doc, onSnapshot, orderBy, getDoc } from 'firebase/firestore';
	import { db } from '$lib/firebase/firebase';
	import { format } from 'date-fns';
	import { onMount } from 'svelte';
	import { batch } from '$lib/stores/stores';

	let source: any = [];
	let source2: any = [];

	let isLoading = true;
	// Function to calculate the total number of bags
	let searchQuery = '';

	let bagCount: number;
	async function fetchData() {}
	let id: string;
	let batch_code: string;
	let batch_planted: string;
	let batch_total_bags: number;
	let batch_total_removed: number;
	let batch_remarks: string;
	let batch_record: boolean;
	let isBatchHarvestExisting: boolean;
	batch.subscribe((data) => {
		// Log the data for debugging
		id = data.id;
	});

	const toastStore = getToastStore();
	const t: ToastSettings = {
		message: '',
		timeout: 10000
	};
	function updated() {
		toastStore.trigger(t);
	}
	// Create a Firestore listener and initialize tableData
	const userDocRef = doc(db, 'user', '123456');

	onMount(async () => {
		const batchDocRef = doc(userDocRef, 'batch', id);
		const batchHarvestRef = collection(batchDocRef, 'batch_harvest');

		const checkBatchHarvestExistence = async () => {
			try {
				// Try to get the document
				const batchDoc = await getDoc(batchDocRef);

				// Check if the batch document exists
				if (batchDoc.exists()) {
					// Check if the batch_harvest subcollection exists
					const batchHarvestSnapshot = await getDocs(batchHarvestRef);
					return !batchHarvestSnapshot.empty; // Return true if subcollection exists
				} else {
					return false; // Return false if the batch document doesn't exist
				}
			} catch (error) {
				console.error('Error checking batch_harvest existence:', error);
				return false;
			}
		};

		isBatchHarvestExisting = await checkBatchHarvestExistence();

		try {
			const batchRec = doc(userDocRef, 'batch', id);
			const unsubscribeRec = onSnapshot(batchRec, (docSnapshot) => {
				if (docSnapshot.exists()) {
					const data = docSnapshot.data();
					// Ensure that the `batch_planted` field is a valid Firestore Timestamp
					if (data.batch_planted && data.batch_planted.toDate) {
						data.date = format(data.batch_planted.toDate(), 'MMMM dd, yyyy');
					}
					// Add the ID to the data object
					data.id = docSnapshot.id;
					// Update the relevant state for batchRec
					source2 = [data];
				}
			});

			if (isBatchHarvestExisting) {
				const batchDocRef = doc(userDocRef, 'batch', id);
				const batchHarvestRef = collection(batchDocRef, 'batch_harvest');
				const s = query(batchHarvestRef, orderBy('date', 'desc'));
				const unsubscribe1 = onSnapshot(s, (querySnapshot) => {
					source.length = 0; // Clear the array before pushing new data
					source = [];
					querySnapshot.forEach((doc) => {
						const data = doc.data();
						// Ensure that the `date` field is a valid Firestore Timestamp
						if (data.date && data.date.toDate) {
							data.date = format(data.date.toDate(), 'MMMM dd, yyyy');
						}
						// Add the ID to the data object
						data.id = doc.id;
						source.push(data);

						isLoading = false;
					});
				});
			} else {
				isLoading = false;
			}
		} catch (error) {
			error;
		}
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
	function showModal(row: any): void {
		const c: ModalComponent = { ref: ShowModal };
		harvested.set({
			batch_id: id,
			id: row.id,
			date: row.date,
			grams: row.grams,
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
	function showAddModal(row: any): void {
		const c: ModalComponent = { ref: AddModal };
		harvested.set({
			batch_id: id,
			id: row.id,
			date: row.date,
			grams: row.grams,
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
	function showUpdateModal(row: any): void {
		const c: ModalComponent = { ref: UpdateModal };
		harvested.set({
			batch_id: id,
			id: row.id,
			date: row.date,
			grams: row.grams,
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
	function showRemoveModal(row: any): void {
		const c: ModalComponent = { ref: DeleteModal };
		harvested.set({
			batch_id: id,
			id: row.id,
			date: row.date,
			grams: row.grams,
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
	function showRemovePlanted(row: any): void {
		const c: ModalComponent = { ref: DeletePlantedModal };
		planted.set({
			id: id,
			date: '',
			quantity: row.batch_total_bags,
			removed: row.batch_total_removed,
			remarks: ''
		});
		const modal: ModalSettings = {
			type: 'component',
			component: c,
			title: '',
			body: ''
		};
		modalStore.trigger(modal);
	}
	function showUpdatePlanted(row: any): void {
		const c: ModalComponent = { ref: UpdatePlantedModal };
		planted.set({
			id: id,
			date: '',
			quantity: row.batch_total_bags,
			removed: row.batch_total_removed,
			remarks: row.batch_remarks
		});
		const modal: ModalSettings = {
			type: 'component',
			component: c,
			title: '',
			body: ''
		};
		modalStore.trigger(modal);
	}
	//other Functions
	function truncateRemarks(remarks: string, maxLength: number = 22): string {
		if (remarks.length > maxLength) {
			return `${remarks.slice(0, maxLength)}...`;
		}
		return remarks;
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
</script>

<Modal transitionIn={fade} transitionInParams={{ duration: 200 }} />

{#if isLoading}
	<!-- Display the ProgressRadial when isLoading is true -->
	<div class="flex justify-center items-center h-fit">
		<ProgressRadial value={undefined} />
	</div>
{:else}
	<Toast />
	<div class=" m-5">
		<div class=" flex">
			<a href="/records/batch" class="btn-icon btn-icon-sm variant-filled m-2">
				<!-- <i class="fa-solid fa-arrow-left" /> -->
				<span class="material-symbols-outlined"> arrow_back </span>
			</a>
		</div>
		{#each source2 as row (row.id)}
			<div class="text-2xl">
				<span class=" text-2xl material-symbols-outlined m-2"> qr_code </span>{row.batch_code}
			</div>
		{/each}
		<table class="table table-hover">
			<thead>
				<tr class="">
					<th class="flex">
						<!-- <span class="material-symbols-outlined mr-2"> calendar_month </span> -->
						Date</th
					>
					<th class="">
						<!-- <span class="material-symbols-outlined mr-2"> shopping_bag </span> -->
						Number of Bags</th
					>
					<th class="">
						<!-- <span class="material-symbols-outlined mr-2"> delete_forever </span> -->
						Number of Bags Removed</th
					>
					<th class="">
						<!-- <span class="material-symbols-outlined mr-2"> edit_note </span>  -->
						Remarks</th
					><th class="">
						<!-- <span class="material-symbols-outlined mr-2"> edit_note </span>  -->
						</th
					>
				</tr>
			</thead>
			<tbody>
				<tr class="">
					{#each source2 as row (row.id)}
						<td class="">{row.date}</td>
						<td class=" "
							>
							<div class="">
							{row.batch_total_bags}

							
						</div>
						</td>
						<td>{row.batch_total_removed}</td>
						<td>{row.batch_remarks}</td>
						<td class=""
							>{truncateRemarks(row.batch_remarks)}
							<button
								type="button"
								class="btn btn-sm variant-filled-tertiary ml-2"
								on:click|stopPropagation={() => {
									showUpdatePlanted(row);
								}}
							>
								<span class="material-symbols-outlined"> edit </span>
							</button>
							<button
								type="button"
								class="btn btn-sm variant-filled-error ml-2"
								on:click|stopPropagation={() => {
									showRemovePlanted(row);
								}}
							>
								<span class="material-symbols-outlined"> delete </span>
							</button></td
						>
						
					{/each}
				</tr>
			</tbody>
		</table>
	</div>
	<hr class="opacity-50" />
	<div class=" m-5">
		<div class=" flex items-center justify-center">
			<div class="text-2xl"><i class="fa-solid fa-jar-wheat fa-md m-2" />Harvest Record</div>
			<input
				type="text"
				bind:value={searchQuery}
				placeholder="Search..."
				class="input mb-2 mr-2 sm:w-36 ml-auto h-8"
			/>
			<button type="button" class="btn btn-sm variant-filled-tertiary h-8 mb-2" on:click={search}>
				<!-- <i class="fa-solid fa-search" /> -->
				<span>Search</span>
			</button>
		</div>
		<table class="table table-hover">
			<thead>
				<tr>
					<th>
						<!-- <i class="fa-solid fa-calendar-days mr-2" /> -->
						Date</th
					>
					<th>
						<!-- <i class="fa-solid fa-layer-group mr-2" /> -->
						Grams Harvested</th
					>
					<th>
						<!-- <i class="fa-solid fa-pen-to-square mr-2" /> -->
						Remarks</th
					>
					<th class="flex items-center justify-center">
						<button
							type="button"
							class="btn btn-sm variant-filled-primary mr-2"
							on:click={() => showAddModal(id)}
						>
							<!-- <i class="fa-solid fa-plus" /> -->
							<span class="material-symbols-outlined"> add </span>
							<!-- <span>Add</span> -->
						</button>
					</th>
				</tr>
			</thead>
			{#if isBatchHarvestExisting}
				<tbody>
					{#each paginatedSource as row (row.id)}
						<tr class="" on:click={() => showModal(row)}>
							<td>{row.date}</td>
							<td>{row.grams}</td>
							<td>{truncateRemarks(row.remarks)}</td>
							<td class="flex items-center justify-center">
								<button
									type="button"
									class="btn btn-sm variant-filled-tertiary mr-2"
									on:click|stopPropagation={() => {
										showUpdateModal(row);
									}}
								>
									<!-- <i class="fa-solid fa-pen-to-square" /> -->
									<span class="material-symbols-outlined"> edit </span>
									<!-- <span>Update</span> -->
								</button><button
									type="button"
									class="btn btn-sm variant-filled-error"
									on:click|stopPropagation={() => {
										showRemoveModal(row);
									}}
								>
									<!-- <i class="fa-solid fa-trash" />
									<span>Remove</span> -->
									<span class="material-symbols-outlined"> delete </span>
								</button>
							</td>
						</tr>
					{/each}
				</tbody>
				<tfoot>
					<tr>
						<th colspan="3">
							<h1 class="mb-2">
								Total Bags Planted: <span class="text-2xl" />
							</h1>
							<Paginator
								bind:settings={paginationSettings}
								showFirstLastButtons={false}
								showPreviousNextButtons={true}
							/>
						</th>
					</tr>
				</tfoot>
			{:else}
				<tbody class="flex justify-center items-center">
					<!-- <tr class="flex justify-center items-center m-2"> -->
					<h1 class="h4 m-2">No Harvest Yet!</h1>
					<!-- </tr> -->
				</tbody>
			{/if}
		</table>
	</div>
{/if}
