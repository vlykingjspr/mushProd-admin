import { getDocs, collection, doc, query, Timestamp, orderBy, limit } from 'firebase/firestore';
import { db } from './firebase';
import { format, toDate } from 'date-fns';

export async function allPlantedBags(): Promise<number> {
    const userDocRef = doc(db, 'user', '123456');
    const bagsRecordCollectionRef = collection(userDocRef, 'bags record');
    const q = query(bagsRecordCollectionRef);
    const querySnapshot = await getDocs(q);

    let totalQuantity = 0;

    querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.quantity) {
            totalQuantity += data.quantity;
        }
    });

    return totalQuantity;
}
export async function allHarvestedGrams(): Promise<number> {
    const userDocRef = doc(db, 'user', '123456');
    const bagsRecordCollectionRef = collection(userDocRef, 'harvest record');
    const q = query(bagsRecordCollectionRef);
    const querySnapshot = await getDocs(q);

    let totalGrams = 0;

    querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.grams) {
            totalGrams += data.grams;
        }
    });

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