<script lang="ts">
	// @ts-nocheck

	import { Line } from 'svelte-chartjs';
	import { data } from './data.ts';

	import {
		Chart as ChartJS,
		Title,
		Tooltip,
		Legend,
		LineElement,
		LinearScale,
		PointElement,
		CategoryScale
	} from 'chart.js';

	ChartJS.register(Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale);
</script>

<Line
	{data}
	options={{
		responsive: true,
		scales: {
			y: {
				beginAtZero: true
			}
		}
	}}
/>
