<script lang="ts">
	import { currentPageTitle } from '$lib/stores/stores';
	import { Modal, ProgressRadial } from '@skeletonlabs/skeleton';
	import { fade } from 'svelte/transition';
	import { loading } from '$lib/stores/stores';

	import { format } from 'date-fns';

	function updateTitle(title: string): void {
		currentPageTitle.set(title);
	}
	const cardStyle = 'card card-hover overflow-hidden ';
	const chartStyle = 'card card-hover bg-surface-100 overflow-hidden ';
	const cardInsideStyle = 'p-4 space-y-4';
	const h2Style = 'text-1xl md:text-2xl lg:text-2xl';
	const h3Style = 'text-l md:text-1xl lg:text-1xl';
	const valueStyle = 'flex justify-center items-center text-7xl md:text-4xl lg:text-8xl';
	const smallValueStyle = 'flex justify-center items-center text-5xl';
	const smallerValueStyle = 'flex justify-center items-center text-2xl';

	const currdate = new Date();
	const currdateformatted = format(currdate, 'MMMM dd, yyyy');

	$loading = false;
</script>

<Modal transitionIn={fade} transitionInParams={{ duration: 200 }} />

{#if $loading}
	<!-- Display the ProgressRadial when isLoading is true -->
	<div class="flex justify-center items-center h-screen">
		<ProgressRadial value={undefined} />
	</div>
{:else}
	<div class="flex items-center justify-end mr-2">
		<div class="">
			{currdateformatted}
		</div>
	</div>

	<div class="w-full text-token grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
		<div class={cardStyle}>
			<div class={cardInsideStyle}>
				<a href="/dashboard" on:click={() => updateTitle('Dashboard')}>
					<div class={valueStyle}>
						<i class="fa-solid fa-square-poll-vertical fa-md" />
					</div>
					<hr class="opacity-50 mt-2" />

					<h2 class={h2Style}>Dashboard</h2>
				</a>
			</div>
		</div>
		<div class={cardStyle}>
			<div class={cardInsideStyle}>
				<a href="/yield" on:click={() => updateTitle('Yield')}>
					<div class={valueStyle}>
						<i class="fa-solid fa-weight-scale fa-md" />
					</div>
					<hr class="opacity-50 mt-2" />

					<h2 class={h2Style}>Yield</h2>
				</a>
			</div>
		</div>
		<div class={cardStyle}>
			<div class={cardInsideStyle}>
				<a href="/records" on:click={() => updateTitle('Records')}>
					<div class={valueStyle}>
						<i class="fa-solid fa-clipboard fa-md" />
					</div>
					<hr class="opacity-50 mt-2" />

					<h2 class={h2Style}>Records</h2>
				</a>
			</div>
		</div>
		<div class={cardStyle}>
			<div class={cardInsideStyle}>
				<a href="/notification" on:click={() => updateTitle('Notification')}>
					<div class={valueStyle}>
						<i class="fa-solid fa-bell fa-md" />
					</div>
					<hr class="opacity-50 mt-2" />

					<h2 class={h2Style}>Notification</h2>
				</a>
			</div>
		</div>
	</div>
{/if}
