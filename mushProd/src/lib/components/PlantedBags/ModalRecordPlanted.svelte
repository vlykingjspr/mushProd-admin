<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { planted } from '$lib/stores/stores';

	/** Exposes parent props to this component. */
	export let parent: any;
	export let id: string;
	export let date: string;
	export let quantity: number;
	export let remarks: string;
	// Local
	const modalStore = getModalStore();

	// Handle Form Submission
	function onFormSubmit(): void {
		// if ($modalStore[0].response) $modalStore[0].response('ok');
		modalStore.close();
	}

	// Base Classes
	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';

	let selectedRowData: any;
	planted.subscribe((data) => {
		selectedRowData = data;
		id = selectedRowData.id;
		date = selectedRowData.date;
		quantity = selectedRowData.quantity;
		remarks = selectedRowData.remarks;
	});
</script>

<!-- @component This example creates a simple form modal. -->

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>
			<div class="flex items-center justify-center">Record</div>
		</header>
		<article />

		<h1 class="text-lg">{date}</h1>
		<h1 class="text-base">
			Quantity Planted : <strong class="text-lg">{quantity}</strong>
		</h1>
		<h1>
			{remarks}
		</h1>

		<!-- prettier-ignore -->
		<footer class="modal-footer {parent.regionFooter}">
			<!-- <button class="btn {parent.buttonNeutral}" on:click={parent.onClose}
				>{parent.buttonTextCancel}</button
			> -->
			<button class="btn {parent.buttonPositive}" on:click={onFormSubmit}>OK</button>
		</footer>
	</div>
{/if}
