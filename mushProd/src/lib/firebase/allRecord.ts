import { getDocs, collection, doc, query, Timestamp, orderBy, limit, DocumentSnapshot, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import { format, toDate } from 'date-fns';

export async function allPlantedBags(): Promise<number> {
    const userDocRef = doc(db, 'user', '123456');
    const batchCollectionRef = collection(userDocRef, 'batch');
    const q = query(batchCollectionRef);
    const querySnapshot = await getDocs(q);

    let totalBags = 0;

    querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.batch_total_bags) {
            totalBags += data.batch_total_bags;
        }
    });

    return totalBags;
}
export async function allRemovedBags(): Promise<number> {
    const userDocRef = doc(db, 'user', '123456');
    const batchCollectionRef = collection(userDocRef, 'batch');
    const q = query(batchCollectionRef);
    const querySnapshot = await getDocs(q);

    let totalRemoved = 0;

    querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.batch_total_removed) {
            totalRemoved += data.batch_total_removed;
        }
    });

    return totalRemoved;
}
export async function allHarvestedGrams(): Promise<number> {
    const userDocRef = doc(db, 'user', '123456');
    const batchCollectionRef = collection(userDocRef, 'batch');
    const q = query(batchCollectionRef);
    const querySnapshot = await getDocs(q);

    let totalGrams = 0;
    const promises: Promise<void>[] = [];
    querySnapshot.forEach(async (batchDoc) => {
        const batchHarvestCollectionRef = collection(batchDoc.ref, 'batch_harvest');
        const harvestDocsSnapshotPromise = getDocs(batchHarvestCollectionRef);

        promises.push(
            harvestDocsSnapshotPromise.then((harvestDocsSnapshot) => {
                harvestDocsSnapshot.forEach((harvestDoc) => {
                    const harvestData = harvestDoc.data();
                    if (harvestData && harvestData.grams) {
                        totalGrams += harvestData.grams;
                    }
                });
            })
        );
    });

    // Wait for all promises to resolve before returning the totalGrams
    await Promise.all(promises);

    return totalGrams;
}

export async function LastDateInBagsRecord(): Promise<string | null> {
    const bagsRecordCollectionRef = collection(db, 'user', '123456', 'batch');
    const q = query(bagsRecordCollectionRef, orderBy('batch_planted', 'desc'), limit(1));

    try {
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return null; // No documents found
        }

        const latestDocument = querySnapshot.docs[0];
        const data = latestDocument.data();

        // Ensure the batch_planted field exists in the document
        if (data.batch_planted) {
            const batchPlantedTimestamp = data.batch_planted;

            // Assuming batch_planted is a Firestore Timestamp
            if (batchPlantedTimestamp instanceof Timestamp) {
                // Convert Firestore Timestamp to JavaScript Date
                const jsDate = batchPlantedTimestamp.toDate();

                // Format the JavaScript Date as needed
                const formattedDate = format(jsDate, 'MMMM dd, yyyy');
                return formattedDate;
            } else {
                console.log('Invalid timestamp format for batch_planted field');
                return null;
            }
        } else {
            console.log('Missing batch_planted field');
            return null;
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}
export async function LastDateInHarvest(): Promise<string | null> {
    const bagsRecordCollectionRef = collection(db, 'user', '123456', 'harvest record');
    const q = query(bagsRecordCollectionRef, orderBy('date_harvested', 'desc'), limit(1));

    try {
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return null; // No documents found
        }

        const latestDocument = querySnapshot.docs[0];
        const data = latestDocument.data();

        if (data.date_harvested && data.date_harvested instanceof Timestamp) {
            // Convert Firestore Timestamp to JavaScript Date
            const jsDate = data.date_harvested.toDate();

            // Format the JavaScript Date as needed
            const formattedDate = format(jsDate, 'MMMM dd, yyyy');
            return formattedDate;
        } else {
            console.log('Invalid date format or missing date field');
            return null;
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

export async function getYield(bags: number, temp: number, hum: number) {

    const url = 'https://yield-prediction-for-mushroom-086f7f174ff4.herokuapp.com/predict';

    const input_data = {
        bags: bags,
        temp: temp,
        hum: hum
    };

    return new Promise(async (resolve, reject) => {
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(input_data)
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('HTTP error! Status:' + response.status);
                }
                return response.json();
            })
            .then((data) => {
                // console.log('Predicted Weight: ', data.predicted_weight, data.unit);
                resolve(data.predicted_weight);
            })
            .catch((error) => console.log('Error in fetching data:', error));
    });
}

export async function getAllAveTempHumd() {
    return new Promise((resolve, reject) => {
        const userDocRef = doc(db, 'user', '123456');
        const bagsRecordCollectionRef = collection(userDocRef, 'temp and humid');
        const q = query(bagsRecordCollectionRef, orderBy('date', 'desc'));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            let totalTemp = 0;
            let totalHumidity = 0;
            let totalDocuments = 0;
            let date;
            querySnapshot.forEach((doc) => {
                const data = doc.data();

                // Ensure that the `date` field is a valid Firestore Timestamp
                if (data.date && data.date.toDate) {
                    // Convert Firestore Timestamp to JavaScript Date
                    data.date = format(data.date.toDate(), 'MMMM dd, yyyy');
                }

                // Add the ID to the data object
                data.id = doc.id;
                date = data.date
                // Sum up temperature and humidity
                totalTemp += data[`ave temp`] || 0;
                totalHumidity += data[`ave humidity`] || 0;

                // Increment the total number of documents
                totalDocuments++;
            });

            // Calculate average temperature and average humidity
            const aveTemp = totalTemp / totalDocuments;
            const aveHumidity = totalHumidity / totalDocuments;

            // Resolve the promise with the averages
            resolve({
                date,
                aveTemp,
                aveHumidity,
            });

        }, (error) => {
            // Reject the promise with the error
            reject(error);
        });
    });

}

