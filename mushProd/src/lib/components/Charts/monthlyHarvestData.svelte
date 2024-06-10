<script lang="ts">
	// @ts-nocheck
	import { onMount } from 'svelte';
	import { Bar } from 'svelte-chartjs';
	// import { harvestData } from './data.js';
	import { getHarvestData } from '../Report/getData';
	import { Chart, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

	Chart.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

	let harvestData: any;

	function getMonthFromBatchCode(batchCode: string) {
		return batchCode.slice(-5, -2);
	}
	export let yearCurrHarvest;

	$: {
		getData();
	}
	$: yearCurrHarvest, getData(yearCurrHarvest);
	$: harvestData, (data = harvestData);
	async function getData() {
		console.log(yearCurrHarvest);
		let harvData: any = await getHarvestData();
		harvData = harvData.filter((data: any) => data.batchCode.slice(-2) === yearCurrHarvest);
		const groupedData = harvData.reduce((acc: any, curr: any) => {
			const month = getMonthFromBatchCode(curr.batchCode);
			if (!acc[month]) {
				acc[month] = { totalHarvests: 0, totalGrams: 0 };
			}
			acc[month].totalHarvests += curr.totalHarvests;
			acc[month].totalGrams += curr.totalGrams;
			return acc;
		}, {});

		const harvCode = Object.keys(groupedData);
		const harvGrams = Object.values(groupedData).map((entry: any) => entry.totalGrams);

		harvestData = {
			labels: harvCode,
			datasets: [
				{
					label: 'Grams',
					data: harvGrams,
					backgroundColor: [
						'rgba(255, 134,159,0.4)',
						'rgba(98,  182, 239,0.4)',
						'rgba(255, 218, 128,0.4)',
						'rgba(113, 205, 205,0.4)',
						'rgba(170, 128, 252,0.4)',
						'rgba(255, 177, 101,0.4)'
					],
					borderWidth: 2,
					borderColor: [
						'rgba(255, 134, 159, 1)',
						'rgba(98,  182, 239, 1)',
						'rgba(255, 218, 128, 1)',
						'rgba(113, 205, 205, 1)',
						'rgba(170, 128, 252, 1)',
						'rgba(255, 177, 101, 1)'
					]
				}
			],
			options: {
				plugins: {
					legend: {
						display: false // Set to false to hide the legend
					}
				}
			}
		};
	}

	onMount(async () => {
		await getData();
		data = harvestData; // Assign data after fetching is complete
	});
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
