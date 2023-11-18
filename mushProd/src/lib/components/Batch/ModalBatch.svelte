<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { batch } from '$lib/stores/stores';

	export let parent: any;
	let id: string;
	let batch_code: string;
	let batch_planted: string;
	let batch_total_bags: number;
	let batch_total_removed: number;
	let batch_remarks: string;

	const modalStore = getModalStore();

	batch.subscribe((data) => {
		// Log the data for debugging
		console.log('Subscribed batch data: ', data);

		id = data.id;
		batch_code = data.batch_code;
		batch_planted = data.batch_planted;
		batch_total_bags = data.batch_total_bags;
		batch_total_removed = data.batch_total_removed;
		batch_remarks = data.batch_remarks;
	});

	function onFormSubmit(): void {
		modalStore.close();
	}

	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';
</script>

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>
			<div class="flex items-center justify-center">
				<i class="fa-solid fa-clipboard mr-2" />
				Record
			</div>
		</header>

		<hr class="opacity-50" />
		{id}
		<div class="flex justify-between items-center">
			<h1 class="text-lg">
				<strong>
					<i class="fa-solid fa-calendar-days mr-1" />
					{batch_planted}
				</strong>
			</h1>
		</div>
		<h1 class="text-1xl md:text-1xl lg:text-1xl">
			Bags Planted: <strong>{batch_total_bags} bags</strong>Harvest:
			<strong>{batch_total_removed} grams</strong>
		</h1>

		<blockquote class="blockquote">
			{batch_remarks}
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
