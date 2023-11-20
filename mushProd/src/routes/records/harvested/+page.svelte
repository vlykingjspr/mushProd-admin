<script lang="ts">
	import { Modal, ProgressRadial, Toast, filter, getModalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings, ModalComponent } from '@skeletonlabs/skeleton';
	import { fade } from 'svelte/transition';

	import AddHarvested from '$lib/components/Harvested/AddHarvestedModal.svelte';
	import UpdateHarvestedModal from '$lib/components/Harvested/UpdateHarvestedModal.svelte';
	import RemoveHarvestedModal from '$lib/components/Harvested/RemoveHarvestedModal.svelte';
	import ModalHarvested from '$lib/components/Harvested/ModalHarvested.svelte';
	import { harvested } from '$lib/stores/stores';
	import { Paginator } from '@skeletonlabs/skeleton';

	// getting data
	import { collection, getDocs, query, doc, onSnapshot, orderBy } from 'firebase/firestore';
	import { db } from '$lib/firebase/firebase';
	import { format } from 'date-fns';
	import { onMount } from 'svelte';
	import { allHarvestedGrams } from '../../../lib/firebase/allRecord';

	let source: any = [];
	let isLoading = true;
	let searchQuery = '';
	let gramsCount: number;

	async function fetchData() {
		gramsCount = await allHarvestedGrams();
	}
	onMount(async () => {
		const userDocRef = doc(db, 'user', '123456');
		const bagsRecordCollectionRef = collection(userDocRef, 'harvest record');
		const q = query(bagsRecordCollectionRef, orderBy('date_harvested', 'asc'));

		const unsubscribe = onSnapshot(q, (querySnapshot) => {
			source = [];
			querySnapshot.forEach((doc) => {
				const data = doc.data();

				if (data.date_harvested && data.date_harvested.toDate) {
					data.date_harvested = format(data.date_harvested.toDate(), 'MMMM dd, yyyy');
				}
				data.id = doc.id;
				source.push(data);
			});
			fetchData();
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

<!-- Responsive Container (recommended) -->
{#if isLoading}
	<!-- Display the ProgressRadial when isLoading is true -->
	<div class="flex justify-center items-center h-fit">
		<ProgressRadial value={undefined} />
	</div>
{:else}
	<Toast />
	<div class=" mr-5 ml-5 mb-5">
		<!-- Native Table Element -->
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
		<!-- ... existing code ... -->

		<table class="table table-hover">
			<thead>
				<tr>
					<th><i class="fa-solid fa-calendar-days mr-2" />Date</th>
					<th><i class="fa-solid fa-layer-group mr-2" />Grams Harvested</th>
					<th> <i class="fa-solid fa-pen-to-square mr-2" />Remarks</th>
					<th class="flex items-center justify-center">
						<button
							type="button"
							class="btn btn-sm variant-filled-primary mr-2"
							on:click={showAddModal}
						>
							<i class="fa-solid fa-plus" />
							<span>Add</span>
						</button>
					</th>
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
							Total Grams Harvested: <span class="text-2xl">
								{#if gramsCount}
									{gramsCount} grams
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
