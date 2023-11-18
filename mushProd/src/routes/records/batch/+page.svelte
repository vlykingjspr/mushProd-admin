<script lang="ts">
	import { Modal, ProgressRadial, getModalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings, ModalComponent } from '@skeletonlabs/skeleton';
	import { fade } from 'svelte/transition';
	import { Paginator } from '@skeletonlabs/skeleton';
	// modals
	import AddModal from '$lib/components/PlantedBags/AddBagsModal.svelte';
	import UpdateModal from '$lib/components/PlantedBags/UpdateBagsModal.svelte';
	import DeleteModal from '$lib/components/PlantedBags/RemoveBagsModal.svelte';
	import ModalBatch from '$lib/components/Batch/ModalBatch.svelte';
	import { batch, planted } from '$lib/stores/stores';

	// toast
	import { Toast, getToastStore } from '@skeletonlabs/skeleton';
	import type { ToastSettings, ToastStore } from '@skeletonlabs/skeleton';

	// getting data
	import {
		collection,
		getDocs,
		query,
		doc,
		onSnapshot,
		orderBy,
		type DocumentData
	} from 'firebase/firestore';
	import { db } from '$lib/firebase/firebase';
	import { format } from 'date-fns';
	import { onDestroy, onMount } from 'svelte';
	import { allPlantedBags } from '../../../lib/firebase/allRecord';

	let source: any = [];
	let source2: any = [];

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

		const batchRec = collection(userDocRef, 'batch');
		const s = query(batchRec, orderBy('batch_planted', 'asc'));
		const unsubscribe1 = onSnapshot(s, (querySnapshot) => {
			querySnapshot.forEach((doc) => {
				const data = doc.data();
				// Ensure that the `date` field is a valid Firestore Timestamp
				if (data.batch_planted && data.batch_planted.toDate) {
					data.batch_planted = format(data.batch_planted.toDate(), 'MMMM dd, yyyy');
				}
				// Add the ID to the data object
				data.id = doc.id;

				source2.push(data);
				isLoading = false;
			});
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
		const c: ModalComponent = { ref: ModalBatch };

		batch.set({
			id: row.id,
			batch_code: row.batch_code,
			batch_total_removed: row.batch_total_removed,
			batch_total_bags: row.batch_total_bags,
			batch_planted: row.batch_planted,
			batch_remarks: row.batch_remarks
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
	const h2Style = 'text-lg md:text-2xl lg:text-1xl';
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

	<div class="mr-5 mt-5 flex items-center justify-center">
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
	<div class="w-full text-token grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pl-4 pr-4">
		{#each source2 as row (row.id)}
			<button on:click={() => modalData(row)}>
				<div class={cardStyle}>
					<div class={cardInsideStyle2}>
						<div class="flex items-start">
							<i class="fa-solid fa-temperature-three-quarters text-2xl mr-2" />
							<h2 class={h2Style}>{row.batch_code}</h2>
						</div>

						<hr class="opacity-50" />
						{row.id}
						<div class={valueStyle}>
							<!-- {#if {true}} -->
							<div class="flex items-center">
								<i class="fa-solid fa-calendar-days mr-2" />
								<h1>{row.batch_planted}</h1>
							</div>
							<div class="flex items-center">
								<i class="fa-solid fa-bag-shopping mr-2" />
								<h1>Total Bags: {row.batch_total_bags}</h1>
							</div>
							<div class="flex items-center">
								<i class="fa-solid fa-calendar-days mr-2" />
								<h1>Total Bags Removed: {row.batch_total_removed}</h1>
							</div>

							<!-- {:else}
						<div class="flex justify-center items-center">
							<ProgressRadial width="w-20" value={undefined} />
						</div>
					{/if} -->
						</div>
					</div>
				</div>
			</button>
		{/each}
	</div>
{/if}
