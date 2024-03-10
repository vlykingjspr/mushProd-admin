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
	let searchQuery = '';

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
		<div class="mr-5 mt-5 flex items-center justify-center">
			<input
				type="text"
				bind:value={searchQuery}
				placeholder="Search..."
				class="input mb-2 mr-2 sm:w-36 ml-auto h-8"
			/>
			<button
				type="button"
				class="btn btn-sm variant-filled-tertiary h-8 ml-2 mb-2"
				on:click={search}
			>
				<span class="material-symbols-outlined"> search </span>
				<span>Search</span>
			</button>
		</div>

		<table class="table table-hover">
			<thead>
				<tr
					><th>
						<div class="flex items-center">
							<span class="material-symbols-outlined mr-2"> calendar_month </span>
							Date
						</div>
					</th>
					<th>
						<div class="flex items-center">
							<span class="material-symbols-outlined mr-2"> notifications_active </span>
							Alert Title
						</div>
					</th><th>
						<div class="flex items-center">
							<span class="material-symbols-outlined mr-2"> device_thermostat </span>
							Temperature
						</div>
					</th><th>
						<div class="flex items-center">
							<span class="material-symbols-outlined mr-2"> humidity_mid </span>
							Humidity
						</div></th
					>
					<th>
						<div class="flex items-center">
							<span class="material-symbols-outlined mr-2"> notifications_active </span>
							Alert Message
						</div></th
					>

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
								<span class="material-symbols-outlined"> delete </span>
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
