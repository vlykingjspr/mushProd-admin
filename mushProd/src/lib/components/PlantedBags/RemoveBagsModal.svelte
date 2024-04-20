<script lang="ts">
	import { Toast, getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	import { planted } from '$lib/stores/stores';
	import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
	import { db } from '$lib/firebase/firebase';
	import { showSuccessToast, showErrorToast } from '../Toast/toast';

	export let parent: any;
	export let id: string;
	export let quantity: number;
	let removedBags: number;
	let removeBags: number;
	let isInvalidQuantity: boolean = false;

	const modalStore = getModalStore();
	const toastStore = getToastStore();

	function onFormSubmit(): void {
		modalStore.close();
	}
	function removeToast() {
		showErrorToast(toastStore, 'Bag Removed Successfully');
	}
	function errorToast() {
		showErrorToast(toastStore, 'Failed to Remove Bags');
	}
	function errorToast2() {
		showErrorToast(toastStore, 'Error Value');
	}
	// Classes
	const cBase = 'card p-4 w-modal shadow-xl space-y-4 ';
	const cHeader = 'text-2xl font-bold';

	let selectedRowData: any;
	planted.subscribe((data) => {
		selectedRowData = data;
		id = selectedRowData.id;
		removedBags = selectedRowData.removed;
		quantity = selectedRowData.quantity;
	});

	// Function to update data in Firebase
	async function updateData() {
		const userDocRef = doc(db, 'user', '123456');
		const bagsRecordDocRef = doc(userDocRef, 'batch', id);
		if (typeof quantity !== 'number' || isNaN(quantity)) {
			// Handle invalid quantity (optional)
			return;
		}

		// Get the number of bags to remove from the user input

		// Ensure bagsToRemove is a valid number
		if (isNaN(removeBags)) {
			errorToast2();
			return;
		}

		// Subtract bagsToRemove from the existing quantity
		const updatedQuantity = Math.max(0, quantity - removeBags);
		const updatedRemovedBags = Math.max(0, removedBags + removeBags);
		// Create an object with the updated data
		const updatedData = {
			batch_total_bags: updatedQuantity
		};
		const updatedRemoveData = {
			batch_total_removed: updatedRemovedBags
		};
		try {
			await updateDoc(bagsRecordDocRef, updatedRemoveData);
			await updateDoc(bagsRecordDocRef, updatedData);
			modalStore.close();
			removeToast();
		} catch (error) {
			// Handle error
			errorToast();
		}
	}

	$: isInvalidQuantity = isNaN(Number(removeBags)) || removeBags < 0;
</script>

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>
			<div class="flex items-center">
				<span class="material-symbols-outlined mr-2">
					delete
					</span>
				How many bags you want to remove?
			</div>
		</header>
		<hr class="opacity-50" />

		<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
			<div class="input-group-shim"><span class="material-symbols-outlined">
				psychiatry
				</span></div>
			<input type="number" placeholder="Number of Bags" bind:value={removeBags} />
		</div>
		{#if isInvalidQuantity}
			<p class="text-red-500">Please enter a valid quantity</p>
		{/if}
		<!-- prettier-ignore -->
		<footer class="modal-footer {parent.regionFooter}">
			
			<button class="btn variant-filled-error" on:click={updateData} disabled={isInvalidQuantity}>Yes</button>
			<button class="btn variant-filled-tertiary" on:click={onFormSubmit}>No</button>
		</footer>
	</div>
{/if}
