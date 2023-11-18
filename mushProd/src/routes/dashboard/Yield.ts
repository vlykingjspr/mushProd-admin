import { onMount } from 'svelte';


export async function yieldRes() {
    const url = 'https://mushprod-api-d34b935be1f6.herokuapp.com/predict';
    const input_data = {
        bags: 50,
        temp: 23.5,
        hum: 60,
    };

    onMount(() => {
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(input_data),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('HTTP error! Status:' + response.status);
                }
                return response.json();
            })
            .then((data) => {
                console.log('Predicted Weight: ', data.predicted_weight, data.unit);
            })
            .catch((error) => console.log('Error in fetching data:', error));
    });
}