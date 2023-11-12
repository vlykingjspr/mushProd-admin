<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { notifications } from '$lib/stores/stores';
	import { doc, deleteDoc, collection } from 'firebase/firestore';
	import { db } from '$lib/firebase/firebase';
	/** Exposes parent props to this component. */
	export let parent: any;

	// Local
	const modalStore = getModalStore();
	export let id: string;

	let selectedRowData: any;

	// Handle Form Submission
	notifications.subscribe((data) => {
		selectedRowData = data;
		id = selectedRowData.id;
	});
	console.log(id);
	async function confirmRemove(): Promise<void> {
		const userDocRef = doc(db, 'user', '123456');
		const bagsRecordDocRef = doc(userDocRef, 'notifications', id);
		try {
			await deleteDoc(bagsRecordDocRef);
			console.log('success');
			modalStore.close();
		} catch (error) {
			console.error('Error deleting document:', error);
		}
	}

	// Base Classes
	const cBase = 'card p-4 w-modal shadow-xl space-y-4 ';
	const cHeader = 'text-2xl font-bold';
</script>

<!-- @component This example creates a simple form modal. -->

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>
			<div class="flex items-center">
				<i class="fa-solid fa-trash mr-2" />

				Please Confirm to Remove
			</div>
		</header>
		<div>
			<h1>Are you sure you want to remove the fruiting bags?</h1>
		</div>

		<!-- prettier-ignore -->
		<footer class="modal-footer {parent.regionFooter}">
			
			<button class="btn variant-filled-error" on:click={confirmRemove}>Yes</button>
			
			<button class="btn {parent.buttonNeutral}" on:click={parent.onClose}
				>{parent.buttonTextCancel}</button
			>
		</footer>
	</div>
{/if}
