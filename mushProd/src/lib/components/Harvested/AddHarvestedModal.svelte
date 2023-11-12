<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { collection, addDoc, Timestamp } from 'firebase/firestore';
	import { harvested } from '$lib/stores/stores';
	import { db } from '$lib/firebase/firebase';
	import { format, parse } from 'date-fns';

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

	let date_harvested: any;
	let grams: number;
	let remarks: string = '';
	let errorMessage: string = '';
	let isDisable: boolean = false;
	// Handle Form Submission
	async function addData(): Promise<void> {
		if (!date_harvested || !grams) {
			errorMessage = 'Date and quantity are required.';

			return;
		}

		const formattedDate = parse(date_harvested, 'yyyy-MM-dd', new Date());
		date_harvested = Timestamp.fromDate(formattedDate);
		const data = {
			date_harvested,
			grams,
			remarks
		};

		const userDocRef = collection(db, 'user', '123456', 'harvest record');
		try {
			// Add the data to Firestore
			const docRef = await addDoc(userDocRef, data);
			console.log('Document added with ID: ', docRef.id);

			// Close the modal
			modalStore.close();
		} catch (error) {
			console.error('Error adding document: ', error);
			// Handle the error, show a message, or take appropriate action
		}
	}
</script>

<!-- @component This example creates a simple form modal. -->

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>
			<div class="flex items-center justify-center">
				<i class="fa-solid fa-plus mr-2" />
				Add Harvested Data
			</div>
		</header>
		<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
			<div class="input-group-shim"><i class="fa-solid fa-calendar" /></div>
			<input type="date" placeholder="Date" bind:value={date_harvested} />
		</div>
		<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
			<div class="input-group-shim"><i class="fa-solid fa-weight-scale" /></div>
			<input type="number" placeholder="Grams Harvested" bind:value={grams} />
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
			<button class="btn {parent.buttonPositive}" on:click={addData}>OK</button>
			<button class="btn {parent.buttonNeutral}" on:click={parent.onClose}
				>{parent.buttonTextCancel}</button
			>
		</footer>
	</div>
{/if}
