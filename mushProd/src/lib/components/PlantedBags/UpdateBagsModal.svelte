<script lang="ts">
	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	import { planted } from '$lib/stores/stores';
	import { Timestamp, doc, updateDoc } from 'firebase/firestore'; // Import the necessary Firestore functions
	import { db } from '$lib/firebase/firebase';
	import { showUpdateToast, showErrorToast } from '../Toast/toast';

	export let parent: any;
	const modalStore = getModalStore();
	const toastStore = getToastStore();

	function updateToast() {
		showUpdateToast(toastStore, 'Bags Updated Successfully');
	}
	function errorToast() {
		showErrorToast(toastStore, 'Failed to Update Bags');
	}
	// Base Classes
	const cBase = 'card p-4 w-modal shadow-xl space-y-4 ';
	const cHeader = 'text-2xl font-bold';

	let id: string;
	let remarks: string;
	let selectedRowData: any;
	planted.subscribe((data) => {
		selectedRowData = data;
		id = selectedRowData.id;
		remarks = selectedRowData.remarks;
	});
	// Function to update data in Firebase
	async function updateData() {
		const userDocRef = doc(db, 'user', '123456');
		const bagsRecordDocRef = doc(userDocRef, 'batch', id);
		console.log(id);
		// Create an object with the updated data
		const updatedData = {
			batch_remarks: remarks
		};
		try {
			await updateDoc(bagsRecordDocRef, updatedData);
			updateToast();
			modalStore.close();
		} catch (error) {
			// errorToast();
		}
	}
</script>

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>
			<div class="flex items-center justify-center">Update Batched Fruiting Bags Remarks</div>
		</header>
		<hr class="opacity-50" />

		<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
			<div class="input-group-shim"><i class="fa-solid fa-calendar" /></div>
			<textarea class="textarea" rows="3" placeholder="Remarks" bind:value={remarks} />
		</div>

		<!-- prettier-ignore -->
		<footer class="modal-footer {parent.regionFooter}">
			
			<button class="btn {parent.buttonPositive}" on:click={updateData}>OK</button>
			<button class="btn {parent.buttonNeutral}" on:click={parent.onClose}
				>{parent.buttonTextCancel}</button
			>
		</footer>
	</div>
{/if}
