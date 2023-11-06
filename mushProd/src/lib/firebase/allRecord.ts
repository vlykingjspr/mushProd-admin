import { getDocs, collection, doc, query, Timestamp } from 'firebase/firestore';
import { db } from './firebase';
import { format } from 'date-fns';

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
let lastDate: any;
let lastDateFormatted: any;
export async function LastDateInBagsRecord(): Promise<Timestamp> {
    const userDocRef = doc(db, 'user', '123456');
    const bagsRecordCollectionRef = collection(userDocRef, 'bags record');
    const q = query(bagsRecordCollectionRef);
    const querySnapshot = await getDocs(q);



    querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.date && typeof data.date.toDate === 'function') {
            const documentDate = data.date.toDate();
            if (!lastDate || documentDate > lastDate) {
                lastDate = documentDate;
            }
        }
    });

    if (lastDate) {
        lastDateFormatted = format(lastDate, 'MMMM dd yyyy');

    }
    return lastDateFormatted;
}