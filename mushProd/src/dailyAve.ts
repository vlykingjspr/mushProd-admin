import cron from 'node-cron'
import { getDailyAverage } from "$lib/components/Data/calculateAverage";

async function getAndStoreDailyAverage() {
    await getDailyAverage();
}

cron.schedule('50 17 * * *', () => {
    getAndStoreDailyAverage();
});