import {getToken,onMessage} from "firebase/messaging";
import {db, messaging} from "./firebase";
import {doc, setDoc} from "firebase/firestore";

const VAPID_KEY = "BKCGjREYWFg3CLjeSHSwOSR2cy8JsGvtwmsmq3EPAsJU32IKumg1uLilX_01WtKKGEJhq3L-tHoMeCoItVJgHWs";
const FCM_TOKEN_COLLECTION = "fcmTokens";


export async function requestNotificationPermission(uid: any) {
    
    console.log('Requesting permission...');
    const permission = Notification.requestPermission();

    if (await permission === 'granted') {
        await saveMessagingDeviceToken(uid);
        console.log('Notification permission granted.');
    } else {
        console.log('Unable to get permission to notify.');
    }

}

export async function saveMessagingDeviceToken(uid: any) {
    
        const msg = await messaging();

        
        if (msg) {
            const currentToken = await getToken(msg, { vapidKey: VAPID_KEY });
            // console.log('Got token: ', currentToken);
            if (currentToken) {
                console.log('Sending token to server...');
                const tokenRef = doc(db, FCM_TOKEN_COLLECTION, uid)
                await setDoc(tokenRef, { currentToken });

                onMessage(msg, (message) => {
                    if (message.notification) {
                        console.log(
                            'New foreground notification from Firebase Messaging!',
                            message.notification
                        );
                        if (message.notification.title && message.notification.body) {
                            new Notification(message.notification.title, { body: message.notification.body });
                        } else {
                            console.log('Notification title or body is undefined.');
                        }
                    } else {
                        console.log('No notification data in the message.');
                    }
                });

            } else {
                console.log('No registration token available. Request permission to generate one.');
            }
        } else {
            console.log('Messaging is not available.');
        }
    
  }

 