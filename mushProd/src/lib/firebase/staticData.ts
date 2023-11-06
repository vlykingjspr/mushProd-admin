import { getDocs, collection, type DocumentData } from 'firebase/firestore';
import { db } from './firebase';

interface FarmData {  
    device_code: string;
    farm_address: string;
    farm_name: string;
    farmer_name: string; 
}
export async function fetchFarmData(): Promise<FarmData[]> {
    const querySnapshot = await getDocs(collection(db, 'user'));
    const data: FarmData[] = [];
    querySnapshot.forEach((doc) => {
        const docData = doc.data() as FarmData;
        data.push(docData);
    });
    return data;
}

