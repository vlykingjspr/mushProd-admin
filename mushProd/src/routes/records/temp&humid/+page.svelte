<script lang="ts">
	import { Modal, ProgressRadial, getModalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings, ModalComponent } from '@skeletonlabs/skeleton';
	import { fade } from 'svelte/transition';
	import { Paginator } from '@skeletonlabs/skeleton';
	// modals

	import DeleteModal from '$lib/components/PlantedBags/RemoveBagsModal.svelte';
	import ModalTempHumid from '$lib/components/TempHumid/ModalTempHumid.svelte';
	import { tempHumid } from '$lib/stores/stores';

	// toast
	import { Toast, getToastStore } from '@skeletonlabs/skeleton';
	import type { ToastSettings, ToastStore } from '@skeletonlabs/skeleton';

	// getting data
	import { collection, getDocs, query, doc, onSnapshot, orderBy } from 'firebase/firestore';
	import { db } from '$lib/firebase/firebase';
	import { format } from 'date-fns';
	import { onDestroy, onMount } from 'svelte';
	let source: any = [];

	let isLoading = true;
	// Function to calculate the total number of bags
	let searchQuery = '';

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
		const bagsRecordCollectionRef = collection(userDocRef, 'temp and humid');
		const q = query(bagsRecordCollectionRef, orderBy('date', 'desc'));

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
		const c: ModalComponent = { ref: ModalTempHumid };
		tempHumid.set({
			id: row.id,
			date: row.date,
			ave_temp: row['ave temp'],
			ave_humd: row['ave humidity']
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
		tempHumid.set({
			id: row.id,
			date: row.date,
			ave_temp: row['ave temp'],
			ave_humd: row['ave humidity']
		});
		const modal: ModalSettings = {
			type: 'component',
			component: c,
			title: '',
			body: ''
		};
		modalStore.trigger(modal);
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
					<th><i class="fa-solid fa-temperature-high mr-2" />Temperature</th>
					<th> <i class="fa-solid fa-pen-to-square mr-2" />Humidity</th>
					<th />
				</tr>
			</thead>
			<tbody>
				{#each paginatedSource as row (row.id)}
					<tr class="" on:click={() => modalData(row)}>
						<td>{row.date}</td>
						<td>{row['ave temp']}</td>
						<td>{row['ave humidity']}</td>
						<td class="flex items-center justify-center">
							<button
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
