<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { planted } from '$lib/stores/stores';
	import { doc, deleteDoc } from 'firebase/firestore';
	import { db } from '$lib/firebase/firebase';

	export let parent: any;
	export let id: string;

	const modalStore = getModalStore();

	function onFormSubmit(): void {
		modalStore.close();
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
		} catch (error) {
			console.error('Error deleting document:', error);
		}
	}
</script>

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>
			<div class="flex items-center justify-center">Please Confirm to Remove</div>
		</header>
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
