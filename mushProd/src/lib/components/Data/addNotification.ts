
// Import the Firebase modules for Firestore
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { db } from '$lib/firebase/firebase';
import { getDatabase, ref, query, onValue, limitToLast, Database } from 'firebase/database';
import { format } from 'date-fns';
import firebase from 'firebase/compat/app';

// Defined function to send a notification to Firestore
export async function sendNotification(temperature: number, humidity: number) {
    let temp: number = temperature;
    let humd: number = humidity;
    let alertTitleTemp: string = '';
    let alertTitleHumd: string = '';
    let alertTitle: string = '';
    let alertMessagetemp: string = '';
    let alertMessagehumid: string = '';
    let alertMessage = '';
    if (24 >= temperature) {
        alertTitleTemp = 'Low Temperature'
        alertMessagetemp = 'Low temperature alert: The temperature has dropped to ' + temp + '°C, which is below the recommended threshold.'
    } else if (29 <= temperature) {
        alertTitleTemp = 'High Temperature'
        alertMessagetemp = 'High temperature alert: The temperature has reached ' + temp + '°C, which is above the recommended threshold.'
    }
    if (85 >= humidity) {
        alertTitleHumd = 'Low Humidity'
        alertMessagehumid = 'Low humidity alert: The humidity level has dropped to ' + humd + '%, which is below the recommended threshold.'
    } else if (95 <= humidity) {
        alertTitleHumd = 'High Humidity'
        alertMessagehumid = 'High humidity alert: The humidity level has reached ' + humd + '%, which is above the recommended threshold.'
    }

    if (alertMessagetemp && alertMessagehumid) {
        alertMessage = `${alertMessagetemp} & ${alertMessagehumid}`;

    } else if (alertMessagetemp) {
        alertMessage = alertMessagetemp;
    } else if (alertMessagehumid) {
        alertMessage = alertMessagehumid;
    }
    if (alertTitleTemp && alertTitleHumd) {
        alertTitle = `${alertTitleTemp} & ${alertTitleHumd}`;

    } else if (alertTitleTemp) {
        alertTitle = alertTitleTemp;
    } else if (alertTitleHumd) {
        alertTitle = alertTitleHumd;
    }

    try {
        // const message = db.
        const userCollection = collection(db, 'user', '123456', 'notifications');

        // Generate an auto ID for the document
        const docRef = await addDoc(userCollection, {
            alertTitle: alertTitle,
            alertMessage: alertMessage,
            date: new Date(),
            humidity: humidity,
            temperature: temperature,
        });

        // console.log('Notification sent to Firestore with ID: ', docRef.id);

        Notification.requestPermission().then((perm: NotificationPermission) => {
            if (perm === 'granted') {

                const notif = new Notification(alertTitle, {
                    body: alertMessage,
                });

                notif.addEventListener("error", (e: Event) => {
                    alert('error');
                });

            }
        });


        const payload = {
            notification: {
                title: alertTitle,
                body: alertMessage,
            },
        };


    } catch (error) {
        console.error('Error sending notification to Firestore: ', error);
    }

}

export async function sendNotification1(temperature: number, humidity: number, timeString:String, dateString: String) {
    let temp: number = temperature;
    let humd: number = humidity;
    let time: String = timeString;
    let date :String= dateString;
    let alertTitleTemp: string = '';
    let alertTitleHumd: string = '';
    let alertTitle: string = '';
    let alertMessagetemp: string = '';
    let alertMessagehumid: string = '';
    let alertMessage = '';
    

    if (24 >= temperature) {
        alertTitleTemp = 'Low Temperature'
        alertMessagetemp = 'Low temperature alert: The temperature has dropped to ' + temp + '°C, which is below the recommended threshold.'
    } else if (29 <= temperature) {
        alertTitleTemp = 'High Temperature'
        alertMessagetemp = 'High temperature alert: The temperature has reached ' + temp + '°C, which is above the recommended threshold.'
    }
    if (85 >= humidity) {
        alertTitleHumd = 'Low Humidity'
        alertMessagehumid = 'Low humidity alert: The humidity level has dropped to ' + humd + '%, which is below the recommended threshold.'
    } else if (95 <= humidity) {
        alertTitleHumd = 'High Humidity'
        alertMessagehumid = 'High humidity alert: The humidity level has reached ' + humd + '%, which is above the recommended threshold.'
    }

    if (alertMessagetemp && alertMessagehumid) {
        alertMessage = `${alertMessagetemp} & ${alertMessagehumid}`;

    } else if (alertMessagetemp) {
        alertMessage = alertMessagetemp;
    } else if (alertMessagehumid) {
        alertMessage = alertMessagehumid;
    }
    if (alertTitleTemp && alertTitleHumd) {
        alertTitle = `${alertTitleTemp} & ${alertTitleHumd}`;

    } else if (alertTitleTemp) {
        alertTitle = alertTitleTemp;
    } else if (alertTitleHumd) {
        alertTitle = alertTitleHumd;
    }

    try {
        // const message = db.
        const userCollection = collection(db, 'user', '123456', 'notifications');
        const timestamp = new Date(`${date}T${time}`);
        // console.log(timestamp);
        // Generate an auto ID for the document
        const docRef = await addDoc(userCollection, {
            date: timestamp,
            alertTitle: alertTitle,
            alertMessage: alertMessage,
            humidity: humidity,
            temperature: temperature,
        });

        // console.log('Notification sent to Firestore with ID: ', docRef.id);

        // Notification.requestPermission().then((perm: NotificationPermission) => {
        //     if (perm === 'granted') {

        //         const notif = new Notification(alertTitle, {
        //             body: alertMessage,
        //         });

        //         notif.addEventListener("error", (e: Event) => {
        //             alert('error');
        //         });

        //     }
        // });


        const payload = {
            notification: {
                title: alertTitle,
                body: alertMessage,
            },
        };


    } catch (error) {
        console.error('Error sending notification to Firestore: ', error);
    }

}
interface Entry {
    Humd: number;
    Temp: number;
    Time: string;
}

export async function createNotification(): Promise<void> {
    const rdb: Database = getDatabase();
    const betaPeakRef = ref(rdb, `BETAPEAK`);
    // Query all dates within the BETAPEAK directory
    const queryRef = query(betaPeakRef);

    const unsubscribe = onValue(queryRef, (snapshot) => {
        try {
            let totalNum = 0;
            if (snapshot.exists()) {
                const dates = snapshot.val();
let day = 0;
                // Iterate over each date
                for (const dateKey in dates) {
                    if (Object.prototype.hasOwnProperty.call(dates, dateKey)) {
                        const dateData = dates[dateKey];
                        let num = 0;
                        
                        // Iterate over each entry within the date
                        for (const entryKey in dateData) {
                            if (Object.prototype.hasOwnProperty.call(dateData, entryKey)) {
                                const entry: Entry = dateData[entryKey];
                                const humidity: number = entry.Humd;
                                const temperature: number = entry.Temp;
                                const time: String = entry.Time;
                                //console.log(dateKey);
                                num++;
                                totalNum++;
                                
                                // checkThresholds(temperature, humidity, time);
                                // console.log("ID" + entry);
                                // console.log( "temp:"+temperature);
                                // console.log( "humid:"+humidity,);
                                // console.log( "Time:"+time,);
                                //sendNotification1(temperature, humidity, time, dateKey);
                                // const thresholdStatus: string = checkThresholds(temperature, humidity,time);
                                // console.log("Threshold Status for", dateKey, ":", thresholdStatus);
                            }
                    
                        }day++
                      //  console.log(day,"Number of entries in", dateKey, ":", num);
                     
                    }
                }
                //console.log("Total number of entries:", totalNum); 
            } else {
                //console.log('No data available in BETAPEAK');
            }
        } catch (error) {
            console.error('Error fetching data: ', error);
        }
    });
}
export async function notifsend1(): Promise<void> {
    const currentDate = new Date();
    const formattedDate = format(currentDate, 'yyyy-MM-dd');
    const rdb: Database = getDatabase();
    const dateRef = ref(rdb, `BETAPEAK/2024-04-22`);

    const queryRef = query(dateRef, limitToLast(1));

    const unsubscribe = onValue(queryRef, async (snapshot) => {
        try {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const lastEntryKey = Object.keys(data)[0];
                const lastEntry: Entry = data[lastEntryKey];
                const humidity: number = lastEntry.Humd;
                const temperature: number = lastEntry.Temp;
                const time: string = lastEntry.Time;
               
                // console.log("Threshold Status:", thresholdStatus);
                // setLoading(false); // Assuming setLoading function exists
                sendNotification1(temperature, humidity, time,'2024-04-21');

                

            } else {
                console.log('No data available for today');
            }
        } catch (error) {
            console.error('Error fetching data: ', error);
        }
    });
}

//getting all data in a date
// export async function fetchDataFromFirebase(): Promise<void> {
//     const currentDate = new Date();
//     const formattedDate = format(currentDate, 'yyyy-MM-dd');
//     const rdb: Database = getDatabase();
//     // const dateRef = ref(rdb, `BETAPEAK/${formattedDate}`);
//     const dateRef = ref(rdb, `BETAPEAK/2024-04-25`);

//     const queryRef = query(dateRef);
//     const unsubscribe = onValue(queryRef, (snapshot) => {
//         try {
//             if (snapshot.exists()) {
//                 const data = snapshot.val();
// let num = 0;
//                 // Iterate over each entry in the date
//                 for (const entryKey in data) {
//                     if (Object.prototype.hasOwnProperty.call(data, entryKey)) {
//                         const entry: Entry = data[entryKey];
//                         const humidity: number = entry.Humd;
//                         const temperature: number = entry.Temp;
//                         const time: string = entry.Time;
//                         console.log(num);
//                         num++;
//                         sendNotification1(temperature, humidity, time);
//                         checkThresholds(temperature, humidity, time);
//                     }
//                 }
//             } else {
//                 console.log('No data available for today');
//             }
//         } catch (error) {
//             console.error('Error fetching data: ', error);
//         }
//     });
// }

// function checkThresholds(temperature: number, humidity: number, time: String): string {
//     if (temperature >= 24 && humidity >= 85) {
//         console.log("temp:" + temperature);
//         console.log("humid:" + humidity,);
//         console.log("Time:" + time,);
//         return "High temperature and high humidity";
//     } else if (temperature >= 24) {
//         console.log("temp:" + temperature);
//         console.log("humid:" + humidity,);
//         console.log("Time:" + time,);
//         return "High temperature";
//     } else if (temperature <= 29 && humidity >= 85) {
//         console.log("temp:" + temperature);
//         console.log("humid:" + humidity,);
//         console.log("Time:" + time,);
//         return "High humidity";
//     } else {
//         console.log("temp:" + temperature);
//         console.log("humid:" + humidity,);
//         console.log("Time:" + time,);
//         return "Normal";
//     }
// }

