<script lang="ts">
	// Import the functions you need from the SDKs you need
	import { getApp, getApps } from 'firebase/app';
	import { initializeApp } from 'firebase/app';
	import { onBackgroundMessage } from 'firebase/messaging/sw';
	import { getMessaging, getToken, isSupported } from 'firebase/messaging';

	// TODO: Add SDKs for Firebase products that you want to use
	// https://firebase.google.com/docs/web/setup#available-libraries

	// Your web app's Firebase configuration
	// For Firebase JS SDK v7.20.0 and later, measurementId is optional
	const firebaseConfig = {
		apiKey: import.meta.env.VITE_APIKEY,
		authDomain: import.meta.env.VITE_AUTH_DOMAIN,
		databaseURL: import.meta.env.VITE_DB_URL,
		projectId: import.meta.env.VITE_PROJECT_ID,
		storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
		messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
		appId: import.meta.env.VITE_APP_ID,
		measurementId: import.meta.env.VITE_MEASUREMENT_ID
	};

	// Initialize Firebase
	let firebaseApp;

	if (!getApps().length) {
		firebaseApp = initializeApp(firebaseConfig);
	} else {
		firebaseApp = getApp();
	}

	export const messaging = getMessaging(firebaseApp);
	let Regkey: string;
	const messaging1 = getMessaging();
	getToken(messaging1, {
		vapidKey:
			'BKCGjREYWFg3CLjeSHSwOSR2cy8JsGvtwmsmq3EPAsJU32IKumg1uLilX_01WtKKGEJhq3L-tHoMeCoItVJgHWs'
	})
		.then((currentToken) => {
			if (currentToken) {
				Regkey = currentToken;
				console.log(currentToken);
			} else {
				// Show permission request UI
				console.log('No registration token available. Request permission to generate one.');
				// ...
			}
		})
		.catch((err) => {
			console.log('An error occurred while retrieving token. ', err);
			// ...
		});
	onBackgroundMessage(messaging, (payload) => {
		console.log('[firebase-messaging-sw.js] Received background message ', payload);
		// Customize notification here
		const notificationTitle = 'Background Message Title';
		const notificationOptions = {
			body: 'Background Message body.',
			icon: '/firebase-logo.png'
		};
	});
</script>
