import { loading } from '$lib/stores/stores';

import { getDatabase, limitToLast, onValue, query, ref } from 'firebase/database';


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
        const dateRef = ref(rdb, '/BETAPEAK/2023-11-11');
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