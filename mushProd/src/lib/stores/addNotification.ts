
// Import the Firebase modules for Firestore
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { db } from '$lib/firebase/firebase';

// Define a function to send a notification to Firestore
export async function sendNotification(temperature: number, humidity: number) {

    let temp: number = temperature;
    let humd: number = humidity;
    let alertMessagetemp;
    let alertMessagehumid;
    let alertMessage = '';
    if (24 >= temperature) {
        alertMessagetemp = 'Low temperature alert: The temperature has dropped to ' + temp + '°C, which is below the recommended threshold.'
    } else if (29 <= temperature) {
        alertMessagetemp = 'High temperature alert: The temperature has reached ' + temp + '°C, which is above the recommended threshold.'
    }
    if (85 >= humidity) {
        alertMessagehumid = 'Low humidity alert: The humidity level has dropped to ' + humd + '%, which is below the recommended threshold.'
    } else if (95 <= humidity) {
        alertMessagehumid = 'High humidity alert: The humidity level has reached ' + humd + '%, which is above the recommended threshold.'
    }

    if (alertMessagetemp && alertMessagehumid) {
        alertMessage = `${alertMessagetemp}\n${alertMessagehumid}`;
    } else if (alertMessagetemp) {
        alertMessage = alertMessagetemp;
    } else if (alertMessagehumid) {
        alertMessage = alertMessagehumid;
    }

    try {
        // Create a reference to the user's collection
        const userCollection = collection(db, 'user', '123456', 'notifications');

        // Generate an auto ID for the document
        const docRef = await addDoc(userCollection, {
            alertMessage: alertMessage,
            date: new Date(),
            humidity: humidity,
            temperature: temperature,
        });

        console.log('Notification sent to Firestore with ID: ', docRef.id);
    } catch (error) {
        console.error('Error sending notification to Firestore: ', error);
    }

}
