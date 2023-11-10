<script lang="ts">
	import Chart from '$lib/components/Charts/Chart.svelte';

	const cardStyle = 'card card-hover overflow-hidden ';
	const cardInsideStyle = 'p-4 space-y-4';
	const h2Style = 'text-1xl md:text-2xl lg:text-4xl';
	const h3Style = 'text-l md:text-1xl lg:text-2xl';
	const valueStyle = 'flex justify-center items-center text-9xl md:text-7xl lg:text-8xl';
	const smallValueStyle = 'flex justify-center items-center text-5xl';
	const smallerValueStyle = 'flex justify-center items-center text-4xl';
</script>

<div class="w-full text-token grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
	<div class="md:col-span-2"><Chart /></div>
	<div class={cardStyle}>
		<div class={cardInsideStyle}>
			<h2 class={h2Style}>Temperature</h2>
			<hr class="opacity-50" />
			<div class={valueStyle}><h1>23°C</h1></div>
		</div>
	</div>
</div>
