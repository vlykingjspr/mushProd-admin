
import { onMount } from 'svelte';
import { getHourlyAverages } from '../Data/calculateAverage';
import { getHarvestData } from '../Report/getData';
import { getTempHumidAve } from '../Report/getData';



let tempData;
let humdData
let hrData
const averagesArray = await getHourlyAverages();
averagesArray.sort((a, b) => {
  // Convert "Hour" values to numbers for proper numerical comparison
  const hourA = parseInt(a.Hour);
  const hourB = parseInt(b.Hour);

  // Compare the "Hour" values
  return hourA - hourB;
});


// Process averagesArray and update data and data2
const temperatureData = averagesArray.map((entry) => Math.floor(entry.AverageTemperature));
const humidityData = averagesArray.map((entry) => Math.floor(entry.AverageHumidity));
const hourData = averagesArray.map((entry) => entry.Hour)
$: tempData = temperatureData
$: humdData = humidityData
$: hrData = hourData
export const dailyTempHumd = {
  labels: hrData,
  datasets: [
    {
      label: 'Temperature',
      fill: true,
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
      data: tempData,
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
      data: humdData,
    },
  ],
};

let harvCodeData;
let harvGramsData;
const harvData: any = await getHarvestData();
const harvCode = harvData.map((entry: any) => entry.batchCode);
const harvGrams = harvData.map((entry: any) => entry.totalGrams);
$: harvCodeData = harvCode
$: harvGramsData = harvGrams

export const harvestData = {
  labels: harvCodeData,
  datasets: [
    {
      label: 'Total Grams Harvested',
      data: harvGramsData,
      backgroundColor: [
        'rgba(255, 134,159,0.4)',
        'rgba(98,  182, 239,0.4)',
        'rgba(255, 218, 128,0.4)',
        'rgba(113, 205, 205,0.4)',
        'rgba(170, 128, 252,0.4)',
        'rgba(255, 177, 101,0.4)',
      ],
      borderWidth: 2,
      borderColor: [
        'rgba(255, 134, 159, 1)',
        'rgba(98,  182, 239, 1)',
        'rgba(255, 218, 128, 1)',
        'rgba(113, 205, 205, 1)',
        'rgba(170, 128, 252, 1)',
        'rgba(255, 177, 101, 1)',
      ],
    },
  ],

}

let dayDate;
let dayTemp;
let dayHumd;
const dayTempHumd: any = await getTempHumidAve();
console.log(dayTempHumd)
const dayDateData = dayTempHumd.map((entry: any) => entry.date);
const dayTempData = dayTempHumd.map((entry: any) => entry['ave temp']);
const dayHumdData = dayTempHumd.map((entry: any) => entry['ave humidity']);

$: dayDate = dayDateData
$: dayTemp = dayTempData
$: dayHumd = dayHumdData

export const everyTempHumid = {
  labels: dayDate,
  datasets: [
    {
      label: 'Temperature',
      fill: true,
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
      data: dayTemp,
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
      data: dayHumd,
    },
  ],
}