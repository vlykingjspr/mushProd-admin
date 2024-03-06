
// Import the Firebase modules for Firestore
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { db } from '$lib/firebase/firebase';

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
