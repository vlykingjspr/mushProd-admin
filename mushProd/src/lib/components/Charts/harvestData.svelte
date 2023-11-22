<script lang="ts">
	// @ts-nocheck

	import { Bar } from 'svelte-chartjs';
	import { harvestData } from './data.js';

	import { Chart, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

	Chart.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

	let data = harvestData;
</script>

<Bar
	{data}
	options={{
		responsive: true,
		plugins: {
			legend: {
				display: false
			}
		},
		scales: {
			y: {
				beginAtZero: true
			}
		}
	}}
/>
