<script>
	import Authenticate from '../lib/components/Authenticate.svelte';
	import { getMessaging, onMessage } from 'firebase/messaging';

	const messaging = getMessaging();
	onMessage(messaging, (payload) => {
		console.log('Message received. ', payload);
		// Handle the message. Show a notification, etc.
	});
</script>

<Authenticate />
