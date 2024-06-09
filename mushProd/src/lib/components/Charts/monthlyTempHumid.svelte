<script lang="ts">
	// @ts-nocheck
	import { onMount } from 'svelte';
	import { Line } from 'svelte-chartjs';
	import { getTempHumidAveAsc } from '../Report/getData';
	import { selectedMonth, yearsStore } from '$lib/stores/stores';
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

	export let selectedYear;

	ChartJS.register(Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale);

	let everyTempHumid: any;
	$: {
		getData();
	}
	$: selectedYear, getData(selectedYear);
	$: everyTempHumid, (data = everyTempHumid);
	async function getData() {
		let dayTempHumd: any = await getTempHumidAveAsc();

		// Filter data for the selected year
		dayTempHumd = dayTempHumd.filter(
			(entry) => new Date(entry.date).getFullYear() === selectedYear
		);

		// Initialize groupedByMonth with all months for the selected year
		const groupedByMonth = {};
		const monthNames = [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December'
		];
		for (let month = 0; month < 12; month++) {
			const monthYearKey = `${monthNames[month]}-${selectedYear}`;
			groupedByMonth[monthYearKey] = {
				'ave temp': 0,
				'ave humidity': 0,
				count: 0
			};
		}

		// Group data by month
		dayTempHumd.forEach((entry) => {
			const entryDate = new Date(entry.date);
			const monthYearKey = `${monthNames[entryDate.getMonth()]}-${selectedYear}`;

			groupedByMonth[monthYearKey]['ave temp'] += entry['ave temp'];
			groupedByMonth[monthYearKey]['ave humidity'] += entry['ave humidity'];
			groupedByMonth[monthYearKey].count += 1;
		});

		// Calculate average temperature and humidity for each month
		for (const monthYearKey in groupedByMonth) {
			if (groupedByMonth[monthYearKey].count > 0) {
				groupedByMonth[monthYearKey]['ave temp'] /= groupedByMonth[monthYearKey].count;
				groupedByMonth[monthYearKey]['ave humidity'] /= groupedByMonth[monthYearKey].count;
			}
		}

		const monthYearKeys = Object.keys(groupedByMonth);
		const monthTempData = monthYearKeys.map((key) => groupedByMonth[key]['ave temp']);
		const monthHumdData = monthYearKeys.map((key) => groupedByMonth[key]['ave humidity']);

		everyTempHumid = {
			labels: monthYearKeys,
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
					data: monthTempData
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
					data: monthHumdData
				}
			]
		};
	}

	onMount(async () => {
		await getData(selectedYear);
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
