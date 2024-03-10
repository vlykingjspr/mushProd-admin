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
    batch_id: '',
    id: '',
    date: '',
    grams: 0,
    remarks: '',
});
export const planted = writable({
    id: '',
    date: '',
    quantity: 0,
    removed: 0,
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
export const batch = writable({
    id: '',
    batch_code: '',
    batch_planted: '',
    batch_remarks: '',
    batch_total_bags: 0,
    batch_total_removed: 0,
})

export const growing = writable({
    batchCode: '',
    growthDuration: '',
    totalBags: '',
    averageTemperature: 0,
    averageHumidity: 0,
    analysisStat: '',
    analysisMessage: '',
    totalGrams: 0,
    analysistempSugg: '',
    analysishumdSugg: '',

})
