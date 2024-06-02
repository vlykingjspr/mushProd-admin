import { writable } from 'svelte/store';
import { onSnapshot, collection } from 'firebase/firestore';
import { getModalStore } from '@skeletonlabs/skeleton';
import type { ModalSettings } from '@skeletonlabs/skeleton';
import { db } from '$lib/firebase/firebase';
import { initializeStores, Modal } from '@skeletonlabs/skeleton';
import { set } from 'date-fns';


export const notificationVisited = writable(false);
export function initializeNotificationsStore(modalStore: any) {
    const notificationsStore = writable([]);

    let ignoreInitialSnapshot = true;
    let modalShown = false
    const notificationsRef = collection(db, 'user', '123456', 'notifications');

    let j = 0;

    onSnapshot(notificationsRef, async (snapshot) => {
        for (const change of snapshot.docChanges()) {

            if (change.type === 'added' && !ignoreInitialSnapshot && !modalShown) {
                const docData = change.doc.data(); // Get the document data
                const alertTitle = docData.alertTitle; // Get the alertTitle field
                const alertMessage = docData.alertMessage;

                const modal = {
                    type: 'alert',
                    title: " Alert! " + alertTitle,
                    body: alertMessage,
                    buttonTextCancel: 'Ok',
                };
                modalStore.trigger(modal);
                notificationVisited.set(false);
                modalShown = true;
                setTimeout(() => {
                    modalShown = false;
                }, 5000);
            }
        }

        if (ignoreInitialSnapshot) {
            ignoreInitialSnapshot = false;
        }
    });

    return notificationsStore;
}