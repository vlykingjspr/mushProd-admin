<script lang="ts">
	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	import { notifications } from '$lib/stores/stores';
	import { doc, deleteDoc, collection } from 'firebase/firestore';
	import { db } from '$lib/firebase/firebase';
	import { showErrorToast } from '../Toast/toast';

	/** Exposes parent props to this component. */
	export let parent: any;

	// Local
	const modalStore = getModalStore();
	const toastStore = getToastStore();

	export let id: string;

	let selectedRowData: any;
	function removeToast() {
		showErrorToast(toastStore, 'Notification Removed Successfully');
	}
	function errorToast() {
		showErrorToast(toastStore, 'Failed to Remove Notification');
	}
	// Handle Form Submission
	notifications.subscribe((data) => {
		selectedRowData = data;
		id = selectedRowData.id;
	});

	async function confirmRemove(): Promise<void> {
		const userDocRef = doc(db, 'user', '123456');
		const bagsRecordDocRef = doc(userDocRef, 'notifications', id);
		try {
			await deleteDoc(bagsRecordDocRef);
			removeToast();

			modalStore.close();
		} catch (error) {
			errorToast();
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
		<hr class="opacity-50" />

		<div>
			<h1>Are you sure you want to remove the notification?</h1>
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
