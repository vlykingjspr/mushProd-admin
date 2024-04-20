<script lang="ts">
	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	import { harvested } from '$lib/stores/stores';
	import { doc, deleteDoc } from 'firebase/firestore';
	import { db } from '$lib/firebase/firebase';
	import { showErrorToast, showSuccessToast } from '../Toast/toast';

	/** Exposes parent props to this component. */
	export let parent: any;

	// Local
	const modalStore = getModalStore();
	const toastStore = getToastStore();
	// Handle Form Submission
	function onFormSubmit(): void {
		modalStore.close();
	}
	function removeToast() {
		showErrorToast(toastStore, 'Harvested Data Removed Successfully');
	}
	function errorToast(error: any) {
		showErrorToast(toastStore, `Failed to Remove Harvest Data ${error}`);
	}
	// Base Classes
	const cBase = 'card p-4 w-modal shadow-xl space-y-4 ';
	const cHeader = 'text-2xl font-bold';

	let date_harvested: string;
	let id: string;
	let grams: string;
	let remarks: string;
	let batch_id: string;
	let selectedRowData: any;
	harvested.subscribe((data) => {
		selectedRowData = data;
		batch_id = selectedRowData.batch_id;
		id = selectedRowData.id;
		date_harvested = selectedRowData.date_harvested;
		grams = selectedRowData.grams;
		remarks = selectedRowData.remarks;
	});

	async function confirmRemove(): Promise<void> {
		const userDocRef = doc(db, 'user', '123456');
		const batchDocRef = doc(userDocRef, 'batch', batch_id, 'batch_harvest', id);

		try {
			await deleteDoc(batchDocRef);
			modalStore.close();
			removeToast();
		} catch (error) {
			errorToast(error);
		}
	}
</script>

<!-- @component This example creates a simple form modal. -->

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>
			<div class="flex items-center">
				<span class="material-symbols-outlined mr-2">
					delete
					</span>
				Please Confirm to Remove
			</div>
		</header>
		<hr class="opacity-50" />

		<div>
			<h1>Are you sure you want to remove the recorded harvested mushrooms?</h1>
		</div>

		<!-- prettier-ignore -->
		<footer class="modal-footer {parent.regionFooter}">
			
			<button class="btn variant-filled-error" on:click={confirmRemove}>Yes</button>
			<button class="btn variant-filled-tertiary" on:click={onFormSubmit}>No</button>
		</footer>
	</div>
{/if}
