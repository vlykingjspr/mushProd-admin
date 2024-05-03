
// import * as admin from "firebase-admin";
// import { initializeApp } from "../../node_modules/firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import * as functions from 'firebase-functions';
//import { https } from "firebase-functions";
// import { format } from "date-fns";
// import { onDestroy } from "svelte";
// const firebaseConfig ={
//   apiKey: "AIzaSyB6oe9cID6r5VG6dPcYGylqD0eTFXwULNQ",
//   authDomain: "betapeak-1b551.firebaseapp.com",
//   databaseURL: "https://betapeak-1b551-default-rtdb.asia-southeast1.firebasedatabase.app",
//   projectId: "betapeak-1b551",
//   storageBucket: "betapeak-1b551.appspot.com",
//   messagingSenderId: "442665321534",
//   appId: "1:442665321534:web:10bc3c8a7112a8c4fc7d6f",
//   measurementId: "G-X9CJXFEGY5"
// };


// firebaseApp = initializeApp(firebaseConfig);

// const db = getFirestore(firebaseApp);

// Ensure these are the same as the one in ../firebase/messaging
export const FCM_TOKEN_COLLECTION = "fcmTokens";
export const FCM_TOKEN_KEY = "fcmToken"; 
const admin = require('firebase-admin');
admin.initializeApp();
const db = getFirestore(admin);

    // const currentDate = new Date();
	// const formattedDate = format(currentDate, 'yyyy-MM-dd');
	// getting data from firebase
	// const rdb = getDatabase();
	// const dateRef = ref(rdb, `/BETAPEAK/2024-04-23`);
	// // const dateRef = ref(rdb, `BETAPEAK/${formattedDate}`);

    // const queryRef = query(dateRef, limitToLast(1));
	// const unsubscribe = onValue(queryRef, (snapshot) => {
    //     let humd: number;
	// let temp: number;
	// let time: any;
	// 	try {
	// 		if (snapshot.exists()) {
	// 			const data = snapshot.val();

	// 			const lastEntryKey = Object.keys(data)[0];
	// 			const lastEntry = data[lastEntryKey];
	// 			humd = lastEntry.Humd;
	// 			temp = lastEntry.Temp;
	// 			time = lastEntry.Time;

	// 			setLoading(false);
    //             console.log('Data fetched: ', humd, temp, time);
	// 		} else {
	// 			console.log('it does not exist');
	// 		}
	// 	} catch (error) {
	// 		console.log('Error fetching data: ', error);
	// 	}
	// });
	// onDestroy(() => {
	// 	// Unsubscribe from Firebase when the component is destroyed
	// 	unsubscribe();
	// });


// Get the FCM token from Firebase
// export const getFCMToken = https.onRequest(async (req:any, res:any) => {
//   try {
//     const fcmTokenSnapshot = await admin.firestore().collection(FCM_TOKEN_COLLECTION).doc(FCM_TOKEN_KEY).get();
//     const fcmToken = fcmTokenSnapshot.data()![FCM_TOKEN_KEY];
//     res.status(200).send(fcmToken);

//     const message = "Notification send";

//     const payload = {
//         condition: "'your_condition_here'",
//         notification: {
//             title: "Expense Tracker: Your expense has been processed",
//             body: message,
//         }
//     };

//     admin.messaging().send(payload).then((response: any) => {
//         // Response is a message ID string.
//         console.log("Successfully sent message: ", response);
//     }).catch((error: any) => {
//         console.log('error: ', error);
//     }); 
//   } catch (error) {
//     console.error("Error getting FCM token:", error);
//     res.status(500).send("Error getting FCM token");
//   }
// });


// export const monitorTemperatureAndHumidity = functions.database
//   .ref("/BETAPEAK/{date}/{entryId}")
//   .onCreate(async (snapshot, context) => {
//     try {
//       const { Temp, Humd } = snapshot.val();
//       const date = context.params.date;
//       const entryId = context.params.entryId;
//       console.log(`New entry detected: ${entryId} - Temp: ${Temp}, Humd: ${Humd} `, date);
//       // Get FCM token from Firestore
//       const fcmTokenSnapshot = await admin
//         .firestore()
//         .collection(FCM_TOKEN_COLLECTION)
//         .doc(FCM_TOKEN_KEY)
//         .get();
//       const fcmToken = fcmTokenSnapshot.data()?.[FCM_TOKEN_KEY];

//       if (fcmToken) {
//         const payload = {
//           notification: {
//             title: "Temperature and Humidity Alert",
//             body: `Temperature: ${Temp}, Humidity: ${Humd}`,
//           },
//           token: fcmToken,
//         };

//         // Send notification
//         await admin.messaging().send(payload);
//         console.log("Notification sent:", payload);
//       } else {
//         console.log("FCM token not found in Firestore");
//       }
//     } catch (error) {
//       console.error("Error sending notification:", error);
//     }
//   });

  export const monitorTemperatureAndHumidity2 = functions.database
  .ref("/BETAPEAK/{date}/{entryId}")
  .onWrite(async (change, context) => {
    try {
      // Check if data is new or changed
      if (!change.before.exists() || change.after.val() !== change.before.val()) {
        const { Temp, Humd } = change.after.val();
        const date = context.params.date;
        const entryId = context.params.entryId;
        console.log(`New or changed entry: ${entryId} - Temp: ${Temp}, Humd: ${Humd} `, date);

        if ((24 >= Temp) || (29 <= Temp) || (85 >= Humd) || (95 <= Humd)) {
          let alertTitleTemp: string = '';
          let alertTitleHumd: string = '';
          let alertTitle: string = '';
          let alertMessagetemp: string = '';
          let alertMessagehumid: string = '';
          let alertMessage = '';
          if (24 >= Temp) {
              alertTitleTemp = 'Low Temperature'
              alertMessagetemp = 'Low temperature alert: The temperature has dropped to ' + Temp + '°C, which is below the recommended threshold.'
          } else if (29 <= Temp) {
              alertTitleTemp = 'High Temperature'
              alertMessagetemp = 'High temperature alert: The temperature has reached ' + Temp + '°C, which is above the recommended threshold.'
          }
          if (85 >= Humd) {
              alertTitleHumd = 'Low Humidity'
              alertMessagehumid = 'Low humidity alert: The humidity level has dropped to ' + Humd + '%, which is below the recommended threshold.'
          } else if (95 <= Humd) {
              alertTitleHumd = 'High Humidity'
              alertMessagehumid = 'High humidity alert: The humidity level has reached ' + Humd + '%, which is above the recommended threshold.'
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
  
         
          // Get FCM token from Firestore
          const fcmTokenSnapshot = await admin
            .firestore()
            .collection(FCM_TOKEN_COLLECTION)
            // .doc(FCM_TOKEN_KEY)
            .get();
          // const fcmToken = fcmTokenSnapshot.data()?.[FCM_TOKEN_KEY];
          fcmTokenSnapshot.forEach(async (doc:any) => {
            const fcmToken = doc.data()?.currentToken;
          
            if (fcmToken) {
              const payload = {
                notification: {
                  title: alertTitle,
                  body: alertMessage,
                },
                token: fcmToken,
              };
          
              // Send notification
              await admin.messaging().send(payload);
              console.log("Notification sent:", payload);


              // Save the data in Firestore
            const userCollection = collection(db, 'user', '123456', 'notifications');
            await addDoc(userCollection, {
              alertTitle: alertTitle,
              alertMessage: alertMessage,
              date: new Date(),
              humidity: Humd,
              temperature: Temp,
            });

            } else {
              console.log("FCM token not found in Firestore");
            }
          });
        }
        console.log("Temperature and Humidity are within the recommended range.");

    }} catch (error) {
      console.error("Error sending notification:", error);
    }
  });

