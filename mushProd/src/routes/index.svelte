<script>
	let notification = { title: '', body: '' };

	const sendNotification = async () => {
		const registrationToken = 'YOUR_DEVICE_TOKEN'; // Replace with the actual device token
		const response = await fetch('/firebaseAdmin/sendNotif.js', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				registrationToken,
				title: notification.title,
				body: notification.body
			})
		});

		const result = await response.json();
		console.log(result);
	};
</script>

<main>
	<h1>Hello SvelteKit!</h1>

	<input bind:value={notification.title} placeholder="Notification Title" />
	<textarea bind:value={notification.body} placeholder="Notification Body" />

	<button on:click={sendNotification}>Send Notification</button>
</main>
