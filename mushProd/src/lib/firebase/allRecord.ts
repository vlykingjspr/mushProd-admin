import { getDocs, collection, doc, query, Timestamp, orderBy, limit, DocumentSnapshot, getDoc } from 'firebase/firestore';
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
    const bagsRecordCollectionRef = collection(db, 'user', '123456', 'bags record');
    const q = query(bagsRecordCollectionRef, orderBy('date', 'desc'), limit(1));

    try {
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return null; // No documents found
        }

        const latestDocument = querySnapshot.docs[0];
        const data = latestDocument.data();


        if (data.date && data.date instanceof Timestamp) {
            // Convert Firestore Timestamp to JavaScript Date
            const jsDate = data.date.toDate();

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