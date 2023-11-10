import { getDocs, collection, doc, query, Timestamp, orderBy, limit } from 'firebase/firestore';
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


export async function LastDateInBagsRecord(): Promise<string | null> {
    const bagsRecordCollectionRef = collection(db, 'user', '123456', 'bags record');
    const q = query(bagsRecordCollectionRef, orderBy('date', 'desc'), limit(1));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        return null; // No documents found
    }

    const latestDocument = querySnapshot.docs[0];
    const data = latestDocument.data();

    // if (data.date && typeof data.date.toDate === 'function') {
    //     const lastDate = format(data.date.toDate(), 'MMMM dd yyyy');

    //     console.log(lastDate)
    //     return lastDate;

    // }

    return data.date; // No valid date found
}