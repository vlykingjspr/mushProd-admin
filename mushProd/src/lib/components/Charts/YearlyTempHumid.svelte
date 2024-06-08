<script lang="ts">
	// @ts-nocheck
	import { onMount } from 'svelte';
	import { Line } from 'svelte-chartjs';
	import { getTempHumidAveAsc } from '../Report/getData';

	// import { everyTempHumid } from './data.js';

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

	let everyTempHumid: any;
	async function getData() {
		let dayTempHumd: any = await getTempHumidAveAsc();
		console.log(dayTempHumd);

		// Group data by year
		const groupedByYear = {};
		dayTempHumd.forEach((entry) => {
			const entryDate = new Date(entry.date);
			const yearKey = entryDate.getFullYear();

			if (!groupedByYear[yearKey]) {
				groupedByYear[yearKey] = {
					'ave temp': 0,
					'ave humidity': 0,
					count: 0
				};
			}

			groupedByYear[yearKey]['ave temp'] += entry['ave temp'];
			groupedByYear[yearKey]['ave humidity'] += entry['ave humidity'];
			groupedByYear[yearKey].count += 1;
		});

		// Calculate average temperature and humidity for each year
		for (const yearKey in groupedByYear) {
			if (groupedByYear[yearKey].count > 0) {
				groupedByYear[yearKey]['ave temp'] /= groupedByYear[yearKey].count;
				groupedByYear[yearKey]['ave humidity'] /= groupedByYear[yearKey].count;
			}
		}

		const yearKeys = Object.keys(groupedByYear);
		const yearTempData = yearKeys.map((key) => groupedByYear[key]['ave temp']);
		const yearHumdData = yearKeys.map((key) => groupedByYear[key]['ave humidity']);

		everyTempHumid = {
			labels: yearKeys,
			datasets: [
				{
					label: 'Temperature',
					// fill: true,
					lineTension: 0.3,
					backgroundColor: 'rgba(225, 204,230, .3)',
					borderColor: 'rgba(11, 104, 158, 0.8)',
					borderCapStyle: 'butt',
					borderDash: [],
					borderDashOffset: 0.0,
					borderJoinStyle: 'miter',
					pointBorderColor: 'rgba(30, 147, 234, 0.8)',
					pointBackgroundColor: 'rgb(255, 255, 255)',
					pointBorderWidth: 10,
					pointHoverRadius: 5,
					pointHoverBackgroundColor: 'rgb(0, 0, 0)',
					pointHoverBorderColor: 'rgba(220, 220, 220,1)',
					pointHoverBorderWidth: 2,
					pointRadius: 1,
					pointHitRadius: 10,
					data: yearTempData
				},
				{
					label: 'Humidity',
					// fill: true,
					lineTension: 0.3,
					backgroundColor: 'rgba(225, 204,230, .3) ',
					borderColor: 'rgb(35, 26, 136)',
					borderCapStyle: 'butt',
					borderDash: [],
					borderDashOffset: 0.0,
					borderJoinStyle: 'miter',
					pointBorderColor: 'rgb(35, 26, 136)',
					pointBackgroundColor: 'rgb(255, 255, 255)',
					pointBorderWidth: 10,
					pointHoverRadius: 5,
					pointHoverBackgroundColor: 'rgb(0, 0, 0)',
					pointHoverBorderColor: 'rgba(220, 220, 220, 1)',
					pointHoverBorderWidth: 2,
					pointRadius: 1,
					pointHitRadius: 10,
					data: yearHumdData
				}
			]
		};
	}

	onMount(async () => {
		await getData();
		data = everyTempHumid; // Assign data after fetching is complete
	});
	let data = everyTempHumid;
</script>

<Line
	{data}
	options={{
		responsive: true,
		// plugins: {
		// 	title: {
		// 		display: true,
		// 		text: 'Daily Average',
		// 		position: 'top'
		// 	}
		// },
		scales: {
			y: {
				beginAtZero: true
			}
		}
	}}
/>
