<script lang="ts">
	// @ts-nocheck
	import { onMount } from 'svelte';
	import { Line } from 'svelte-chartjs';
	import { getTempHumidAveAsc } from '../Report/getData';
	// import { selectedMonth } from '$lib/stores/stores';
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

	export let selectedMonth;

	ChartJS.register(Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale);

	let noData = false;
	let everyTempHumid: any;
	$: selectedMonth, getData(selectedMonth);
	$: everyTempHumid, (data = everyTempHumid);
	const currentYear = new Date().getFullYear();
	async function getData(month: string) {
		let dayTempHumd: any = await getTempHumidAveAsc();
		// console.log(dayTempHumd);
		dayTempHumd = dayTempHumd.filter((entry) => {
			const entryDateParts = entry.date.split(', ');
			const entryMonth = entryDateParts[0].split(' ')[0];
			const entryYear = Number(entryDateParts[1]);

			// Check if the entry is from the selected month and the current year
			return entryMonth === month && entryYear === currentYear;
		});

		const dayDateData = dayTempHumd.map((entry: any) => entry.date);
		const dayTempData = dayTempHumd.map((entry: any) => entry['ave temp']);
		const dayHumdData = dayTempHumd.map((entry: any) => entry['ave humidity']);

		everyTempHumid = {
			labels: dayDateData,
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
					data: dayTempData
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
					data: dayHumdData
				}
			]
		};
	}

	onMount(async () => {
		await getData(selectedMonth);
		data = everyTempHumid; // Assign data after fetching is complete
	});
	let data = everyTempHumid;
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
