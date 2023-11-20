import { collection, getDocs, query, doc, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '$lib/firebase/firebase';
import { format } from 'date-fns';
import { onDestroy, onMount } from 'svelte';

const userDocRef = doc(db, 'user', '123456');

let aveTempHumd: any = [];
export async function getTempHumidAve() {
    return new Promise((resolve, reject) => {
        const bagsRecordCollectionRef = collection(userDocRef, 'temp and humid');
        const q = query(bagsRecordCollectionRef, orderBy('date', 'asc'));

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

            // Calculate average temperature and average humidity
            let temperatureSum = batchData.temperature || 0; // Assuming temperature is stored in the batch document
            let humiditySum = batchData.humidity || 0; // Assuming humidity is stored in the batch document
            let numTemperatureReadings = 1;
            let numHumidityReadings = 1;

            batchHarvestDocsSnapshot.forEach((harvestDoc) => {
                const harvestData = harvestDoc.data();
                temperatureSum += harvestData.temperature || 0;
                humiditySum += harvestData.humidity || 0;
                numTemperatureReadings++;
                numHumidityReadings++;
            });

            const averageTemperature = temperatureSum / numTemperatureReadings;
            const averageHumidity = humiditySum / numHumidityReadings;

            allBatchData.push({
                batchCode,
                growthDuration,
                totalBags: batchData.batch_total_bags,
                averageTemperature,
                averageHumidity,
                totalGrams,
            });
        }

        return allBatchData;
    }
}