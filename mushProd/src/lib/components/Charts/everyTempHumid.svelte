<script lang="ts">
	// @ts-nocheck

	import { Line } from 'svelte-chartjs';
	import { everyTempHumid } from './data.js';

	let data = everyTempHumid;
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
		plugins: {
			title: {
				display: true,
				text: 'Daily Average',
				position: 'top'
			}
		},
		scales: {
			y: {
				beginAtZero: true
			}
		}
	}}
/>
