<script lang="ts">
	// @ts-nocheck
	// @ts-nocheck
	import { onMount } from 'svelte';
	import { getHourlyAverages } from '../Data/calculateAverage';
	import { Line } from 'svelte-chartjs';

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

	let tempData: number[] = [];
	let humdData: number[] = [];
	let hrData: string[] = [];
	let dailyTempHumd: any;
	// let temperatureData: number[];
	// let humidityData: number[];
	// let hourData: string[];
	// let data: any;

	async function getData() {
		const averagesArray = await getHourlyAverages();
		averagesArray.sort((a, b) => {
			const hourA = parseInt(a.Hour);
			const hourB = parseInt(b.Hour);
			return hourA - hourB;
		});

		tempData = averagesArray.map((entry) => Math.floor(entry.AverageTemperature));
		humdData = averagesArray.map((entry) => Math.floor(entry.AverageHumidity));
		hrData = averagesArray.map((entry) => entry.Hour);
		// console.log(tempData);
		// console.log(humdData);
		// console.log(hrData);

		dailyTempHumd = {
			labels: hrData,
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
					data: tempData
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
					data: humdData
				}
			]
		};
	}
	onMount(async () => {
		await getData();
		data = dailyTempHumd; // Assign data after fetching is complete
	});

	// let tempData: number[] = [30, 30];
	// let humdData: number[] = [81, 75];
	// let hrData: string[] = ['10', '11'];

	// // let data = dailyTempHumd;
	// import { dailyTempHumd } from './data.js';
	// console.log(tempData);
	let data = dailyTempHumd;
	ChartJS.register(Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale);
</script>

<Line
	{data}
	options={{
		responsive: true,
		// plugins: {
		// 	title: {
		// 		display: true,
		// 		text: 'Hourly Average Temperature and Humidity',
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
