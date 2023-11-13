import type { ToastSettings } from '@skeletonlabs/skeleton';

export function showSuccessToast(toastStore: any, message: string): void {
    const t: ToastSettings = {
        message,
        background: 'variant-filled-success',
        timeout: 5000,

    };
    toastStore.trigger(t);
}

export function showErrorToast(toastStore: any, message: string): void {
    const t: ToastSettings = {
        message,
        background: 'variant-filled-error',
        timeout: 5000,
    };
    toastStore.trigger(t);
}

export function showUpdateToast(toastStore: any, message: string): void {

    const t: ToastSettings = {
        message,
        background: 'variant-filled-tertiary',
        timeout: 5000,
    };
    toastStore.trigger(t);
}
// Add more functions for different types of toasts as needed
