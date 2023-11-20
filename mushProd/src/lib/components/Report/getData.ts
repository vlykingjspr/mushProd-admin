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
