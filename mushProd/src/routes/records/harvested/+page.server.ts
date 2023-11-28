import type { PageServerLoad } from './$types';

import { getHourlyAverages } from '$lib/components/Data/calculateAverage';
import { allRemovedBags } from '$lib/firebase/allRecord';
import { allHarvestedGrams } from '$lib/firebase/allRecord';
import { getAllAveTempHumd } from '$lib/firebase/allRecord';
import { getDailyAverage } from '$lib/components/Data/calculateAverage';

export const load = (async () => {
    let sad: string = '';

    try {
        const hourly = await getHourlyAverages()

    } catch (error) {

    }


    return {
        allDailyAve: getDailyAverage(),
        allTempHumd: getAllAveTempHumd(),
        allHarvest: allHarvestedGrams(),
        allRemove: allRemovedBags()
    };
}) satisfies PageServerLoad;