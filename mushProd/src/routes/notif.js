import { FCM } from 'fcm-node';
	// const FCM = require('fcm-node');

	const serverKey =
		'AAAAZxDoxD4:APA91bEpELgiut0ES2WIT5wSAFDwnD2JJFsq9kpMQ9IcnWAN8UOxgHMcKfnngJ9Mdzg_oZBKHCllm2zFLhlaU404GzdXxfm5Nkdtdtuh5UWKtAAjy4XhQXkQof94Fnx3vvVb592nQy0U';
	const fcm = new FCM(serverKey);

	const message = {
		to: 'registration_token',
		collapse_key: 'your_collapse_key',

		notification: {
			title: 'Title of your push notification',
			body: 'Body of your push notification'
		},

		data: {
			//you can send only notification or only data(or include both)
			my_key: 'my value',
			my_another_key: 'my another value'
		}
	};
	fcm.send(message, function () {
		console.log('Something has gone wrong!');
	});