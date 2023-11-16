import * as admin from 'firebase-admin';
import { sendNotification } from 'd:/Documents/Files/SveltKit/Project 0/mushProd/src/lib/components/Data/addNotification';
// import express from 'express';
import type { ServiceAccount } from 'firebase-admin';
import { getDatabase, limitToLast, onValue, query, ref } from 'firebase/database';
import { setLoading } from 'd:/Documents/Files/SveltKit/Project 0/mushProd/src/lib/stores/stores';


import serviceAccountJson from './betapeak-1b551-firebase-adminsdk-ns0d3-3f611f58e0.json';
const serviceAccount = serviceAccountJson as admin.ServiceAccount;
if (admin.apps.length === 0) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: 'https://betapeak-1b551-default-rtdb.asia-southeast1.firebasedatabase.app'
    });
}


// Create an Express app
// const app = express();
// const port = process.env.PORT || 3000;

const rdb = getDatabase();
const dateRef = ref(rdb, `/BETAPEAK/2023-11-11`);
// const dateRef = ref(rdb, `BETAPEAK/${formattedDate}`);

const queryRef = query(dateRef, limitToLast(1));
const unsubscribe = onValue(queryRef, (snapshot) => {
    try {
        if (snapshot.exists()) {
            const data = snapshot.val();

            let alertTitleTemp;
            let alertTitleHumd;
            let alertTitle;
            let alertMessagetemp;
            let alertMessagehumid;
            let alertMessage = '';
            const lastEntryKey = Object.keys(data)[0];
            const lastEntry = data[lastEntryKey];
            const humd = lastEntry.Humd;
            const temp = lastEntry.Temp;
            const time = lastEntry.Time;
            sendNotification(100, 100);

            if (24 >= temp) {
                alertTitleTemp = 'Low Temperature'
                alertMessagetemp = 'Low temperature alert: The temperature has dropped to ' + temp + '°C, which is below the recommended threshold.'
            } else if (29 <= temp) {
                alertTitleTemp = 'High Temperature'
                alertMessagetemp = 'High temperature alert: The temperature has reached ' + temp + '°C, which is above the recommended threshold.'
            }
            if (85 >= temp) {
                alertTitleHumd = 'Low Humidity'
                alertMessagehumid = 'Low humidity alert: The humidity level has dropped to ' + humd + '%, which is below the recommended threshold.'
            } else if (95 <= temp) {
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
                alertTitle = `${alertTitleTemp}\n${alertTitleHumd}`;

            } else if (alertTitleTemp) {
                alertTitle = alertTitleTemp;
            } else if (alertTitleHumd) {
                alertTitle = alertTitleHumd;
            }
            // if (24 >= temp && 85 >= humd && 29 <= temp && 95 <= humd) {
            if (true) {
                sendNotification(temp, humd);
                sendFCMAlert(alertTitle, alertMessage);

            }
            setLoading(false);
        } else {
            console.log('it does not exist');
        }
    } catch (error) {
        console.log('Error fetching data: ', error);
    }
});

// Start the Express server
// app.listen(port, () => {
//     console.log(`Server is running on http://localhost:${port}`);
// });
async function sendFCMAlert(title: any, body: any) {
    const registrationToken = 'fSJ_Sb21DpwDhvRtM89__C:APA91bFZiXN8gIciNKaxEOjt5uftrR0eWIHAPVXYEARMwSKQWzrTRkZsmuZ6XZWEJIqGmpeApDn4y6awJ6l9D9SzTo-Q79AL2boVaXXUc1ZvODLMVEg2acziXvDOIeuDROHkZD_dhA66';
    const message = {
        notification: {
            title: title,
            body: body,
        },
        token: registrationToken
    };


    const response = await admin.messaging().send(message);
    console.log('Successfully sent message:', response);

}
async function checkAndTriggerAlert(temperature: number, humidity: number) {
    let alertTitle, alertMessage;

    if (temperature > 29) {
        alertTitle = 'High Temperature';
        alertMessage = `High temperature alert: ${temperature}°C`;
    } else if (temperature < 24) {
        alertTitle = 'Low Temperature';
        alertMessage = `Low temperature alert: ${temperature}°C`;
    }

    if (humidity > 95) {
        alertTitle = (alertTitle ? alertTitle + ' & ' : '') + 'High Humidity';
        alertMessage = (alertMessage ? alertMessage + '. ' : '') + `High humidity alert: ${humidity}%`;
    } else if (humidity < 85) {
        alertTitle = (alertTitle ? alertTitle + ' & ' : '') + 'Low Humidity';
        alertMessage = (alertMessage ? alertMessage + '. ' : '') + `Low humidity alert: ${humidity}%`;
    }

    if (alertTitle && alertMessage) {
        await sendFCMAlert(alertTitle, alertMessage);
    }
}
export const __methods = {
    POST: async (request: Request): Promise<{ status: number; body: { success: boolean } }> => {
        const { temperature, humidity } = await request.json();

        // Call the function to check and trigger alerts
        await checkAndTriggerAlert(temperature, humidity);

        // Send notification to Firestore
        await sendNotification(temperature, humidity);

        return {
            status: 200,
            body: { success: true },
        };
    },
};
