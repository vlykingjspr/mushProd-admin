import { db } from '$lib/firebase/firebase';
import { loading } from '$lib/stores/stores';
import { format } from 'date-fns';

import { getDatabase, limitToLast, onValue, query, ref } from 'firebase/database';
import { Timestamp, addDoc, collection } from 'firebase/firestore';

const currentDate = new Date();
const formattedDate = format(currentDate, 'yyyy-MM-dd');
// Define the structure of your data
interface DataItem {
    Humd: number;
    Temp: number;
    Time: string;
}
const calculateAverage = (arr: number[]): number => {
    const sum = arr.reduce((acc, val) => acc + val, 0);
    return sum / arr.length;
};


export function getHourlyAverages(): Promise<{ Hour: string, AverageHumidity: number, AverageTemperature: number }[]> {
    return new Promise((resolve, reject) => {
        const rdb = getDatabase();
        // const dateRef = ref(rdb, `/BETAPEAK/${formattedDate}`);
        const dateRef = ref(rdb, `/BETAPEAK/2023-11-15`);
        const queryRef = query(dateRef);

        const hourlyAverages: Record<string, { Humd: number; Temp: number }[]> = {};
        onValue(queryRef, (snapshot) => {
            if (snapshot.exists()) {
                const rawData = Object.values(snapshot.val() || []) as DataItem[];

                rawData.forEach((item) => {
                    const hour = item.Time.split(':')[0];
                    if (!hourlyAverages[hour]) {
                        hourlyAverages[hour] = [];
                    }
                    hourlyAverages[hour].push({ Humd: item.Humd, Temp: item.Temp });
                });

                const averagesArray = Object.keys(hourlyAverages).map((hour) => {
                    const humidities = hourlyAverages[hour].map((item) => item.Humd);
                    const temperatures = hourlyAverages[hour].map((item) => item.Temp);

                    return {
                        Hour: hour,
                        AverageHumidity: calculateAverage(humidities),
                        AverageTemperature: calculateAverage(temperatures),
                    };
                });

                resolve(averagesArray);
            } else {
                reject(new Error('Data does not exist'));
            }
        });
    });
}

export async function getDailyAverage(): Promise<{ AverageHumidity: number; AverageTemperature: number; Date: Timestamp }> {
    try {
        const hourlyAverages = await getHourlyAverages();

        // Extract hourly averages to calculate daily averages
        const humidities = hourlyAverages.map((hourly) => hourly.AverageHumidity);
        const temperatures = hourlyAverages.map((hourly) => hourly.AverageTemperature);

        const dailyAverageHumidity = calculateAverage(humidities);
        const dailyAverageTemperature = calculateAverage(temperatures);

        const formattedDailyAverageHumidity = parseFloat(dailyAverageHumidity.toFixed(2));
        const formattedDailyAverageTemperature = parseFloat(dailyAverageTemperature.toFixed(2));

        const timestamp = new Timestamp(currentDate.getTime() / 1000, 0);

        // Store data in Firestore

        const userDocRef = collection(db, 'user', '123456', 'temp and humid');

        await addDoc(userDocRef, {
            'ave temp': formattedDailyAverageTemperature,
            'ave humidity': formattedDailyAverageHumidity,
            'date': timestamp,
        });

        return {
            AverageHumidity: formattedDailyAverageHumidity,
            AverageTemperature: formattedDailyAverageTemperature,
            Date: timestamp,
        };
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }



    return new Promise((resolve, reject) => { })
}