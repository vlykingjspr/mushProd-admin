<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { notifications } from '$lib/stores/stores';
	import { format } from 'date-fns';

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
	let alertTitle: string;
	let temperature: string;
	let humidity: string;
	let time: string;

	let selectedRowData: any;
	notifications.subscribe((data) => {
		selectedRowData = data;
		id = selectedRowData.id;
		date = selectedRowData.date;
		alertTitle = selectedRowData.alertTitle;
		alertMessage = selectedRowData.alertMessage;
		temperature = selectedRowData.temperature;
		humidity = selectedRowData.humidity;
		time = selectedRowData.time;
	});
	function convertTo12HourFormat(time: String) {
		if (!time) {
			return "No time"
		}
        return format(new Date(`2000-01-01T${time}`), 'h:mm:ss aa');
    }
</script>

<!-- @component This example creates a simple form modal. -->

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>
			<div class="flex items-center justify-center">
				<i class="fa-solid fa-circle-exclamation mr-2" />
				Notification
			</div>
		</header>
		<article />
		<hr class="opacity-50" />

		<div class="flex justify-between items-center">
			<h1 class="text-lg">
				<strong>
					<i class="fa-solid fa-bell mr-1" />
					{alertTitle}
				</strong>
			</h1>
			<h1 class="text-lg">
				<strong>
					<i class="fa-solid fa-calendar-days mr-1" />
					{date ? format(new Date(date.seconds * 1000), 'MMMM dd, yyyy hh:mm:ss a') : 'N/A'}
					<!-- {date} -  -->
					<!-- {convertTo12HourFormat(time)} -->
				</strong>
			</h1>
		</div>
		<div class="flex justify-between items-center">
			<h1 class="text-base">
				Optimal Temperature exceed : <strong class="text-1xl md:text-1xl lg:text-2xl"
					>{temperature}°C</strong
				>
			</h1>
			<h1 class="text-base">
				Optimal Humidity exceed : <strong class="text-1xl md:text-1xl lg:text-2xl"
					>{humidity}%</strong
				>
			</h1>
		</div>

		<blockquote class="blockquote">
			{alertMessage}
		</blockquote>
		<!-- prettier-ignore -->
		<footer class="modal-footer {parent.regionFooter}">
			<!-- <button class="btn {parent.buttonNeutral}" on:click={parent.onClose}
				>{parent.buttonTextCancel}</button
			> -->
			<button class="btn {parent.buttonPositive}" on:click={onFormSubmit}>OK</button>
		</footer>
	</div>
{/if}
