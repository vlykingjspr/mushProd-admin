import { writable } from "svelte/store";

export let tabNum = writable(0)

export function updateTab(tabNumber: number) {
    tabNum.set(tabNumber);


}