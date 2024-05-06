import { collection, getDocs, query, doc, onSnapshot, orderBy, where, limit } from 'firebase/firestore';
import { db } from '$lib/firebase/firebase';
import { format } from 'date-fns';
import { onDestroy, onMount } from 'svelte';

const userDocRef = doc(db, 'user', '123456');

let aveTempHumd: any = [];
export async function getTempHumidAve() {
    return new Promise((resolve, reject) => {
        const bagsRecordCollectionRef = collection(userDocRef, 'temp and humid');
        const q = query(bagsRecordCollectionRef, orderBy('date', 'desc'), limit(10));

        aveTempHumd = [];

        const unsubscribe = onSnapshot(q, (querySnapshot) => {


            querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (data.date && data.date.toDate) {
                    data.date = format(data.date.toDate(), 'MMMM dd, yyyy');
                }

                data.id = doc.id;
                aveTempHumd.push(data);
            });
            resolve(aveTempHumd);
        });
    });
}
export async function getTempHumidAve2() {
    return new Promise((resolve, reject) => {
        const bagsRecordCollectionRef = collection(userDocRef, 'temp and humid');
        const q = query(bagsRecordCollectionRef, orderBy('date', 'desc'));

        aveTempHumd = [];

        const unsubscribe = onSnapshot(q, (querySnapshot) => {


            querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (data.date && data.date.toDate) {
                    data.date = format(data.date.toDate(), 'MMMM dd, yyyy');
                }

                data.id = doc.id;
                aveTempHumd.push(data);
            });
            resolve(aveTempHumd);
        });
    });
}
let harvestData: any = [];
export async function getHarvestData() {
    return new Promise(async (resolve, reject) => {

        const batchCollectionRef = collection(userDocRef, 'batch');
        const batchQuery = query(batchCollectionRef, orderBy('batch_planted', 'asc'));

        const batchDocsSnapshot = await getDocs(batchQuery);

        harvestData = [];

        for (const batchDoc of batchDocsSnapshot.docs) {
            const batchCode = batchDoc.data().batch_code;

            // Get the batch_harvest collection for the current batch
            const batchHarvestCollectionRef = collection(batchDoc.ref, 'batch_harvest');
            const batchHarvestQuery = query(batchHarvestCollectionRef);

            const batchHarvestDocsSnapshot = await getDocs(batchHarvestQuery);

            // Calculate the total number of harvests and total grams for the current batch
            const totalHarvests = batchHarvestDocsSnapshot.size;
            const totalGrams = batchHarvestDocsSnapshot.docs.reduce((acc, harvestDoc) => {
                const grams = harvestDoc.data().grams || 0;
                return acc + grams;
            }, 0);

            // Add the batch data to the result array
            harvestData.push({
                batchCode,
                totalHarvests,
                totalGrams,
            });
        }

        resolve(harvestData);
    });
}
export async function getMushroomData() {
    return new Promise(async (resolve, reject) => {


    });
}
let batchData: any = [];
export async function writeAnalysis(batchCode: string,
    growthDurationDays: number,
    totalBags: number,
    totalGrams: number,
    averageTemp: number,
    averageHumid: number) {
    // Assuming an average of 300 grams per bag
    const averageGramsPerBag = 300;
    const averageLifeSpan = 120


    const estimatedTotalProduction = averageGramsPerBag * totalBags
    const estimatedTotalProdThatDay = (estimatedTotalProduction / averageLifeSpan) * growthDurationDays;

    // Determine if the batch is gaining or losing
    const isGaining = totalGrams >= estimatedTotalProdThatDay;

    // Calculate the percentage of produced grams compared to expected overall grams
    const percentageProduced = (totalGrams / estimatedTotalProduction) * 100;
    const percentageGrams = (totalGrams / estimatedTotalProdThatDay) * 100

    // Get suggestions for temperature and humidity adjustments
    const temperatureSuggestion = suggestTemperatureAdjustment(averageTemp);
    const humiditySuggestion = suggestHumidityAdjustment(averageHumid);

    // Generate a message based on the analysis result
    let message = `The ${batchCode} batch has ${isGaining ? "demonstrated favorable performance" : "exhibited suboptimal performance"
        }\n`;

    let stat: string = '';
    if (isGaining) {
        stat = 'Gaining'
    } else {
        stat = 'Losing'
    }

    message += `, yields ${totalGrams} grams of mushrooms, which accounts for ${percentageGrams.toFixed(2)}% of the projected yield over a ${growthDurationDays}-day period, amounting to ${estimatedTotalProdThatDay.toFixed(2)} grams. This constitutes  ${percentageProduced.toFixed(2)}% of the expected total production of ${estimatedTotalProduction.toFixed(2)} grams. `

    return {
        batchCode,
        isGaining,
        stat,
        estimatedTotalProduction,
        percentageProduced,
        estimatedTotalProdThatDay,
        temperatureSuggestion,
        humiditySuggestion,
        message,
    };

}
export async function getAnalysis() {
    const userDocRef = doc(db, 'user', '123456');
    const batchCollectionRef = collection(userDocRef, 'batch');
    const q = query(batchCollectionRef);
    const batchDocsSnapshot = await getDocs(q);
    batchData = [];
    for (const batchDoc of batchDocsSnapshot.docs) {
        const userDocRef = doc(db, 'user', '123456');
        const batchCollectionRef = collection(userDocRef, 'batch');
        const q = query(batchCollectionRef, orderBy('batch_planted', 'asc'));

        const batchDocsSnapshot = await getDocs(q);

        const allBatchData = [];

        for (const batchDoc of batchDocsSnapshot.docs) {
            const batchData = batchDoc.data();
            const batchCode = batchData.batch_code;

            // Calculate growth duration
            const today = new Date();
            const batchPlanted = batchData.batch_planted.toDate();
            const growthDuration = Math.floor((today.getTime() - batchPlanted.getTime()) / (1000 * 60 * 60 * 24));

            // Fetch batch_harvest documents
            const batchHarvestCollectionRef = collection(batchDoc.ref, 'batch_harvest');
            const batchHarvestQuery = query(batchHarvestCollectionRef);
            const batchHarvestDocsSnapshot = await getDocs(batchHarvestQuery);

            // Calculate total grams
            const totalGrams = batchHarvestDocsSnapshot.docs.reduce((acc, harvestDoc) => {
                return acc + (harvestDoc.data().grams || 0);
            }, 0);

            // Fetch 'temp and humid' documents for the batch from planting date to current date

            const tempHumid = await getTempHumidAve()
            const tempAndHumidCollectionRef = collection(doc(db, 'user', '123456'), 'temp and humid');
            const tempAndHumidQuery = query(tempAndHumidCollectionRef,
                where('date', '>=', batchPlanted),
                where('date', '<=', today),
                orderBy('date', 'asc')
            );

            const tempAndHumidDocsSnapshot = await getDocs(tempAndHumidQuery);

            // Calculate average temperature and average humidity
            let temperatureSum = 0;
            let humiditySum = 0;
            let numReadings = 0;

            tempAndHumidDocsSnapshot.forEach((tempAndHumidDoc) => {
                const tempAndHumidData = tempAndHumidDoc.data();
                temperatureSum += tempAndHumidData['ave temp'] || 0;
                humiditySum += tempAndHumidData['ave humidity'] || 0;
                numReadings++;
            });

            const averageTemperature = numReadings > 0 ? temperatureSum / numReadings : 0;
            const averageHumidity = numReadings > 0 ? humiditySum / numReadings : 0;
            // console.log(averageTemperature)

            const analysis = await writeAnalysis(batchCode, growthDuration, batchData.batch_total_bags, totalGrams, averageTemperature, averageHumidity)
            // console.log(analysis)
            allBatchData.push({
                batchCode,
                growthDuration,
                totalBags: batchData.batch_total_bags,
                averageTemperature,
                averageHumidity,
                totalGrams,
                analysis,
            });
        }
        // console.log(allBatchData)

        return allBatchData;
    }
}

export async function getAveEachBatch() {
    const userDocRef = doc(db, 'user', '123456');
    const batchCollectionRef = collection(userDocRef, 'batch');
    const batchSnapshot = await getDocs(batchCollectionRef);

    const allBatchData = [];

    for (const batchDoc of batchSnapshot.docs) {
        const plantedDate = batchDoc.data().batch_planted;

        const tempAndHumidCollectionRef = collection(userDocRef, 'temp and humid');
        const tempAndHumidQuery = query(
            tempAndHumidCollectionRef,
            where('date', '>=', plantedDate),
            where('date', '<=', new Date()),
            orderBy('date', 'asc')
        );

        const tempHumidSnapshot = await getDocs(tempAndHumidQuery);

        let totalTemp = 0;
        let totalHumid = 0;
        let count = 0;

        tempHumidSnapshot.forEach((tempHumidDoc) => {
            const currentDate = tempHumidDoc.data().date;

            if (currentDate >= plantedDate && currentDate <= new Date()) {
                totalTemp += tempHumidDoc.data()['ave temp'] || 0;
                totalHumid += tempHumidDoc.data()['ave humidity'] || 0;
                count++;
            }
        });

        const averageTemp = count > 0 ? totalTemp / count : 0;
        const averageHumid = count > 0 ? totalHumid / count : 0;

        // console.log(`Batch Code: ${batchDoc.data().batch_code}`);
        // console.log(`Average Temperature: ${averageTemp}`);
        // console.log(`Average Humidity: ${averageHumid}`);

        allBatchData.push({
            batchCode: batchDoc.data().batch_code,
            averageTemperature: averageTemp,
            averageHumidity: averageHumid,
        });
        // console.log(allBatchData)
    }

    return allBatchData;
}
function suggestTemperatureAdjustment(averageTemp: number) {


    if (averageTemp >= 24 && averageTemp <= 29) {
        return " maintaining the temperature ";
    }

    if (averageTemp < 24) {
        return " increasing the temperature ";
    }

    if (averageTemp > 29) {
        return " decreasing the temperature ";
    }
}
function suggestHumidityAdjustment(averageHumid: number) {


    if (averageHumid >= 80 && averageHumid <= 90) {
        return " maintaining the humidity ";
    }

    if (averageHumid < 80) {
        return " increasing humidity ";
    }

    if (averageHumid > 90) {
        return " decreasing humidity ";
    }
}