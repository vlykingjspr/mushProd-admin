import { writable } from 'svelte/store';

// Initialize the loading store with an initial value of false (not loading)
export const loading = writable(true);
export const setLoading = (value: boolean) => {
    loading.set(value);
};
export const currentPageTitle = writable('');
export const notifications = writable({
    id: '',
    date: '',
    alertTitle: '',
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
export const tempHumid = writable({
    id: '',
    date: '',
    ave_temp: 0,
    ave_humd: 0,
});
export const report = writable({
    // date: '',
});