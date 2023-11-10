<script lang="ts">
	import { Modal, ProgressRadial, getModalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings, ModalComponent, ModalStore } from '@skeletonlabs/skeleton';
	import { fade } from 'svelte/transition';

	import AddHarvested from '$lib/components/Harvested/AddHarvestedModal.svelte';
	import UpdateHarvestedModal from '$lib/components/Harvested/UpdateHarvestedModal.svelte';
	import RemoveHarvestedModal from '$lib/components/Harvested/RemoveHarvestedModal.svelte';
	import ModalHarvested from '$lib/components/Harvested/ModalHarvested.svelte';
	import { harvested } from '$lib/stores/stores';
	import { Paginator } from '@skeletonlabs/skeleton';

	// getting data
	import { collection, getDocs, query, doc, onSnapshot } from 'firebase/firestore';
	import { db } from '$lib/firebase/firebase';
	import { format } from 'date-fns';
	import { onDestroy, onMount } from 'svelte';

	let source: any = [];

	let tableData: any[] = [];
	let totalWeightHarvested: number = 0;
	let isLoading = true;
	// Function to calculate the total weight harvested
	function calculateTotalWeightHarvested() {
		totalWeightHarvested = tableData.reduce((acc, row) => acc + row.grams, 0);
	}
	onMount(async () => {
		const userDocRef = doc(db, 'user', '123456');
		const bagsRecordCollectionRef = collection(userDocRef, 'harvest record');
		const q = query(bagsRecordCollectionRef);

		const unsubscribe = onSnapshot(q, (querySnapshot) => {
			source = [];

			querySnapshot.forEach((doc) => {
				const data = doc.data();
				// Ensure that the `date` field is a valid Firestore Timestamp
				if (data.date_harvested && data.date_harvested.toDate) {
					// Convert Firestore Timestamp to JavaScript Date
					data.date_harvested = format(data.date_harvested.toDate(), 'MMMM dd, yyyy');
				}
				// Add the ID to the data object
				data.id = doc.id;

				source.push(data);
			});
			calculateTotalWeightHarvested();
			isLoading = false;
		});
		// onDestroy(unsubscribe);
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
	// Modals

	const modalStore = getModalStore();
	function showAddModal(): void {
		const c: ModalComponent = { ref: AddHarvested };
		const modal: ModalSettings = {
			type: 'component',
			component: c,
			title: '',
			body: '',

			response: (r) => console.log('response:', r)
		};
		modalStore.trigger(modal);
	}
	function modalData(row: any): void {
		const c: ModalComponent = { ref: ModalHarvested };
		harvested.set({
			id: row.id,
			date_harvested: row.date_harvested,
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
		const c: ModalComponent = { ref: UpdateHarvestedModal };
		harvested.set({
			id: row.id,
			date_harvested: row.date_harvested,
			grams: row.grams,
			remarks: row.remarks
		});
		const modal: ModalSettings = {
			type: 'component',
			component: c,
			title: '',
			body: '',

			response: (r) => console.log('response:', r)
		};
		modalStore.trigger(modal);
	}
	function showDeleteModal(row: any): void {
		const c: ModalComponent = { ref: RemoveHarvestedModal };
		harvested.set({
			id: row.id,
			date_harvested: row.date_harvested,
			grams: row.grams,
			remarks: row.remarks
		});
		const modal: ModalSettings = {
			type: 'component',
			component: c,
			title: '',
			body: '',

			response: (r) => console.log('response:', r)
		};
		modalStore.trigger(modal);
	}
	function truncateRemarks(remarks: string, maxLength: number = 20): string {
		if (remarks.length > maxLength) {
			return `${remarks.slice(0, maxLength)}...`;
		}
		return remarks;
	}
</script>

<Modal transitionIn={fade} transitionInParams={{ duration: 200 }} />

<!-- Responsive Container (recommended) -->
{#if isLoading}
	<!-- Display the ProgressRadial when isLoading is true -->
	<div class="flex justify-center items-center h-fit">
		<ProgressRadial value={undefined} />
	</div>
{:else}
	<div class=" m-5">
		<!-- Native Table Element -->
		<table class="table table-hover">
			<thead>
				<tr>
					<th>Date</th>
					<th>Grams Harvested</th>
					<th>Remarks</th>
					<th class="flex items-center justify-center"
						><button
							type="button"
							class="btn btn-md variant-filled-primary mr-2"
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
						<td>{row.date_harvested}</td>
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
							Total Grams Harvested: {totalWeightHarvested} grams
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
