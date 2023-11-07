import type { PageServerLoad } from './$types';
import { collection, getDocs, query, doc, onSnapshot, type DocumentData } from 'firebase/firestore';
import { db } from '$lib/firebase/firebase';
import { format } from 'date-fns';

const userDocRef = doc(db, 'user', '123456');
const bagsRecordCollectionRef = collection(userDocRef, 'notifications');
const q = query(bagsRecordCollectionRef);

export const load = (async () => {
    const source: DocumentData[] = [];
    let isLoading = true;

    const fetchData = async () => {
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            // Clear the existing data before adding new data
            source.length = 0;

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                // Convert Firestore Timestamp to JavaScript Date
                if (data.date && typeof data.date.toDate === 'function') {
                    data.date = format(data.date.toDate(), 'MMMM dd, yyyy');
                }
                // Add the ID to the data object
                data.id = doc.id;
                source.push(data);
                isLoading = false;
            });
        });

        // Return the data from this function
        return source;
    }

    // Call fetchData to load the data
    const notifData = await fetchData();

    return {
        notifData,
    };
}) satisfies PageServerLoad;
