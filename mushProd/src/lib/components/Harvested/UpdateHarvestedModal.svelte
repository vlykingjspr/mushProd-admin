<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { harvested } from '$lib/stores/stores';
	import { doc, updateDoc } from 'firebase/firestore';
	import { db } from '$lib/firebase/firebase';

	export let parent: any;

	// Local
	const modalStore = getModalStore();

	function onFormSubmit(): void {
		modalStore.close();
	}

	// Classes
	const cBase = 'card p-4 w-modal shadow-xl space-y-4 ';
	const cHeader = 'text-2xl font-bold';

	let date_harvested: string;
	let id: string;
	let grams: number;
	let remarks: string;

	let selectedRowData: any;
	harvested.subscribe((data) => {
		selectedRowData = data;
		id = selectedRowData.id;
		date_harvested = selectedRowData.date_harvested;
		grams = selectedRowData.grams;
		remarks = selectedRowData.remarks;
	});
	async function updateData() {
		const userDocRef = doc(db, 'user', '123456');
		const bagsRecordDocRef = doc(userDocRef, 'harvest record', id);

		const updatedData = {
			date_harvested: date_harvested,
			grams: grams,
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
			<div class="flex items-center justify-center">
				<i class="fa-solid fa-pen-to-square mr-2" />
				Update Harvested Mushrooms
			</div>
		</header>
		<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
			<div class="input-group-shim"><i class="fa-solid fa-calendar" /></div>
			<h1 class="h3 p-2">{date_harvested}</h1>
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
