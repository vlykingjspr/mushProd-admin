import { getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';

export function showSuccessToast(message: string): void {
    const toastStore = getToastStore();
    const t: ToastSettings = {
        message,
        background: 'variant-filled-success',
        timeout: 5000,

    };
    toastStore.trigger(t);
}

export function showErrorToast(message: string): void {
    const toastStore = getToastStore();
    const t: ToastSettings = {
        message,
        background: 'variant-filled-error',
        timeout: 5000,
    };
    toastStore.trigger(t);
}

export function showUpdateToast(message: string): void {
    const toastStore = getToastStore();
    const t: ToastSettings = {
        message,
        background: 'variant-filled-tertiary',
        timeout: 5000,
    };
    toastStore.trigger(t);
}
// Add more functions for different types of toasts as needed
