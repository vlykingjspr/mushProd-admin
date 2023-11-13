<script lang="ts">
	import { Toast, getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	import { planted } from '$lib/stores/stores';
	import { doc, deleteDoc } from 'firebase/firestore';
	import { db } from '$lib/firebase/firebase';
	import { showSuccessToast, showErrorToast } from '../Toast/toast';

	export let parent: any;
	export let id: string;

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
	// Classes
	const cBase = 'card p-4 w-modal shadow-xl space-y-4 ';
	const cHeader = 'text-2xl font-bold';

	let selectedRowData: any;
	planted.subscribe((data) => {
		selectedRowData = data;
		id = selectedRowData.id;
	});
	async function confirmRemove(): Promise<void> {
		const userDocRef = doc(db, 'user', '123456');
		const bagsRecordDocRef = doc(userDocRef, 'bags record', id);
		try {
			await deleteDoc(bagsRecordDocRef);
			modalStore.close();
			removeToast();
		} catch (error) {
			errorToast();
		}
	}
</script>

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
			<h1>Are you sure you want to remove the fruiting bags?</h1>
		</div>

		<!-- prettier-ignore -->
		<footer class="modal-footer {parent.regionFooter}">
			
			<button class="btn variant-filled-error" on:click={confirmRemove}>Yes</button>
			<button class="btn variant-filled-tertiary" on:click={onFormSubmit}>No</button>
		</footer>
	</div>
{/if}
