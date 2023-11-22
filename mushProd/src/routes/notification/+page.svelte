<script lang="ts">
	import { Modal, ProgressRadial, Toast, getModalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings, ModalComponent } from '@skeletonlabs/skeleton';
	import { fade } from 'svelte/transition';
	import { Paginator } from '@skeletonlabs/skeleton';

	// Modals
	import DeleteModal from '$lib/components/Notification/RemoveNotif.svelte';
	import ModalNotif from '$lib/components/Notification/ModalNotif.svelte';
	import { notifications } from '$lib/stores/stores';
	import { writable, type Writable } from 'svelte/store';
	// getting data
	import { collection, getDocs, query, doc, onSnapshot, orderBy } from 'firebase/firestore';
	import { db } from '$lib/firebase/firebase';
	import { format } from 'date-fns';
	import { onDestroy, onMount } from 'svelte';

	let source: any = [];
	let tableData: any[] = [];
	let isLoading = true;
	let unsubscribe: any;

	onMount(async () => {
		const userDocRef = doc(db, 'user', '123456');
		const bagsRecordCollectionRef = collection(userDocRef, 'notifications');
		const q = query(bagsRecordCollectionRef, orderBy('date', 'desc'));

		unsubscribe = onSnapshot(q, (querySnapshot) => {
			source = [];
			querySnapshot.forEach((doc) => {
				const data = doc.data();
				if (data.date && typeof data.date.toDate === 'function') {
					data.date = format(data.date.toDate(), 'MMMM dd, yyyy');
				}
				// Add the ID to the data object
				data.id = doc.id;
				source.push(data);

				isLoading = false;
			});
		});
	});
	onDestroy(() => {
		if (unsubscribe) {
			unsubscribe();
		}
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
			alertTitle: row.alertTitle,
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
			alertTitle: row.alertTitle,
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
	function truncateAlertMessage(alertMessage: string, maxLength: number = 22): string {
		if (alertMessage.length > maxLength) {
			return `${alertMessage.slice(0, maxLength)}...`;
		}
		return alertMessage;
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

	<!-- Display the page content when isLoading is false -->
	<div class=" m-5">
		<table class="table table-hover">
			<thead>
				<tr
					><th><i class="fa-solid fa-calendar-days mr-2" />Date</th>
					<th><i class="fa-solid fa-bell mr-2" />Alert Title</th>
					<th><i class="fa-solid fa-temperature-three-quarters mr-2" />Temperature</th>
					<th> <i class="fa-solid fa-droplet mr-2" />Humidity</th>
					<th> <i class="fa-solid fa-circle-exclamation mr-2" />Alert Message</th>

					<th />
				</tr>
			</thead>

			<tbody>
				{#each paginatedSource as row (row.id)}
					<tr class="" on:click={() => modalData(row)}>
						<td>{row.date}</td>
						<td>{row.alertTitle}</td>
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
				<tr>
					<th colspan="3"
						><Paginator
							bind:settings={paginationSettings}
							showFirstLastButtons={false}
							showPreviousNextButtons={true}
						/></th
					>
					<br />
				</tr>
			</tfoot>
		</table>
	</div>
{/if}
