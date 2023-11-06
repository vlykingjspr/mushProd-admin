<script lang="ts">
	import { Modal, ProgressRadial, getModalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings, ModalComponent } from '@skeletonlabs/skeleton';
	import { fade } from 'svelte/transition';
	import { Paginator } from '@skeletonlabs/skeleton';

	// Modals
	import DeleteModal from '$lib/components/Notification/RemoveNotif.svelte';
	import ModalNotif from '$lib/components/Notification/ModalNotif.svelte';
	import { notifications } from '$lib/stores/stores';
	import { writable, type Writable } from 'svelte/store';
	// getting data
	import { collection, getDocs, query, doc, onSnapshot } from 'firebase/firestore';
	import { db } from '$lib/firebase/firebase';
	import { format } from 'date-fns';
	import { onMount } from 'svelte';

	let source: any = [];
	let tableData: any[] = [];
	let isLoading = true;
	onMount(async () => {
		const userDocRef = doc(db, 'user', '123456');
		const bagsRecordCollectionRef = collection(userDocRef, 'notifications');
		const q = query(bagsRecordCollectionRef);

		const unsubscribe = onSnapshot(q, (querySnapshot) => {
			// Clear the existing data before adding new data
			source = [];

			querySnapshot.forEach((doc) => {
				const data = doc.data();
				// Convert Firestore Timestamp to JavaScript Date
				if (data.date && typeof data.date.toDate === 'function') {
					// Convert Firestore Timestamp to JavaScript Date
					data.date = format(data.date.toDate(), 'MMMM dd, yyyy');
				}
				// Add the ID to the data object
				data.id = doc.id;
				source.push(data);
				isLoading = false;
			});
		});
		// onDestroy(unsubscribe);
	});
	// pagination
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

	const modalStore = getModalStore();
	//Modals for clicking data
	function modalData(row: any): void {
		const c: ModalComponent = { ref: ModalNotif };
		notifications.set({
			id: row.id,
			date: row.date,
			temperature: row.temperature,
			humidity: row.humidity,
			alertMessage: row.alertMessage
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
		notifications.set({
			id: row.id,
			date: row.date,
			temperature: row.temperature,
			humidity: row.humidity,
			alertMessage: row.alertMessage
		});
		const modal: ModalSettings = {
			type: 'component',
			component: c,
			title: '',
			body: ''
		};
		modalStore.trigger(modal);
	}
	function truncateAlertMessage(alertMessage: string, maxLength: number = 20): string {
		if (alertMessage.length > maxLength) {
			return `${alertMessage.slice(0, maxLength)}...`;
		}
		return alertMessage;
	}
</script>

<Modal transitionIn={fade} transitionInParams={{ duration: 200 }} />
<!-- Responsive Container (recommended) -->

<!-- Native Table Element -->
{#if isLoading}
	<!-- Display the ProgressRadial when isLoading is true -->
	<div class="flex justify-center items-center h-fit">
		<ProgressRadial value={undefined} />
	</div>
{:else}
	<!-- Display the page content when isLoading is false -->
	<div class=" m-5">
		<table class="table table-hover">
			<thead>
				<tr>
					<th>Date</th>
					<th>Temperature</th>
					<th>Humidity</th>
					<th>Alert Message</th>
					<th />
				</tr>
			</thead>

			<tbody>
				{#each paginatedSource as row (row.id)}
					<tr class="" on:click={() => modalData(row)}>
						<td>{row.date}</td>
						<td>{row.temperature}</td>
						<td>{row.humidity}</td>

						<td>{truncateAlertMessage(row.alertMessage)}</td>
						<td class="">
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
				<div class="m-2">
					<Paginator
						bind:settings={paginationSettings}
						showFirstLastButtons={false}
						showPreviousNextButtons={true}
					/>
				</div>
				<tr>
					<th colspan="3"> Total Planted Bags</th>
				</tr>
			</tfoot>
		</table>
		<!-- <Table source={tableSimple} interactive={true} on:selected={selected} /> -->
	</div>
{/if}
