<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { tempHumid } from '$lib/stores/stores';

	/** Exposes parent props to this component. */
	export let parent: any;
	export let id: string;
	export let date: string;
	export let ave_temp: number;
	export let ave_humid: number;
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
	tempHumid.subscribe((data) => {
		selectedRowData = data;
		id = selectedRowData.id;
		date = selectedRowData.date;
		ave_temp = selectedRowData.ave_temp;
		ave_humid = selectedRowData.ave_humd;
	});
</script>

<!-- @component This example creates a simple form modal. -->

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>
			<div class="flex items-center justify-center">Temperature & Humidity Record</div>
		</header>

		<hr class="opacity-50" />

		<div class="flex justify-between items-center">
			<h1 class="text-lg">
				<strong>
					<i class="fa-solid fa-calendar-days mr-1" />
					{date}
				</strong>
			</h1>
		</div>
		<h1 class="text-1xl md:text-1xl lg:text-1xl">
			Average Temperature: <strong>{ave_temp} </strong>
			<br />
			Average Humidity: <strong>{ave_humid}</strong>
		</h1>

		<blockquote class="blockquote" />

		<!-- prettier-ignore -->
		<footer class="modal-footer {parent.regionFooter}">
			<!-- <button class="btn {parent.buttonNeutral}" on:click={parent.onClose}
				>{parent.buttonTextCancel}</button
			> -->
			<button class="btn {parent.buttonPositive}" on:click={onFormSubmit}>OK</button>
		</footer>
	</div>
{/if}
