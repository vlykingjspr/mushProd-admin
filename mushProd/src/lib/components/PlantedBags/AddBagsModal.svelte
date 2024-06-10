<script lang="ts">
	import { getModalStore, getToastStore, Toast, type ToastSettings } from '@skeletonlabs/skeleton';
	import { showSuccessToast, showErrorToast } from '../Toast/toast';
	import { Timestamp, addDoc, collection } from 'firebase/firestore';
	import { db } from '$lib/firebase/firebase';
	import { addMinutes, format, parse } from 'date-fns';
	import { onMount, tick } from 'svelte';

	/** Exposes parent props to this component. */
	export let parent: any;

	// Local
	const modalStore = getModalStore();
	const toastStore = getToastStore();

	function addedToast() {
		showSuccessToast(toastStore, 'Bag Recorded Successfully');
	}

	function errorToast() {
		showErrorToast(toastStore, 'Failed to Record Bags');
	}
	// Base Classes
	const cBase = 'card p-4 w-modal shadow-xl space-y-4 ';
	const cHeader = 'text-2xl font-bold';

	let batch_planted: any;
	let batch_total_bags: number;
	let batch_total_removed: number;
	let batch_remarks: string = '';
	let batch_harvest: [];
	let batch_code: string;
	let errorMessage: string = '';
	let isDisable: boolean = false;

	function generateBatchCode(date: Date): string {
		const day = format(date, 'dd');
		const month = format(date, 'MMM').toUpperCase(); // Format month as three-letter abbreviation in uppercase
		const year = format(date, 'yy');
		const batchCode = `#OM${day}${month}${year}`;
		return batchCode;
	}

	async function addData(): Promise<void> {
		if (!batch_planted || !batch_total_bags) {
			errorMessage = 'Date and grams are required.';

			return;
		}

		const formattedDate = parse(batch_planted, 'yyyy-MM-dd', new Date());
		const code = generateBatchCode(formattedDate);

		// Get the current time
		const currentTime = new Date();

		// Set the time of the parsed date to the current time
		const combinedDateTime = addMinutes(
			formattedDate,
			currentTime.getHours() * 60 + currentTime.getMinutes()
		);

		const data = {
			batch_code: code,
			batch_planted: Timestamp.fromDate(combinedDateTime),
			batch_total_bags,
			batch_remarks,
			batch_total_removed: 0
		};

		const userDocRef = collection(db, 'user', '123456', 'batch');
		try {
			// Add the data to Firestore
			const docRef = await addDoc(userDocRef, data);
			// Now, add the subcollection (batch_harvest) to the main batch document
			const batchHarvestRef = collection(docRef, 'batch_harvest');
			// console.log('Document added with ID: ', docRef.id);
			addedToast();
			modalStore.close();
		} catch (error) {
			errorToast();
		}
	}
</script>

<!-- @component This example creates a simple form modal. -->

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>
			<div class="flex items-center justify-center">
				<i class="fa-solid fa-plus mr-2" />
				Add Fruiting Bags
			</div>
		</header>
		<hr class="opacity-50" />

		<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
			<div class="input-group-shim">
				<span class="material-symbols-outlined"> calendar_today </span>
			</div>
			<input type="date" placeholder="Date" bind:value={batch_planted} />
		</div>
		<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
			<div class="input-group-shim">
				<span class="material-symbols-outlined"> psychiatry </span>
			</div>
			<input type="number" placeholder="Number of Bags" bind:value={batch_total_bags} />
		</div>
		<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
			<div class="input-group-shim">
				<span class="material-symbols-outlined"> description </span>
			</div>
			<textarea class="textarea" rows="3" placeholder="Batch Remarks" bind:value={batch_remarks} />
		</div>
		{#if errorMessage}
			<p class="text-red-500">{errorMessage}</p>
		{/if}

		<!-- prettier-ignore -->
		<footer class="modal-footer {parent.regionFooter}">
			
			<button class="btn  {parent.buttonPositive}" on:click={addData}  disabled={isDisable}>OK</button>
			<button class="btn {parent.buttonNeutral}" on:click={parent.onClose}
				>{parent.buttonTextCancel}</button
			>
		</footer>
	</div>
{/if}
