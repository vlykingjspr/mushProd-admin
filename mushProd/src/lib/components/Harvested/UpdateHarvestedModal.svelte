<script lang="ts">
	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	import { harvested } from '$lib/stores/stores';
	import { collection, doc, updateDoc } from 'firebase/firestore';
	import { db } from '$lib/firebase/firebase';
	import { showErrorToast, showUpdateToast } from '../Toast/toast';

	export let parent: any;

	// Local
	const modalStore = getModalStore();
	const toastStore = getToastStore();

	function updatedToast() {
		showUpdateToast(toastStore, 'Harvested Data Updated Successfully');
	}
	function errorToast(error: any) {
		showErrorToast(toastStore, `Failed to Updated  Harvested Data ${error}`);
	}
	// Classes
	const cBase = 'card p-4 w-modal shadow-xl space-y-4 ';
	const cHeader = 'text-2xl font-bold';

	let date: string;
	let id: string;
	let grams: number;
	let remarks: string;
	let batch_id: string;
	let selectedRowData: any;
	harvested.subscribe((data) => {
		selectedRowData = data;
		batch_id = selectedRowData.batch_id;
		id = selectedRowData.id;
		date = selectedRowData.date;
		grams = selectedRowData.grams;
		remarks = selectedRowData.remarks;
	});

	async function updateData() {
		const userDocRef = doc(db, 'user', '123456');
		const batchDocRef = doc(userDocRef, 'batch', batch_id, 'batch_harvest', id);

		const updatedData = {
			grams: grams,
			remarks: remarks
		};

		try {
			await updateDoc(batchDocRef, updatedData);
			modalStore.close();
			updatedToast();
		} catch (error) {
			errorToast(error);
		}
	}
</script>

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>
			<div class="flex items-center justify-center">
				<i class="fa-solid fa-pen-to-square mr-2" />
				Update Harvested Mushrooms
			</div>
		</header>
		<hr class="opacity-50" />

		<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
			<div class="input-group-shim"><i class="fa-solid fa-calendar" /></div>
			<p class=" p-2">{date}</p>
		</div>
		<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
			<div class="input-group-shim"><i class="fa-solid fa-seedling" /></div>
			<input type="number" placeholder="Grams" bind:value={grams} />
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
