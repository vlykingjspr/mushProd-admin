
if ('serviceWorker' in navigator) {
	window.addEventListener('load', () => {
		navigator.serviceWorker
			.register('../../static/firebase-messaging-sw')
			.then((registration) => {
				console.log('Service Worker registered! Scope is:', registration.scope);
			})
			.catch((err) => {
				console.error('Service Worker registration failed:', err);
			});
	});
}