<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { planted } from '$lib/stores/stores';
	import { doc, updateDoc } from 'firebase/firestore'; // Import the necessary Firestore functions
	import { db } from '$lib/firebase/firebase';

	/** Exposes parent props to this component. */
	export let parent: any;

	// Local
	const modalStore = getModalStore();

	// Handle Form Submission
	function onFormSubmit(): void {
		modalStore.close();
	}

	// Base Classes
	const cBase = 'card p-4 w-modal shadow-xl space-y-4 ';
	const cHeader = 'text-2xl font-bold';

	let date: string;
	let id: string;
	let quantity: number;
	let remarks: string;

	let selectedRowData: any;
	planted.subscribe((data) => {
		selectedRowData = data;
		id = selectedRowData.id;
		date = selectedRowData.date;
		quantity = selectedRowData.quantity;
		remarks = selectedRowData.remarks;
	});
	// Function to update data in Firebase
	async function updateData() {
		const userDocRef = doc(db, 'user', '123456');
		const bagsRecordDocRef = doc(userDocRef, 'bags record', id);

		// Create an object with the updated data
		const updatedData = {
			date: date,
			quantity: quantity,
			remarks: remarks
		};

		try {
			await updateDoc(bagsRecordDocRef, updatedData);
			modalStore.close();
		} catch (error) {
			console.error('Error updating document:', error);
		}
	}
</script>

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>
			<div class="flex items-center justify-center">Update Fruiting Bags</div>
		</header>
		<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
			<div class="input-group-shim"><i class="fa-solid fa-calendar" /></div>
			<h1 class="h3 p-2">{date}</h1>
		</div>
		<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
			<div class="input-group-shim"><i class="fa-solid fa-seedling" /></div>
			<input type="number" placeholder="Number of Bags" bind:value={quantity} />
		</div>
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
