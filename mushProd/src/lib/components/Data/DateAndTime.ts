import { format } from "date-fns";


export function dateFormat() {
    const date = new Date();
    const formattedDate = format(date, 'MMMM dd, yyyy')
    return formattedDate;
}
export function updateTime() {
    let currentTime: any;

    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

    // Convert hours to 12-hour format and determine AM/PM
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;

    return currentTime = `${hours}:${minutes}:${seconds} ${ampm}`;
}