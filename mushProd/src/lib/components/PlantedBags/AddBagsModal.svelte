<script lang="ts">
	import { getModalStore, getToastStore, Toast, type ToastSettings } from '@skeletonlabs/skeleton';
	import { showSuccessToast, showErrorToast } from '../Toast/toast';
	import { Timestamp, addDoc, collection } from 'firebase/firestore';
	import { db } from '$lib/firebase/firebase';
	import { parse } from 'date-fns';
	import { tick } from 'svelte';

	/** Exposes parent props to this component. */
	export let parent: any;

	// Local
	const modalStore = getModalStore();

	function addedToast() {
		showSuccessToast('Bag Recorded Successfully');
	}
	function errorToast() {
		showErrorToast('Failed to Record Bags');
	}
	// Base Classes
	const cBase = 'card p-4 w-modal shadow-xl space-y-4 ';
	const cHeader = 'text-2xl font-bold';

	let date: any;
	let quantity: any;
	let remarks: string;

	let errorMessage: string = '';
	let isDisable: boolean = false;
	let toastSucc: any = null;
	let toastError: any = null;
	async function addData(): Promise<void> {
		if (!date || !quantity) {
			errorMessage = 'Date and grams are required.';

			return;
		}
		const formattedDate = parse(date, 'yyyy-MM-dd', new Date());
		date = Timestamp.fromDate(formattedDate);
		const data = {
			date,
			quantity,
			remarks
		};

		const userDocRef = collection(db, 'user', '123456', 'bags record');
		try {
			// Add the data to Firestore
			const docRef = await addDoc(userDocRef, data);
			console.log('Document added with ID: ', docRef.id);

			addedToast();

			modalStore.close();
		} catch (error) {
			console.error('Error adding document: ', error);
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
		<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
			<div class="input-group-shim"><i class="fa-solid fa-calendar" /></div>
			<input type="date" placeholder="Date" bind:value={date} />
		</div>
		<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
			<div class="input-group-shim"><i class="fa-solid fa-seedling" /></div>
			<input type="number" placeholder="Number of Bags" bind:value={quantity} />
		</div>
		<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
			<div class="input-group-shim"><i class="fa-solid fa-calendar" /></div>
			<textarea class="textarea" rows="3" placeholder="Remarks" bind:value={remarks} />
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
