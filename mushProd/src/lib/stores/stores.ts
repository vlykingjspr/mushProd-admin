import { writable } from 'svelte/store';

// Initialize the loading store with an initial value of false (not loading)
export const loading = writable(true);
export const currentPageTitle = writable('Dashboard');
export const notifications = writable({
    id: '',
    date: '',
    temperature: 0,
    humidity: 0,
    alertMessage: ''
});
export const harvested = writable({
    id: '',
    date_harvested: '',
    grams: 0,
    remarks: '',
});
export const planted = writable({
    id: '',
    date: '',
    quantity: 0,
    remarks: '',
});
