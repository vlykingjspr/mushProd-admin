<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { notifications } from '$lib/stores/stores';

	/** Exposes parent props to this component. */
	export let parent: any;

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

	let date: string;
	let id: string;
	let alertMessage: string;
	let temperature: string;
	let humidity: string;

	let selectedRowData: any;
	notifications.subscribe((data) => {
		selectedRowData = data;
		id = selectedRowData.id;
		date = selectedRowData.date;
		alertMessage = selectedRowData.alertMessage;
		temperature = selectedRowData.temperature;
		humidity = selectedRowData.humidity;
	});
</script>

<!-- @component This example creates a simple form modal. -->

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>
			<div class="flex items-center justify-center">Notification</div>
		</header>
		<article />

		<h1 class="text-lg">{date}</h1>

		<h1 class="text-base">
			Optimal temperature exceed : <strong class="text-lg">{temperature}°C</strong>
		</h1>
		<h1 class="text-base">
			Optimal humidity exceed : <strong class="text-lg">{humidity}%</strong>
		</h1>
		<h1>
			{alertMessage}
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
